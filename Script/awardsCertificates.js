import { disableButton, enableButton } from './button.js';
const form = document.getElementById('awardscertificatesForm');
const awardimageInput = document.getElementById('awardimageInput');
const list = document.getElementById('awardscertificateList');
const submitBtn = document.getElementById('awd_button');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    disableButton(submitBtn);
    const file = awardimageInput.files[0];

    if (!file) {
        alert("Please upload an image.");
        return;
    }

    const resizedBlob = await resizeImage(file, 1024); // resize to 800px width (maintains aspect ratio)

    const formData = new FormData();
    formData.append('image', resizedBlob, file.name); // Pass resized blob
    formData.append('description', document.getElementById('descriptionInput').value);
    try {
        const response = await fetch('https://dh-ganderbal-backend.onrender.com/api/awardsCertificates', {
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
        loadAllawardsCertificatesEntries()

    } catch (error) {
        console.error("Upload error:", error);
        alert("Something went wrong while uploading.");
    }finally {
        enableButton(submitBtn);
      }
});

function resizeImage(file, maxSize) {
    return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            const { width, height } = img;

            // Maintain aspect ratio - scale longest side to maxSize
            let newWidth, newHeight;

            if (width > height) {
                newWidth = maxSize;
                newHeight = (height / width) * maxSize;
            } else {
                newHeight = maxSize;
                newWidth = (width / height) * maxSize;
            }

            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Compress to JPEG at high quality
            canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.85); // You can tweak 0.85 if needed
        };

        reader.readAsDataURL(file);
    });
}

export function loadAllawardsCertificatesEntries() {
    fetch('https://dh-ganderbal-backend.onrender.com/api/awardsCertificates') // Adjusted the endpoint to match the backend route
        .then(res => res.json())
        .then(data => {
            list.innerHTML = '';
            data.forEach(entry => awardsCertificatesEntry(entry)); // Assuming you have a function to display the entries
        })
        .catch(error => {
            console.error('Error fetching Awards and Certificates entries:', error);
            alert('Failed to load Awards and Certificates entries.');
        });
}

// Function to display the management entry along with the delete button
function awardsCertificatesEntry(entry) {
    const item = document.createElement('div');
    item.setAttribute('data-id', entry._id); // Store the entry's unique ID for deletion reference
    item.className = 'data-entry';
    item.style.display = 'flex';
    item.style.gap = '10px';
    item.style.marginTop = '10px';
    item.innerHTML = `
        <img src="${entry.imageUrl_2}" class="passport" alt="Image" />
        <div>
            <p><strong>Description:</strong> ${entry.description}</p>
        </div>
        <button class="delete-btn" onclick="deleteawardsCertificatesEntry('${entry._id}')">Delete</button>
    </div >
        `;
    list.prepend(item);
}

// Function to delete the management entry from the server
window.deleteawardsCertificatesEntry = function (id) {
    const confirmDelete = confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;

    fetch(`https://dh-ganderbal-backend.onrender.com/api/awardsCertificates/${id}`, {
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

