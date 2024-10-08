// Group all DOMContentLoaded logic into one
document.addEventListener('DOMContentLoaded', function() {
    console.log("Welcome to GroupPay! The homepage has loaded successfully.");

    // Add interactivity to the "Get Started" button (optional) in Home
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function () {
            window.location.href = 'group-setup.html';
        });
    }

    // Generate and set group link
    const groupLink = document.getElementById('groupLink');
    if (groupLink) {
        groupLink.value = generateRandomLink();
    }

    // Add event listener for sharing group link
    const shareLinkBtn = document.getElementById('shareLinkBtn');
    if (shareLinkBtn) {
        shareLinkBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(groupLink.value)
                .then(() => alert("Group link copied to clipboard!"))
                .catch(err => console.error("Could not copy text: ", err));
        });
    }
});
