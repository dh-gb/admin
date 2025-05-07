// utils/button.js
export function disableButton(button) {
    button.disabled = true;
    button.style.opacity = '0.5';
    button.style.pointerEvents = 'none';
    button.dataset.originalText = button.textContent;
    button.textContent = 'Submitting...'; // Optional: show loading text
}



export function enableButton(button) {
    button.disabled = false;
    button.style.opacity = '1';
    button.style.pointerEvents = 'auto';
    if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
    }
}


export function disablelgnButton(button) {
    button.disabled = true;
    button.style.opacity = '0.5';
    button.style.pointerEvents = 'none';
}

export function enablelgnButton(button) {
    button.disabled = false;
    button.style.opacity = '1';
    button.style.pointerEvents = 'auto';
}