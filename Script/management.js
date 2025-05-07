import { disableButton, enableButton } from './button.js';
const form = document.getElementById('managementForm');
const imageInput = document.getElementById('imageInput');
const list = document.getElementById('managementList');
const submitBtn = document.getElementById('mgmt_button');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    disableButton(submitBtn);
    const file = imageInput.files[0];

    if (!file) {
        alert("Please upload an image.");
        return;
    }

    const resizedBlob = await resizeImage(file, 800); // resize to 800px width (maintains aspect ratio)

    if (resizedBlob.size > 300 * 1024) {
        alert("Resized image still exceeds 300KB. Please resize your image and upload again.");
        return;
    }

    const formData = new FormData();
    formData.append('image', resizedBlob, file.name); // Pass resized blob
    formData.append('name', document.getElementById('nameInput').value);
    formData.append('education', document.getElementById('educationInput').value);
    formData.append('designation', document.getElementById('designationInput').value);

    try {
        const response = await fetch('https://dh-ganderbal-backend.onrender.com/api/management', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Upload failed");
        }

        alert("Entry added successfully!");
        form.reset();
        loadAllManagementEntries();

    } catch (error) {
        console.error("Upload error:", error);
        alert("Something went wrong while uploading.");
    }finally {
            enableButton(submitBtn);
          }
});

// 🖼️ Image resizing using canvas
function resizeImage(file, maxWidth) {
    return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8); // 80% quality
        };

        reader.readAsDataURL(file);
    });
}

export function loadAllManagementEntries() {
    fetch('https://dh-ganderbal-backend.onrender.com/api/management') // Adjusted the endpoint to match the backend route
        .then(res => res.json())
        .then(data => {
            list.innerHTML = '';
            data.forEach(entry => displayManagementEntry(entry)); // Assuming you have a function to display the entries
        })
        .catch(error => {
            console.error('Error fetching management entries:', error);
            alert('Failed to load management entries.');
        });
}


// Function to display the management entry along with the delete button
function displayManagementEntry(entry) {
    const item = document.createElement('div');
    item.setAttribute('data-id', entry._id); // Store the entry's unique ID for deletion reference
    item.className = 'data-entry';
    item.style.display = 'flex';
    item.style.gap = '10px';
    item.style.marginTop = '10px';
    item.innerHTML = `
        <img src="${entry.imageUrl}" class="passport" alt="Image" />
        <div>
            <p><strong>Name:</strong> ${entry.name}</p>
            <p><strong>Education:</strong> ${entry.education}</p>
            <p><strong>Designation:</strong> ${entry.designation}</p>
        </div>
        <button class="delete-btn" onclick="deleteManagementEntry('${entry._id}')">Delete</button>
    </div >
        `;
    list.appendChild(item);
}

// Function to delete the management entry from the server
window.deleteManagementEntry = function (id) {
    const confirmDelete = confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;

    fetch(`https://dh-ganderbal-backend.onrender.com/api/management/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete the entry.");
            }
            return response.json();
        })
        .then(() => {
            // Remove the entry from the UI
            const entryElement = document.querySelector(`[data-id="${id}"]`);
            if (entryElement) {
                entryElement.remove();
            }

            alert("Entry deleted successfully!");
        })
        .catch(error => {
            console.error("Delete error:", error);
            alert("Something went wrong while deleting the entry.");
        });
}

