const parts = {
    "Mechanic": {
        "Repair Kit": 500,
        "Suspension Parts": 200,
        "Tyre Replacement": 200,
        "Brake Pad Replacement": 100,
        "Body & Cosmetic Part": 200,
        "Extras Kit": 200,
        "Lighting Controller": 100,
        "Drift Tuning Kit": 200,
        "Nitrous Install Kit": 250,
        "Duct Tape": 250,
        "Cleaning Kit": 50,
        "Body Repair Kit": 1000,
        "Respray Kit": 200,
        "Stancer Kit": 200,
        "Tyre Smoke Kit": 200,
        "Ceramic Brakes": 500
    },
    "Engine": {
        "EV Motor": 100,
        "EV Battery": 100,
        "EV Coolant": 100,
        "Clutch Replacement": 100,
        "Air Filter": 100,
        "Spark Plug": 100,
        "Engine Oil": 100
    },
    "Drivetrain": {
        "Semi Slick Tyres": 200,
        "AWD Drivetrain": 1000,
        "RWD Drivetrain": 1000,
        "Offroad Tyres": 200,
        "FWD Drivetrain": 1000,
        "Slick Tyres": 200,
        "Vehicle Wheels Set": 200
    }
};

const webhookURL = "https://discord.com/api/webhooks/1274970818497089558/fszw-4X_gT_uxgHIvvZjheW3vXO0lcLo0a13_h_5gsOPvneoGq31oEu1GJcDHyKa6u0e";
let lastCalculatedMessage = "";  // To store the last calculated message

window.onload = function() {
    populateSelection('mechanic-selection', parts.Mechanic);
    populateSelection('engine-selection', parts.Engine);
    populateSelection('drivetrain-selection', parts.Drivetrain);
};

function populateSelection(sectionId, sectionParts) {
    const section = document.getElementById(sectionId);
    
    for (let part in sectionParts) {
        let label = document.createElement('label');
        label.innerText = `${part} ($${sectionParts[part]})`;
        
        let quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.name = 'quantity';
        quantityInput.value = 1;
        quantityInput.min = 1;
        quantityInput.style.marginLeft = '10px';
        quantityInput.dataset.part = part;  // Store the part name in a data attribute
        
        let div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(quantityInput);
        
        section.appendChild(div);
    }
}

function calculatePayout() {
    const employeeName = document.getElementById('employee-name').value;
    const totalAmount = parseInt(document.getElementById('total-amount').value);
    const selectedParts = Array.from(document.querySelectorAll('input[name="quantity"]'))
                               .filter(input => input.value > 0)
                               .map(input => ({ part: input.dataset.part, quantity: parseInt(input.value) }));
    
    let totalPartsCost = 0;
    selectedParts.forEach(({ part, quantity }) => {
        for (let category in parts) {
            if (parts[category][part]) {
                totalPartsCost += parts[category][part] * quantity;
            }
        }
    });
    
    const remainingProfit = totalAmount - totalPartsCost;
    const employeePayout = (remainingProfit / 2) + totalPartsCost;
    const shopPayout = remainingProfit / 2;
    
    lastCalculatedMessage = `
**Employee:** ${employeeName}
**Total Parts Cost:** $${totalPartsCost}
**Employee Payout:** $${employeePayout}
**Shop Payout:** $${shopPayout}
    `;

    document.getElementById('results').innerHTML = lastCalculatedMessage.replace(/\n/g, '<br>');
    document.getElementById('confirm-discord').style.display = 'block';  // Show the confirmation button
}

function confirmSendToDiscord() {
    if (confirm("Are you sure you're ready to send this to Discord?")) {
        document.getElementById('confirm-discord').style.display = 'none';
        document.getElementById('send-discord').style.display = 'block';
    }
}

function sendToDiscord() {
    const payload = {
        content: `\n**Mechanic Shop Payment Calculation**\n---\n${lastCalculatedMessage}\n---`,
        embeds: [{
            color: 0x1E90FF  // Pitstop blue color
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
            console.log("Message sent to Discord successfully!");
            alert("Message sent to Discord successfully!");
        } else {
            console.error("Failed to send message to Discord.");
            alert("Failed to send message to Discord.");
        }
    })
    .catch(error => {
        console.error("Error sending message to Discord:", error);
        alert("Error sending message to Discord.");
    });
}
