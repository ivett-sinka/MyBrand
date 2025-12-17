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
    animateWaveLine(); // Start wave line animation
});

// Wave Line Animation
function animateWaveLine() {
    const waveLine = document.getElementById('wave-line');
    if (!waveLine) return;

    const width = 1000;
    const centerY = 10;
    let time = 0;
    let phase = 'drawing'; // phases: 'drawing', 'smoothing'
    const drawDuration = 2000; // 2 seconds to draw
    const smoothDuration = 800; // 0.8 seconds to smooth out

    const startTime = Date.now();

    function generateWavePath(amplitude, frequency, progress = 1) {
        let path = `M 0,${centerY}`;
        const segments = 100;
        const drawLength = width * progress;

        for (let i = 1; i <= segments; i++) {
            const x = (i / segments) * drawLength;
            const waveOffset = Math.sin((i / segments) * frequency * Math.PI * 2 + time) * amplitude;
            const y = centerY + waveOffset;
            path += ` L ${x},${y}`;
        }

        // If not fully drawn, keep the rest straight
        if (progress < 1) {
            path += ` L ${width},${centerY}`;
        }

        return path;
    }

    function animate() {
        const elapsed = Date.now() - startTime;
        time += 0.08;

        if (phase === 'drawing') {
            // Drawing phase: wave while drawing (0-2s)
            const progress = Math.min(elapsed / drawDuration, 1);
            const amplitude = 3 * Math.sin(progress * Math.PI); // Gentle wave while drawing
            waveLine.setAttribute('d', generateWavePath(amplitude, 2, progress));

            if (elapsed >= drawDuration) {
                phase = 'smoothing';
            }
        } else if (phase === 'smoothing') {
            // Smoothing phase: gradually flatten (2-2.8s)
            const smoothElapsed = elapsed - drawDuration;
            const smoothProgress = smoothElapsed / smoothDuration;
            const amplitude = 3 * (1 - smoothProgress); // Decrease amplitude to 0
            waveLine.setAttribute('d', generateWavePath(amplitude, 2));

            if (smoothElapsed >= smoothDuration) {
                // Final state: straight line and ensure visibility
                waveLine.setAttribute('d', `M 0,${centerY} L ${width},${centerY}`);
                waveLine.style.opacity = '1';
                waveLine.style.strokeDashoffset = '0';
                return; // Stop animation
            }
        }

        requestAnimationFrame(animate);
    }

    // Start animation after a small delay
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 100);
}
