import { disableButton, enableButton } from './button.js';
const form = document.getElementById('latestUpdatesForm');
const list = document.getElementById('latestUpdatesList');
const submitBtn = document.getElementById('updt_button');
// 👉 Start by loading all saved PDF updates when page loads

// 📤 Handle form submission when admin uploads a new PDF
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent page reload
    disableButton(submitBtn);
    const description = document.getElementById('title').value;
    const pdfFile = document.getElementById('pdf').files[0];

    // Check if file and description are provided
    if (!description || !pdfFile) {
        alert('Please enter a description and select a PDF file.');
        return;
    }

    uploadPDFUpdate(description, pdfFile);
});

/* ============================================================
   FUNCTION: Load all updates from backend and display on page
============================================================ */
export function loadAllPDFUpdates() {
    fetch('https://dh-ganderbal-backend.onrender.com/api/latest-updates')
        .then(res => res.json())
        .then(data => {
            list.innerHTML = '';
            data.forEach(entry => displayPDFUpdate(entry));
        })
        .catch(error => {
            console.error('Error fetching updates:', error);
            alert('Failed to load PDF updates.');
        });
}

/* ============================================================
   FUNCTION: Upload a new PDF to backend
============================================================ */
function uploadPDFUpdate(description, pdfFile) {
    const formData = new FormData();
    formData.append('title', description);
    formData.append('pdf', pdfFile);

    fetch('https://dh-ganderbal-backend.onrender.com/api/latest-updates', {
        method: 'POST',
        body: formData,
        credentials: 'include',
    })
        .then(response => {
            return response.json().then(data => {
                return {
                    status: response.status,
                    ok: response.ok,
                    data: data
                };
            });
        })

        .then(result => {
            if (!result.ok) {
                throw new Error(result.data.error || 'Upload failed');
            }

            alert('PDF uploaded successfully!');
            form.reset(); // Clear form inputs
            loadAllPDFUpdates() // Show new update on page
        })
        .catch(error => {
            console.error('Upload error:', error);
            alert('Something went wrong while uploading.');
        })
        .finally(() => {
            enableButton(submitBtn);
        });
}

/* ============================================================
   FUNCTION: Show one PDF update on the page
============================================================ */
function displayPDFUpdate(entry) {
    const item = document.createElement('div');
    item.id = entry._id;
    item.className = 'data-entry';
    item.innerHTML = `
    <p>
      <a href="${entry.PDFfileUrl}" style="text-decoration:none" download>${entry.title}</a>
      <button onclick="deletePDFUpdate('${entry._id}')" style="margin-left:10px;">Delete</button>
    </p>
  `;

    list.prepend(item);
}

/* ============================================================
   FUNCTION: Delete a PDF entry from backend and page
============================================================ */
window.deletePDFUpdate = function (id) {
    const confirmDelete = confirm('Are you sure you want to delete this PDF?');
    if (!confirmDelete) return;

    fetch(`https://dh-ganderbal-backend.onrender.com/api/latest-updates/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete the PDF.");
            }
            return response.json();
        })
        .then(() => {
            // Remove the entry from the UI
            const entryElement = document.getElementById(id);
            if (entryElement) {
                entryElement.remove();
            }

            alert("PDF deleted successfully!");
        })
        .catch(error => {
            console.error("Delete error:", error);
            alert("Something went wrong while deleting the entry.");
        });
};

