const servicingParts = {
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

const upchargeRates = {
    "standard": 0.15,
    "sports": 0.20,
    "super": 0.25
};

const webhookURL = "https://discord.com/api/webhooks/1275317906812698716/m4NStCS0kKhus3VwRSfUfOFm0D1z-q7FvwjYptr8uWC09T1mhBfBa-WOMYz5GR0tBiS9";
let lastServicingMessage = "";  // To store the last servicing message
let totalServicingCost = 0;  // Total cost of selected servicing parts
let totalServicingCostWithUpcharge = 0;  // Total cost with upcharge
let selectedPartsList = "";  // List of selected parts

window.onload = function() {
    populateServicingSelection('servicing-parts-selection', servicingParts);
};

function populateServicingSelection(sectionId, sectionParts) {
    const section = document.getElementById(sectionId);
    
    for (let part in sectionParts) {
        let label = document.createElement('label');
        label.innerText = `${part} ($${sectionParts[part]})`;
        
        let quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.name = 'quantity';
        quantityInput.value = 0;  // Start at 0
        quantityInput.min = 0;
        quantityInput.style.width = '50px';  // Smaller box size
        quantityInput.dataset.part = part;  // Store the part name in a data attribute
        
        let div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(quantityInput);
        
        section.appendChild(div);
    }
}

function calculateServicing() {
    const carType = document.getElementById('car-type').value;
    const selectedParts = Array.from(document.querySelectorAll('input[name="quantity"]'))
                               .filter(input => input.value > 0)
                               .map(input => ({ part: input.dataset.part, quantity: parseInt(input.value) }));
    
    totalServicingCost = 0;
    selectedPartsList = "";  // Clear previous selections
    selectedParts.forEach(({ part, quantity }) => {
        totalServicingCost += servicingParts[part] * quantity;
        selectedPartsList += `${quantity} x ${part}\n`;
    });
    
    const upcharge = upchargeRates[carType];
    totalServicingCostWithUpcharge = totalServicingCost + (totalServicingCost * upcharge);
    
    lastServicingMessage = `
**Car Type:** ${carType.charAt(0).toUpperCase() + carType.slice(1)}
**Total Servicing Cost (with Upcharge):** $${totalServicingCostWithUpcharge.toFixed(2)}
**Parts Needed:**\n${selectedPartsList}
    `;

    document.getElementById('servicing-results').innerHTML = lastServicingMessage.replace(/\n/g, '<br>');
    document.getElementById('send-servicing-discord').style.display = 'block';  // Show the send to Discord button
}

function sendServicingToDiscord() {
    const employeeName = document.getElementById('employee-name').value;
    const payload = {
        embeds: [{
            title: "Servicing Cost Calculation",
            color: 0x1E90FF,  // Pitstop blue color
            description: `**Employee:** ${employeeName}\n${lastServicingMessage}`,
            footer: {
                text: "Pitstop Mechanic Shop",
            }
        }]
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            console.log("Servicing message sent to Discord successfully!");
            alert("Servicing message sent to Discord successfully!");
        } else {
            return response.text().then(text => {
                console.error("Failed to send servicing message to Discord:", text);
                alert("Failed to send servicing message to Discord: " + text);
            });
        }
    })
    .catch(error => {
        console.error("Error sending servicing message to Discord:", error);
        alert("Error sending servicing message to Discord: " + error.message);
    });
}
