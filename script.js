const API_URL = "https://missing-cassi-andisamovement-5ff92214.koyeb.app/chat";

// Kirim dengan Enter
document.getElementById("msg").addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const msgInput = document.getElementById("msg");
    const chatBox = document.getElementById("chatBox");
    const text = msgInput.value.trim();
    if (!text) return;

    chatBox.innerHTML += `
        <div class="message user-message">
            <div class="user-avatar">👤</div>
            <div class="message-content">${escapeHtml(text)}</div>
        </div>
    `;
    msgInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    const thinkingId = "thinking-" + Date.now();
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
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();
        document.getElementById(thinkingId).innerHTML = `
            <div class="ai-avatar">🤍</div>
            <div class="message-content">${escapeHtml(data.reply)}</div>
        `;
    } catch (e) {
        document.getElementById(thinkingId).innerHTML = `
            <div class="ai-avatar">⚠️</div>
            <div class="message-content">
                Terjadi gangguan koneksi ke server AI. Silakan coba lagi.
            </div>
        `;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
    msgInput.focus();
}

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
