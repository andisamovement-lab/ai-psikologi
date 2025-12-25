/* ==== CONFIG ==== */
const API_URL = "https://tralala.koyeb.app//chat";   // ganti dengan sub‑domain
let msgCounter = 0;

/* ==== ENTER KEY ==== */
document.getElementById("msg").addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

/* ==== SEND MESSAGE ==== */
async function sendMessage() {
    const msgInput = document.getElementById("msg");
    const chatBox  = document.getElementById("chatBox");
    const text = msgInput.value.trim();
    if (!text) return;

    /* USER MESSAGE */
    chatBox.innerHTML += `
        <div class="message user-message">
            <div class="user-avatar">👤</div>
            <div class="message-content">${escapeHtml(text)}</div>
        </div>
    `;
    msgInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    /* THINKING PLACEHOLDER */
    const thinkingId = `thinking-${msgCounter++}`;
    chatBox.innerHTML += `
        <div class="message ai-message" id="${thinkingId}">
            <div class="ai-avatar">🤖</div>
            <div class="message-content"><em>Sedang berpikir...</em></div>
        </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Server error ${response.status}: ${errText}`);
        }

        const data = await response.json();

        document.getElementById(thinkingId).innerHTML = `
            <div class="ai-avatar">🤍</div>
            <div class="message-content">${escapeHtml(data.reply)}</div>
        `;
    } catch (e) {
        document.getElementById(thinkingId).innerHTML = `
            <div class="ai-avatar">⚠️</div>
            <div class="message-content">
                ${escapeHtml(e.message || "Terjadi gangguan koneksi ke server AI. Silakan coba lagi.")}
            </div>
        `;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
    msgInput.focus();
}

/* ==== HTML ESCAPE ==== */
function escapeHtml(text) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
