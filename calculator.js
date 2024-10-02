document.getElementById('calculateBtn').addEventListener('click', function() {
    let total = 0;
    const checkboxes = document.querySelectorAll('#itemList input[type="checkbox"]:checked');
    checkboxes.forEach(function(checkbox) {
        total += parseFloat(checkbox.value);
    });

    const tipPercentage = 0.15; // This can be adjusted
    total += total * tipPercentage;

    document.getElementById('totalCost').innerText = total.toFixed(2);
});
