const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const mainContent = document.getElementById('main-content');
const globalLoader = document.getElementById('global-loader');

if (sidebar && mainContent) {
    if (window.innerWidth > 768 && localStorage.getItem('sidebar-collapsed') === 'true') {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            const isCollapsed = sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            localStorage.setItem('sidebar-collapsed', isCollapsed);
        });
    }
}

function showGlobalLoader() {
    if (!globalLoader) return;
    globalLoader.classList.add('global-loader-visible');
}

document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href') || '';

    if (
        href.startsWith('#') ||
        link.target === '_blank' ||
        link.hasAttribute('download') ||
        href.startsWith('javascript:')
    ) {
        return;
    }

    event.preventDefault();
    showGlobalLoader();

    setTimeout(() => {
        window.location.href = href;
    }, 1000);
});

document.addEventListener('submit', (event) => {
    const form = event.target;
    event.preventDefault();
    showGlobalLoader();

    setTimeout(() => {
        form.submit();
    }, 1000);
});

document.querySelectorAll('a.show-loader').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        showGlobalLoader();
        const href = link.href;
        setTimeout(() => {
            window.location.href = href;
        }, 1000);
    });
});