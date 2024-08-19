const parts = {
    "Repair Kit": 500,
    "Suspension Parts": 200,
    "Tyre Replacement": 200,
    "Brake Pad Replacement": 100,
    "EV Motor": 100,
    "EV Battery": 100,
    "EV Coolant": 100,
    "Clutch Replacement": 100,
    "Air Filter": 100,
    "Spark Plug": 100,
    "Engine Oil": 100
};

window.onload = function() {
    const partsSelection = document.getElementById('parts-selection');
    
    for (let part in parts) {
        let label = document.createElement('label');
        label.innerText = `${part} ($${parts[part]})`;
        
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'parts';
        checkbox.value = part;
        
        let div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);
        
        partsSelection.appendChild(div);
    }
};

function calculatePayout() {
    const totalAmount = parseInt(document.getElementById('total-amount').value);
    const selectedParts = Array.from(document.querySelectorAll('input[name="parts"]:checked'))
                               .map(cb => cb.value);
    
    let totalPartsCost = 0;
    selectedParts.forEach(part => {
        totalPartsCost += parts[part];
    });
    
    const remainingProfit = totalAmount - totalPartsCost;
    const employeePayout = (remainingProfit / 2) + totalPartsCost;
    const shopPayout = remainingProfit / 2;
    
    document.getElementById('results').innerHTML = `
        <p>Total Parts Cost: $${totalPartsCost}</p>
        <p>Employee Payout: $${employeePayout}</p>
        <p>Shop Payout: $${shopPayout}</p>
    `;
}
