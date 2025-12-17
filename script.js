// Greetings array in different languages
const greetings = ['Hello', 'Szia', 'Hola', 'Bonjour'];
let currentGreetingIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let isPaused = false;

const greetingElement = document.getElementById('greeting');

// Typing speed settings
const typingSpeed = 150; // milliseconds per character when typing
const deletingSpeed = 100; // milliseconds per character when deleting
const pauseDuration = 3000; // pause duration after complete word (3 seconds)
const pauseBeforeDelete = 500; // short pause before starting to delete

function typeWriter() {
    const currentGreeting = greetings[currentGreetingIndex];

    if (isPaused) {
        return;
    }

    if (!isDeleting && currentCharIndex <= currentGreeting.length) {
        // Typing phase
        greetingElement.textContent = currentGreeting.substring(0, currentCharIndex);
        currentCharIndex++;

        if (currentCharIndex > currentGreeting.length) {
            // Finished typing, pause before deleting
            isPaused = true;
            setTimeout(() => {
                isPaused = false;
                isDeleting = true;
                setTimeout(typeWriter, pauseBeforeDelete);
            }, pauseDuration);
            return;
        }

        setTimeout(typeWriter, typingSpeed);
    } else if (isDeleting && currentCharIndex > 0) {
        // Deleting phase
        currentCharIndex--;
        greetingElement.textContent = currentGreeting.substring(0, currentCharIndex);

        if (currentCharIndex === 0) {
            // Finished deleting, move to next greeting
            isDeleting = false;
            currentGreetingIndex = (currentGreetingIndex + 1) % greetings.length;
            setTimeout(typeWriter, 500);
            return;
        }

        setTimeout(typeWriter, deletingSpeed);
    }
}

// Start the animation when page loads
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeWriter, 1000); // Start after page load animation
});
