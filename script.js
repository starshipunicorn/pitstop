const parts = {
    "Mechanic": {
        "Repair Kit": 1000,
        "Suspension Parts": 500,
        "Tyre Replacement": 200,
        "Brake Pad Replacement": 500,
        "Body & Cosmetic Part": 350,
        "Extras Kit": 200,
        "Lighting Controller": 200,
        "Drift Tuning Kit": 200,
        "Nitrous Install Kit": 250,
        "Duct Tape": 250,
        "Cleaning Kit": 50,
        "Body Repair Kit": 1000,
        "Respray Kit": 200,
        "Stancer Kit": 1000,
        "Tyre Smoke Kit": 200,
        "Ceramic Brakes": 500,
        "Mech Components": 3500
    },
    "Engine": {
        "EV Motor": 2500,
        "EV Battery": 2500,
        "EV Coolant": 2500,
        "Clutch Replacement": 500,
        "Air Filter": 500,
        "Spark Plug": 500,
        "Engine Oil": 500,
        "Stage 1 Engine": 6500
    },
    "Drivetrain": {
        "Semi Slick Tyres": 200,
        "AWD Drivetrain": 1000,
        "RWD Drivetrain": 1000,
        "Offroad Tyres": 200,
        "FWD Drivetrain": 1000,
        "Slick Tyres": 200,
        "Vehicle Wheels Set": 200,
        "Tyre Replacement": 500
    }
};

const webhookURL = "https://discord.com/api/webhooks/1275317660342681600/KFvhixnfqDK_JGvDVdHZ24-VP5grn9gC6Ol66dMaE4xYWWn7Lhbp7IuuRQQjoH-OKSxI";
let lastCalculatedMessage = "";  // To store the last calculated message
let totalPartsCost = 0;  // Total cost of selected parts
let employeePayout = 0;  // Employee's payout amount
let shopPayout = 0;  // Shop's payout amount

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

function calculatePayout() {
    const employeeName = document.getElementById('employee-name').value;
    const totalAmount = parseInt(document.getElementById('total-amount').value);
    const selectedParts = Array.from(document.querySelectorAll('input[name="quantity"]'))
                               .filter(input => input.value > 0)
                               .map(input => ({ part: input.dataset.part, quantity: parseInt(input.value) }));
    
    totalPartsCost = 0;
    selectedParts.forEach(({ part, quantity }) => {
        for (let category in parts) {
            if (parts[category][part]) {
                totalPartsCost += parts[category][part] * quantity;
            }
        }
    });
    
    const remainingProfit = totalAmount - totalPartsCost;
    employeePayout = (remainingProfit / 2) + totalPartsCost;
    shopPayout = remainingProfit / 2;
    
    lastCalculatedMessage = `
**Employee:** ${employeeName}
**Total Parts Cost:** $${totalPartsCost}
**Employee Payout:** $${employeePayout}
**Shop Payout:** $${shopPayout}
    `;

    document.getElementById('results').innerHTML = lastCalculatedMessage.replace(/\n/g, '<br>');
    document.getElementById('send-discord').style.display = 'block';  // Show the send to Discord button
}

function sendToDiscord() {
    const payload = {
        embeds: [{
            title: "Pitstop Receipts",
            color: 0x1E90FF,  // Pitstop blue color
            fields: [
                {
                    name: "Employee",
                    value: document.getElementById('employee-name').value,
                    inline: false
                },
                {
                    name: "Total Parts Cost",
                    value: `$${totalPartsCost}`,
                    inline: false
                },
                {
                    name: "Employee Payout",
                    value: `$${employeePayout}`,
                    inline: false
                },
                {
                    name: "Shop Payout",
                    value: `$${shopPayout}`,
                    inline: false
                }
            ],
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
            console.log("Message sent to Discord successfully!");
            alert("Message sent to Discord successfully!");
        } else {
            return response.text().then(text => {
                console.error("Failed to send message to Discord:", text);
                alert("Failed to send message to Discord: " + text);
            });
        }
    })
    .catch(error => {
        console.error("Error sending message to Discord:", error);
        alert("Error sending message to Discord: " + error.message);
    });
}

