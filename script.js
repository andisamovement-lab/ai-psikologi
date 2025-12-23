// Kirim dengan Enter (tanpa Shift)
document.getElementById('msg').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const msgInput = document.getElementById('msg');
    const chatBox  = document.getElementById('chatBox');
    const sendBtn  = document.getElementById('sendBtn');

    const message = msgInput.value.trim();
    if (!message) return;

    // Disable input & tombol + tampilkan loader
    msgInput.disabled = true;
    sendBtn.disabled  = true;
    const loader = document.querySelector('.btn-loader');
    if (loader) loader.style.display = 'block';

    // Tambah pesan user
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-message';
    userMsg.innerHTML = `
        <div class="user-avatar">👤</div>
        <div class="message-content">
            <p>${escapeHtml(message)}</p>
        </div>
    `;
    chatBox.appendChild(userMsg);
    msgInput.value = '';
    scrollToBottom();

    try {
        // Panggil API backend (fungsi & keamanan tetap sama)
        const response = await fetch('https://ai-psikologi-backend.vercel.app/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        // Pesan AI + typing dots
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai-message';
        aiMsg.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-dots" id="typing">
                    <div></div><div></div><div></div>
                </div>
                <p id="ai-response" style="display:none;">
                    ${escapeHtml(data.reply || 'Maaf, tidak dapat memproses.')}
                </p>
            </div>
        `;
        chatBox.appendChild(aiMsg);
        scrollToBottom();

        // Simulasi mengetik
        setTimeout(() => {
            const typingEl   = document.getElementById('typing');
            const responseEl = document.getElementById('ai-response');
            if (typingEl)   typingEl.style.display   = 'none';
            if (responseEl) responseEl.style.display = 'block';
            scrollToBottom();
        }, 1200);

    } catch (error) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'message ai-message';
        errorMsg.innerHTML = `
            <div class="ai-avatar">⚠️</div>
            <div class="message-content">
                <p>Terjadi kesalahan koneksi. Silakan coba lagi.</p>
            </div>
        `;
        chatBox.appendChild(errorMsg);
        scrollToBottom();
    } finally {
        msgInput.disabled = false;
        sendBtn.disabled  = false;
        if (loader) loader.style.display = 'none';
        msgInput.focus();
    }
}

function scrollToBottom() {
    const chatBox = document.getElementById('chatBox');
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Escape karakter spesial agar aman disisipkan ke HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Fokus otomatis ke input saat halaman dibuka
document.getElementById('msg').focus();
