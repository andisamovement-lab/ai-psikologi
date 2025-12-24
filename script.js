// ===============================
// CONFIG
// ===============================
const API_URL = "https://missing-cassi-andisamovement-5ff92214.koyeb.app/chat";

// ===============================
// Kirim dengan Enter (tanpa Shift)
// ===============================
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

    // ===============================
    // Tampilkan pesan user
    // ===============================
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

    let aiReply = "Maaf, sistem sedang sibuk. Silakan coba lagi nanti.";

    try {
        // ===============================
        // Panggil backend Koyeb (FastAPI)
        // ===============================
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        // Jika backend hidup tapi error (500, 502, dll)
        if (!response.ok) {
            throw new Error("Backend error");
        }

        const data = await response.json();

        // ===============================
        // Fallback response handling
        // ===============================
        if (data && typeof data.reply === "string" && data.reply.trim() !== "") {
            aiReply = data.reply;
        } else if (data && data.error) {
            aiReply = "⚠️ " + data.error;
        } else {
            aiReply = "Maaf, AI belum dapat memberikan jawaban saat ini.";
        }

    } catch (error) {
        // ===============================
        // Fallback total (koneksi / network)
        // ===============================
        aiReply = "⚠️ Terjadi gangguan koneksi ke server AI. Silakan coba beberapa saat lagi.";
    }

    // ===============================
    // Tampilkan pesan AI + typing effect
    // ===============================
    const aiMsg = document.createElement('div');
    aiMsg.className = 'message ai-message';
    aiMsg.innerHTML = `
        <div class="ai-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots" id="typing">
                <div></div><div></div><div></div>
            </div>
            <p id="ai-response" style="display:none;">
                ${escapeHtml(aiReply)}
            </p>
        </div>
    `;
    chatBox.appendChild(aiMsg);
    scrollToBottom();

    // Simulasi AI mengetik
    setTimeout(() => {
        const typingEl   = document.getElementById('typing');
        const responseEl = document.getElementById('ai-response');
        if (typingEl)   typingEl.style.display   = 'none';
        if (responseEl) responseEl.style.display = 'block';
        scrollToBottom();
    }, 1200);

    // ===============================
    // Restore UI
    // ===============================
    msgInput.disabled = false;
    sendBtn.disabled  = false;
    if (loader) loader.style.display = 'none';
    msgInput.focus();
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
