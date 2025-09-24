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

    // The time in milliseconds the cursor has to be inactive before the bat appears (10 seconds)
    const INACTIVITY_TIME = 3000; 

    // Function to show the bat and start its animation
    const showBat = (mouseX, mouseY) => {
        if (isBatActive) return; // Prevent multiple bats from appearing

        isBatActive = true;
        const screenWidth = window.innerWidth;
        
        // Decide whether to start the bat from the left or right
        const startPositionX = (Math.random() > 0.5) ? -100 : screenWidth + 100;
        const targetPositionX = mouseX;
        
        // Change the GIF based on the direction of travel
        if (startPositionX === -100) {
            batImage.src = 'bat-right.gif'; // Moving from left to right
        } else {
            batImage.src = 'bat-left.gif'; // Moving from right to left
        }

        // Set the bat's initial position
        batContainer.style.top = `${mouseY}px`;
        batContainer.style.left = `${startPositionX}px`;

        // Make the bat visible and animate its movement to the cursor
        setTimeout(() => {
            batContainer.style.opacity = '1';
            batContainer.style.transform = `translate(${targetPositionX - startPositionX}px, 0)`;
        }, 50);

        // After the bat arrives, it will "circle" the cursor
        setTimeout(() => {
            if (isBatActive) {
                // The bat is now around the cursor, start the circling animation
                startCircling(targetPositionX, mouseY);
            }
        }, 3000); // Wait for 2 seconds (the CSS transition time)
    };

// Function for the circling behavior
const startCircling = (centerX, centerY) => {
    const radius = 400; // Radius of the circle
    let angle = 0; // Starting angle
    let currentDirection = ''; // Store the current bat direction

    const circleInterval = setInterval(() => {
        if (!isBatActive) {
            clearInterval(circleInterval); // Stop circling if the bat is inactive
            return;
        }

        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Determine the new direction based on the bat's horizontal movement
        const newDirection = (Math.cos(angle) > 0) ? 'right' : 'left';
        
        // Only change the GIF source if the direction has flipped
        if (newDirection !== currentDirection) {
            if (newDirection === 'right') {
                batImage.src = 'bat-right.gif';
            } else {
                batImage.src = 'bat-left.gif';
            }
            currentDirection = newDirection;
        }

        batContainer.style.transform = `translate(${x - batContainer.offsetLeft}px, ${y - batContainer.offsetTop}px)`;
        
        angle += 0.1; // Adjust speed of circling
    }, 50);
};

    // Function to hide the bat
    const hideBat = () => {
        if (!isBatActive) return;
        isBatActive = false;
        
        // Get current position
        const currentX = batContainer.offsetLeft;
        const screenWidth = window.innerWidth;

        // Decide which way to fly off screen
        const flyOffX = (currentX > screenWidth / 2) ? screenWidth + 100 : -100;

        batContainer.style.opacity = '0';
        batContainer.style.transform = `translate(${flyOffX - currentX}px, 0)`;
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
});