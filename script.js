// homepage
document.addEventListener('DOMContentLoaded', function() {
    // Any future JavaScript logic will go here
    console.log("Welcome to GroupPay! The homepage has loaded successfully.");
});


// Add interactivity to the "Get Started" button (optional) in Home
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('getStartedBtn').addEventListener('click', function () {
        window.location.href = 'group-setup.html';
    });
});

// Initialize an empty array to store messages
let messages = [];

// script.js

// Function to generate a random group link
function generateRandomLink() {
    const randomString = Math.random().toString(36).substring(2, 8); // Generates a random string
    return `https://grouppay.com/group/${randomString}`; // Replace with your actual app URL
}

// Set the group link on page load
document.addEventListener('DOMContentLoaded', () => {
    const groupLink = document.getElementById('groupLink');
    groupLink.value = generateRandomLink();
});

// Share Group Link
document.getElementById('shareLinkBtn').addEventListener('click', function() {
    const link = document.getElementById('groupLink');
    link.select();
    document.execCommand("copy");
    alert("Group link copied to clipboard!");
});

// Handle Receipt Upload
document.getElementById('uploadReceiptBtn').addEventListener('click', function() {
    const fileInput = document.getElementById('receiptUpload');
    const chatMessages = document.getElementById('chatMessages');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            // Simulating receipt item extraction (in a real app, you might use OCR or similar)
            const receiptItems = ['Item 1 - $10', 'Item 2 - $20', 'Item 3 - $30']; // Example items
            
            // Display the uploaded receipt in chat
            chatMessages.innerHTML += `<p><strong>Receipt Uploaded:</strong> <img src="${event.target.result}" alt="Receipt" style="max-width: 100%; height: auto;"></p>`;
            
            // Display receipt items as checkboxes
            displayReceiptItems(receiptItems);
        };
        
        reader.readAsDataURL(file);
    }
});

// Display Receipt Items with Checkboxes
function displayReceiptItems(items) {
    const itemSelection = document.getElementById('itemSelection');
    itemSelection.innerHTML = '<h5>Select Items:</h5>';

    items.forEach(item => {
        itemSelection.innerHTML += `<div><input type="checkbox" class="item-checkbox" value="${item}"> ${item}</div>`;
    });
}

// Calculate Total Amount
document.getElementById('calculateBtn').addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('.item-checkbox:checked');
    let total = 0;

    checkboxes.forEach(checkbox => {
        const itemValue = parseFloat(checkbox.value.match(/\$([0-9.]+)/)[1]);
        total += itemValue;
    });

    // Optionally, you can add a fixed tip (e.g., 15%)
    const tip = total * 0.15;
    total += tip;

    document.getElementById('totalAmount').innerHTML = `<h4>Total Amount (including tip): $${total.toFixed(2)}</h4>`;
});
