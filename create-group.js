document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    loadingScreen.classList.add('hide');

    const introScreen = document.querySelector('.intro-screen');
    const formContainer = document.querySelector('.form-container');
    const startButton = document.getElementById('startButton');
    let selectedEmoji = "😊";

    startButton.addEventListener('click', () => {
        introScreen.classList.add('hide');
        setTimeout(() => {
            formContainer.classList.remove('hide');
            formContainer.classList.add('visible');
        }, 500);
    });

    const groupNameInput = document.getElementById('groupName');
    const groupNamePreview = document.getElementById('groupNamePreview');
    const form = document.getElementById('createGroupForm');
    const emojiButton = document.getElementById('selectedEmoji');
    
    emojiButton.addEventListener('click', () => {
        const picker = new EmojiMart.Picker({
            onEmojiSelect: (emoji) => {
                selectedEmoji = emoji.native;
                emojiButton.textContent = `Selected Emoji ${selectedEmoji}`;
            },
            theme: 'light'
        });
        
        if (!document.querySelector('.emoji-picker')) {
            document.getElementById('emojiPicker').appendChild(picker);
        }
        
        const pickerElement = document.querySelector('.emoji-picker');
        if (pickerElement) {
            pickerElement.style.display = 
                pickerElement.style.display === 'none' ? 'block' : 'none';
        }
    });

    // Update preview as user types
    groupNameInput.addEventListener('input', (e) => {
        groupNamePreview.textContent = e.target.value;
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = `Ring ${e.target.value} Eats`;
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const groupName = groupNameInput.value;
        const finalGroupName = `${groupName} Eats`;
        
        const groupInfo = {
            id: Date.now(),
            name: finalGroupName,
            avatar: selectedEmoji,
            createdAt: new Date().toISOString()
        };

        // Use the saveGroupToLocalStorage function instead of inline storage
        saveGroupToLocalStorage(groupInfo);

        console.log('Group created:', groupInfo);
        window.location.href = 'group-chat.html';
    });
});
