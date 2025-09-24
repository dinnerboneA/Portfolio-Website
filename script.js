const menuIcon = document.querySelector('#menu-icon');
const navlinks = document.querySelector('.nav-links');

menuIcon.onclick = () => {
    navlinks.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const batContainer = document.getElementById('bat-container');
    const batImage = document.getElementById('bat-image');
    let cursorTimeout;
    let isBatActive = false;
    let circleInterval; // Keep a reference to the interval to clear it

    const INACTIVITY_TIME = 5000;
    const FLIGHT_DURATION = 3000; // This should match the 'transform' duration in your CSS

    // Function to show the bat and start its animation
    const showBat = (mouseX, mouseY) => {
        if (isBatActive) return;

        isBatActive = true;
        const screenWidth = window.innerWidth;
        
        // Start position is off-screen
        const startX = (Math.random() > 0.5) ? -100 : screenWidth + 100;
        
        // Set GIF based on direction
        batImage.src = (startX < mouseX) ? 'bat-right.gif' : 'bat-left.gif';

        // Position the bat off-screen using transform
        batContainer.style.transition = 'none'; // Temporarily disable transition to set start point
        batContainer.style.transform = `translate(${startX}px, ${mouseY}px)`;
        batContainer.style.opacity = '1';

        // Force browser to apply the change before re-enabling transition
        setTimeout(() => {
            batContainer.style.transition = `transform ${FLIGHT_DURATION / 1000}s linear, opacity 1s ease-in-out`;
            // Animate to the cursor position
            batContainer.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        }, 20);

        // After the bat arrives, start circling
        setTimeout(() => {
            if (isBatActive) {
                startCircling(mouseX, mouseY);
            }
        }, FLIGHT_DURATION);
    };

    // Function for the circling behavior
    const startCircling = (centerX, centerY) => {
        const radius = 70; // Smaller radius looks better for circling
        let angle = 0;
        let lastDirection = '';

        // Make the bat transition smoothly during circling
        batContainer.style.transition = 'transform 0.1s linear';

        circleInterval = setInterval(() => {
            if (!isBatActive) {
                clearInterval(circleInterval);
                return;
            }

            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            // Determine direction based on angle
            const direction = Math.sin(angle) > 0 ? 'left' : 'right';

            if (direction !== lastDirection) {
                batImage.src = (direction === 'left') ? 'bat-left.gif' : 'bat-right.gif';
                lastDirection = direction;
            }
            
            batContainer.style.transform = `translate(${x}px, ${y}px)`;
            angle += 0.1; // Circling speed
        }, 50);
    };

    // Function to hide the bat
    const hideBat = () => {
        if (!isBatActive) return;
        isBatActive = false;
        clearInterval(circleInterval); // IMPORTANT: Stop the circling interval

        // Get the current transformed position
        const transformMatrix = new WebKitCSSMatrix(window.getComputedStyle(batContainer).transform);
        const currentX = transformMatrix.m41;

        const screenWidth = window.innerWidth;
        const flyOffX = (currentX > screenWidth / 2) ? screenWidth + 100 : -100;
        
        batImage.src = (flyOffX > currentX) ? 'bat-right.gif' : 'bat-left.gif';
        
        // Use the current Y position for a smooth exit
        const currentY = transformMatrix.m42;
        batContainer.style.transition = `transform ${FLIGHT_DURATION / 1000}s linear, opacity 1s ease-in-out`;
        batContainer.style.transform = `translate(${flyOffX}px, ${currentY}px)`;
        batContainer.style.opacity = '0';
    };

    // Reset timer on any mouse movement
    document.addEventListener('mousemove', (e) => {
        clearTimeout(cursorTimeout);
        if (isBatActive) {
            hideBat();
        }
        cursorTimeout = setTimeout(() => showBat(e.clientX, e.clientY), INACTIVITY_TIME);
    });
    

    // Handle touch events for mobile
    document.addEventListener('touchstart', () => {
        clearTimeout(cursorTimeout);
        if (isBatActive) {
            hideBat();
        }
    });

    document.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        clearTimeout(cursorTimeout);
        cursorTimeout = setTimeout(() => showBat(touch.clientX, touch.clientY), INACTIVITY_TIME);
    });

    // ... your existing code for touch events ...
    document.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        clearTimeout(cursorTimeout);
        cursorTimeout = setTimeout(() => showBat(touch.clientX, touch.clientY), INACTIVITY_TIME);
    });


}); // This is the closing tag for DOMContentLoaded

