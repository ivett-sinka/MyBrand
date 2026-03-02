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
// progress 0   → logo BOTTOM enters viewport BOTTOM  (animation begins)
// progress 0.5 → logo CENTER at viewport CENTER      (middle state)
// progress 1   → logo TOP reaches viewport TOP       (final state reached)
//
// Reverse scrolling mirrors all three states exactly.
//
// The <g> group rotates CCW around the SVG canvas centre (326, 326):
//   0° (start) → -90° (middle, matches logo-grafikai-elem-kozepso-allas.svg)
//             → -180° (end, mirror of original)
// The wrapper scales 1 → 0.4 → 1 so the logo shrinks at the midpoint.

function initLogoScrollAnimation() {
    const logoWrapper = document.getElementById('logo-wrapper');
    const logoPaths  = document.getElementById('logo-paths');

    if (!logoWrapper || !logoPaths) return;

    // Layout values cached so CSS transform on the wrapper never interferes.
    // offsetTop / offsetHeight are layout-based and unaffected by transform.
    let elemTop    = 0;
    let elemHeight = 0;

    function recalcLayout() {
        elemHeight = logoWrapper.offsetHeight;
        elemTop    = 0;
        let el     = logoWrapper;
        while (el) {
            elemTop += el.offsetTop;
            el       = el.offsetParent;
        }
    }

    function getScrollProgress() {
        const vh      = window.innerHeight;
        const scrollY = window.scrollY || window.pageYOffset;

        // scrollY when logo BOTTOM touches viewport BOTTOM:
        const scrollStart = elemTop + elemHeight - vh;
        // scrollY when logo TOP touches viewport TOP:
        const scrollEnd   = elemTop;
        const range       = scrollEnd - scrollStart; // = vh - elemHeight

        if (range <= 0) return 0.5; // logo taller than viewport
        return Math.max(0, Math.min(1, (scrollY - scrollStart) / range));
    }

    function updateLogo() {
        const progress = getScrollProgress();

        // CCW rotation: 0° → -90° → -180°
        const rotation = -progress * 180;

        // Scale: 1 → 0.4 → 1  (sine arc, minimum at progress = 0.5)
        const scale = 1 - 0.6 * Math.sin(progress * Math.PI);

        logoPaths.setAttribute('transform', `rotate(${rotation}, 326, 326)`);
        logoWrapper.style.transform = `scale(${scale})`;
    }

    window.addEventListener('scroll', updateLogo, { passive: true });
    window.addEventListener('resize', () => { recalcLayout(); updateLogo(); });

    recalcLayout();
    updateLogo(); // Set initial state
}

// Start the animation when page loads
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeWriter, 1000); // Start after page load animation
    initLogoScrollAnimation();
});
