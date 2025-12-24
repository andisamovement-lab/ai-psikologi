const API_URL = "https://missing-cassi-andisamovement-5ff92214.koyeb.app/chat";

document.getElementById("msg").addEventListener("keypress", e => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const msg = document.getElementById("msg");
    const box = document.getElementById("chatBox");
    const btn = document.getElementById("sendBtn");

    const text = msg.value.trim();
    if (!text) return;

    btn.disabled = true;
    msg.disabled = true;

    box.innerHTML += `
        <div class="message user-message">
            <div class="user-avatar">👤</div>
            <div class="message-content">${escapeHtml(text)}</div>
        </div>
    `;
    box.scrollTop = box.scrollHeight;
    msg.value = "";

    let reply = "Aku sedang berpikir…";

    try {
        const r = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message: text})
        });
        const data = await r.json();
        reply = data.reply || reply;
    } catch {
        reply = "Terjadi gangguan koneksi. Silakan coba lagi.";
    }

    box.innerHTML += `
        <div class="message ai-message">
            <div class="ai-avatar">🤖</div>
            <div class="message-content">${escapeHtml(reply)}</div>
        </div>
    `;
    box.scrollTop = box.scrollHeight;

    btn.disabled = false;
    msg.disabled = false;
    msg.focus();
}

function escapeHtml(t) {
    return t.replace(/[&<>"']/g, m => ({
        "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
    })[m]);
}
