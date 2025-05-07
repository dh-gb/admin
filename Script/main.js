//Before moving to firebase 

import { initOPD } from './opd.js';
import { initEMG } from './emg.js';
import { loadAllPDFUpdates } from './latestUpdates.js';
import { loadAllManagementEntries } from './management.js';
import { loadAllawardsCertificatesEntries } from './awardsCertificates.js';

window.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus(); // Check login when admin UI loads

    // Logout handler

    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await fetch('https://dh-ganderbal-backend.onrender.com/api/logout', {
                method: 'POST',
                credentials: 'include' // Required to send the auth cookie
            });
        } catch (err) {
            console.error("Logout failed, but continuing to redirect.");
        }

        window.location.href = './index.html';
    });

});

// Check if user is logged in using cookie
function checkLoginStatus() {
    fetch('https://dh-ganderbal-backend.onrender.com/api/protected-endpoint', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Send cookies
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unauthorized');
            }
            return response.json();
        })
        .then(() => {
            // Load all admin data only if authenticated
            initOPD();
            initEMG();
            loadAllPDFUpdates();
            loadAllManagementEntries();
            loadAllawardsCertificatesEntries();
        })
        .catch(error => {
            console.error('Error fetching protected data:', error);
            alert('Session expired or unauthorized. Please login again.');
            window.location.href = './index.html';
        });
}