// Select elements from the DOM
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const shareLinkBtn = document.getElementById("shareLinkBtn");
const uploadReceiptBtn = document.getElementById("uploadReceiptBtn");
const payOptionBtn = document.getElementById("payOptionBtn");
const endChatBtn = document.getElementById("endChatBtn");

// Array to store messages (simulate local storage)
let messages = JSON.parse(localStorage.getItem("messages")) || [];

// Function to render messages in the chat
function renderMessages() {
    chatMessages.innerHTML = "";
    messages.forEach(message => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
    });
}

// Event listener for sending messages
sendBtn.addEventListener("click", () => {
    const messageText = chatInput.value.trim();
    if (messageText) {
        // Add message to array
        messages.push(messageText);
        // Save to localStorage (simulating a real-time server)
        localStorage.setItem("messages", JSON.stringify(messages));
        // Clear input field
        chatInput.value = "";
        // Re-render messages
        renderMessages();
    }
});

// Event listener for pressing Enter to send message
chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendBtn.click();
    }
});

// Event listener for sharing link
shareLinkBtn.addEventListener("click", () => {
    const userNumber = prompt("Enter your phone number to receive a link to this chat:");
    if (userNumber) {
        alert(`Link sent to ${userNumber}`);
        // Later: integrate actual link-sharing feature
    }
});

// Event listener for uploading receipt
uploadReceiptBtn.addEventListener("click", () => {
    alert("Receipt upload functionality will go here.");
    // Later: implement receipt upload, item selection, and calculation logic
});

// Event listener for choosing payment option
payOptionBtn.addEventListener("click", () => {
    alert("Redirecting to payment options...");
    // Later: redirect to payment.html and integrate Stripe
});

// Event listener for ending chat (clear messages and localStorage)
endChatBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to end the chat? Messages will be cleared.")) {
        messages = [];
        localStorage.removeItem("messages");
        renderMessages();
    }
});

// Load existing messages when the page loads
window.addEventListener("load", () => {
    renderMessages();

    // Automatically delete messages after 24 hours
    setTimeout(() => {
        localStorage.removeItem("messages");
        messages = [];
        renderMessages();
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
});
