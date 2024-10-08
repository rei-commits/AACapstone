// Sidebar toggle functionality
const toggleSidebarBtn = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");
const chatboxContainer = document.querySelector(".col-md-9");

toggleSidebarBtn.addEventListener("click", function() {
    sidebar.classList.toggle("sidebar-hidden");

    if (sidebar.classList.contains("sidebar-hidden")) {
        chatboxContainer.classList.add("sidebar-hidden");
        chatboxContainer.classList.remove("sidebar-visible");
    } else {
        chatboxContainer.classList.add("sidebar-visible");
        chatboxContainer.classList.remove("sidebar-hidden");
    }
});

// Chatbox message handling (basic)
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", function() {
    const message = chatInput.value;
    if (message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatInput.value = "";
    }
});

// Tooltip activation
const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
tooltips.forEach(tooltip => {
    new bootstrap.Tooltip(tooltip);
});
