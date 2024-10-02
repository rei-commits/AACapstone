document.getElementById('receiptUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const image = document.createElement('img');
            image.src = e.target.result;
            image.classList.add('img-fluid');
            document.getElementById('receiptContainer').appendChild(image);
        };
        reader.readAsDataURL(file);
    }
});

const itemList = [
    { name: 'Item 1', price: 10.99 },
    { name: 'Item 2', price: 5.99 },
    { name: 'Item 3', price: 8.99 }
];

const itemContainer = document.getElementById('itemList');

//  Dynamically creates checkboxes for each item
itemList.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('form-check');

    const checbox = document.createElement('input');
    checbox.type = 'checkbox';
    checbox.classList.add('form-check-input');
    checbox.id = `item${index}`;
    checbox.value = item.price;

    const label = document.createElement('label');
    label.classList.add('form-check-label');
    label.setAttribute('for', `item${index}`);
    label.innerText = `${item.name} - $${item.price.toFixed(2)}`;

    itemDiv.appendChild(checbox);
    itemDiv.appendChild(label);
    itemContainer.appendChild(itemDiv);
});