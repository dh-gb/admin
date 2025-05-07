import { disablelgnButton, enablelgnButton } from './button.js';

window.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");

    loginBtn.addEventListener("click", (event) => login(event, loginBtn));

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            login(event, loginBtn);
        }
    });
});

async function login(event, loginBtn) {
    event.preventDefault();
    disablelgnButton(loginBtn);

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('https://dh-ganderbal-backend.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        });

        if (response.ok) {
            window.location.href = "./main.html";
        } else {
            const errorData = await response.json();
            alert(errorData.message);
            enablelgnButton(loginBtn);
        }
    } catch (error) {
        console.error(error);
        alert('Login error: ' + error.message);
        enablelgnButton(loginBtn);
    }
}


