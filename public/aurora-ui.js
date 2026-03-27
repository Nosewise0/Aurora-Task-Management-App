const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const mainContent = document.getElementById('main-content');
const globalLoader = document.getElementById('global-loader');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');

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

    function toggleMobileSidebar() {
        sidebar.classList.toggle('show');
        sidebarOverlay.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleMobileSidebar);
    }

    const navLinks = sidebar.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('show')) {
                toggleMobileSidebar();
            }
        });
    });
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


const chatToggle = document.getElementById('ai-chat-toggle');
const chatWindow = document.getElementById('ai-chat-window');
const chatClose = document.getElementById('ai-chat-close');
const chatInput = document.getElementById('ai-chat-input');
const chatSend = document.getElementById('ai-chat-send');
const chatMessages = document.getElementById('ai-chat-messages');

if (chatToggle && chatWindow && chatClose) {
    const chatContainer = document.querySelector('.ai-chat-container');

    chatToggle.addEventListener('click', () => {
        chatWindow.classList.add('active');
        chatContainer.classList.add('chat-open');
        chatToggle.style.display = 'none';
        chatInput.focus();
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
        chatContainer.classList.remove('chat-open');
        chatToggle.style.display = 'flex';
    });

    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (message) {
            const messageElement = document.createElement('div');
            messageElement.className = 'ai-message ai-message-sent';
            messageElement.innerHTML = `
                <div class="ai-message-bubble">${message}</div>
                <span class="ai-message-time">Just now</span>
            `;
            chatMessages.appendChild(messageElement);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;


            const loadingElement = document.createElement('div');
            loadingElement.className = 'ai-message ai-message-received ai-loading';
            loadingElement.innerHTML = `
                <div class="ai-message-bubble">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            `;
            chatMessages.appendChild(loadingElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                const response = await fetch('/ai/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });

                const data = await response.json();

                chatMessages.removeChild(loadingElement);

                const responseElement = document.createElement('div');
                responseElement.className = 'ai-message ai-message-received';
                responseElement.innerHTML = `
                    <div class="ai-message-bubble">${data.reply || 'Sorry, I encountered an error.'}</div>
                    <span class="ai-message-time">Just now</span>
                `;
                chatMessages.appendChild(responseElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } catch (error) {
                console.error('Chat Error:', error);
                chatMessages.removeChild(loadingElement);

                const errorElement = document.createElement('div');
                errorElement.className = 'ai-message ai-message-received';
                errorElement.innerHTML = `
                    <div class="ai-message-bubble" style="background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: #ef4444;">
                        <i class="fas fa-exclamation-circle me-1"></i> 
                        I'm currently over capacity or my quota has been reached. Please check back later!
                    </div>
                    <span class="ai-message-time">Just now</span>
                `;
                chatMessages.appendChild(errorElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    };

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}