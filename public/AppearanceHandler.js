(function() {
    const savedTheme = localStorage.getItem('aurora-theme') || 'light';
    const savedDensity = localStorage.getItem('aurora-density') || 'comfortable';

    if (savedTheme === 'dark') {
        document.body.classList.add('theme-dark');
    } else {
        document.body.classList.remove('theme-dark');
    }

    document.documentElement.setAttribute('data-density', savedDensity);
})();

document.addEventListener("DOMContentLoaded", () => {
    const lightOption = document.getElementById('light-option');
    const darkOption = document.getElementById('dark-option');
    const densitySelect = document.getElementById('density-select');

    function updateTheme(theme) {
        localStorage.setItem('aurora-theme', theme);
        if (theme === 'dark') {
            document.body.classList.add('theme-dark');
            if (darkOption) darkOption.classList.add('active');
            if (lightOption) lightOption.classList.remove('active');
        } else {
            document.body.classList.remove('theme-dark');
            if (lightOption) lightOption.classList.add('active');
            if (darkOption) darkOption.classList.remove('active');
        }
    }

    if (lightOption && darkOption) {
        const currentTheme = localStorage.getItem('aurora-theme') || 'light';
        updateTheme(currentTheme);

        lightOption.addEventListener('click', () => updateTheme('light'));
        darkOption.addEventListener('click', () => updateTheme('dark'));
    }

    if (densitySelect) {
        const currentDensity = localStorage.getItem('aurora-density') || 'comfortable';
        densitySelect.value = currentDensity;

        densitySelect.addEventListener('change', (e) => {
            const newDensity = e.target.value;
            localStorage.setItem('aurora-density', newDensity);
            document.documentElement.setAttribute('data-density', newDensity);
        });
    }
});
