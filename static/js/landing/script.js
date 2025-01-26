// static/js/landing/script.js
window.addEventListener('DOMContentLoaded', () => {
    const splash = document.querySelector('.splash');
    const content = document.querySelector('.content');

    // Wait for the splash animation to complete
    splash.addEventListener('animationend', () => {
        splash.classList.add('hidden'); // Hide splash after animation
        content.classList.remove('hidden'); // Reveal the content
    });
});