// groupchat.js
document.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const shareLinkBtn = document.getElementById('shareLinkBtn');
    const uploadReceiptBtn = document.getElementById('uploadReceiptBtn');
    const receiptInput = document.getElementById('receiptInput');
    const receiptItemsContainer = document.getElementById('receiptItemsContainer');

    // Function to send a message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message !== '') {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'p-2', 'mb-2', 'bg-light', 'rounded');
            messageDiv.textContent = message;
            chatMessages.appendChild(messageDiv);
            chatInput.value = ''; // Clear input
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
        }
    }

    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);

    // Option to share a link (you can modify the logic here)
    shareLinkBtn.addEventListener('click', function () {
        const link = prompt('Enter the link to share:');
        if (link) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'p-2', 'mb-2', 'bg-light', 'rounded');
            messageDiv.innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
        }
    });

    // Upload receipt and process it
    uploadReceiptBtn.addEventListener('click', function () {
        receiptInput.click(); // Trigger hidden file input
    });

    receiptInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            // Use Tesseract to read the receipt
            Tesseract.recognize(
                file,
                'eng',
                {
                    logger: (m) => console.log(m) // Optional: Log progress
                }
            ).then(({ data: { text } }) => {
                // Process the text received from Tesseract
                console.log(text);
                displayReceiptItems(text);
            });
        }
    });

    function displayReceiptItems(text) {
        // This function will parse the OCR text and display items
        receiptItemsContainer.innerHTML = ''; // Clear previous items
        const items = text.split('\n'); // Split by lines (you can refine this logic)
        items.forEach(item => {
            if (item.trim() !== '') {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('receipt-item', 'p-2', 'bg-light', 'mb-2', 'rounded');
                itemDiv.textContent = item;
                receiptItemsContainer.appendChild(itemDiv);
            }
        });
    }
});
