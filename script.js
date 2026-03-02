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

// ─── Logo scroll animation ───────────────────────────────────────────────────
//
// Scroll progress 0   → element enters viewport from below
//   rotation  0°, scale 1  (original state: logo-grafikai-elem.svg)
// Scroll progress 0.5 → element centre at viewport centre
//   rotation -90°, scale 0.4  (middle state: logo-grafikai-elem-kozepso-allas.svg)
// Scroll progress 1   → element exits viewport from above
//   rotation -180°, scale 1  (mirror of original)
//
// The <g> group rotates CCW around the SVG canvas centre (326, 326).
// The wrapper scales uniformly to mimic the size change shown in the middle state.

function initLogoScrollAnimation() {
    const logoWrapper = document.getElementById('logo-wrapper');
    const logoPaths  = document.getElementById('logo-paths');

    if (!logoWrapper || !logoPaths) return;

    function getScrollProgress() {
        const rect          = logoWrapper.getBoundingClientRect();
        const vh            = window.innerHeight;
        const totalDistance = vh + rect.height;
        const traveled      = vh - rect.top;
        return Math.max(0, Math.min(1, traveled / totalDistance));
    }

    function updateLogo() {
        const progress = getScrollProgress();

        // CCW rotation: 0° → -90° → -180°
        const rotation = -progress * 180;

        // Scale: 1 → 0.4 → 1  (sine curve peaks at progress = 0.5)
        const scale = 1 - 0.6 * Math.sin(progress * Math.PI);

        logoPaths.setAttribute('transform', `rotate(${rotation}, 326, 326)`);
        logoWrapper.style.transform = `scale(${scale})`;
    }

    window.addEventListener('scroll', updateLogo, { passive: true });
    updateLogo(); // Set initial state
}

// Start the animation when page loads
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeWriter, 1000); // Start after page load animation
    initLogoScrollAnimation();
});
