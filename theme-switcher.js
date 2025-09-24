document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeStylesheet = document.getElementById('theme-style');
    const body = document.body;
    const backgroundContainer = document.getElementById('background-container');

    const lightThemePath = 'light-style.css';
    const darkThemePath = 'dark-style.css';

    const setTheme = (theme) => {
        if (theme === 'dark') {
            themeStylesheet.href = darkThemePath;
            body.classList.add('dark-theme');
            backgroundContainer.style.backgroundImage = "url('Background-dark.png')";
            themeToggle.checked = true; // Semicolon added
        } else {
            themeStylesheet.href = lightThemePath;
            body.classList.remove('dark-theme');
            backgroundContainer.style.backgroundImage = "url('Background-light.png')";
            themeToggle.checked = false; // Semicolon added
        }
        localStorage.setItem('theme', theme);
    };

    // --- LOGIC FOR INITIAL PAGE LOAD ---
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    let initialTheme = 'dark';
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        initialTheme = 'light';
    }
    setTheme(initialTheme);

    // --- EVENT LISTENER FOR THE SLIDER ---
    themeToggle.addEventListener('change', (event) => {
        if (event.target.checked) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    });
});