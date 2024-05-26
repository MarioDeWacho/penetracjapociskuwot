// Funkcje związane z obliczeniami penetracji pancerza na podstawie danych wejściowych dostarczonych przez użytkownika.


function calculatePenetrationChance() {
    var distance = parseFloat(document.getElementById('distanceNumber').value);
    var armor = parseFloat(document.getElementById('armorNumber').value);
    var angle = parseFloat(document.getElementById('angleNumber').value);
    var penetration = parseFloat(document.getElementById('penetrationNumber').value);

    if (!validateInputs(distance, armor, angle, penetration)) {
        return;
    }

    var penetrationChance = performPenetrationCalculation(distance, armor, angle, penetration);
    calculationHistory.push(penetrationChance);

    document.getElementById('penetrationResult').textContent = penetrationChance.toFixed(2) + '%';
    generatePenetrationChart(penetrationChance); // Wywołanie funkcji do generowania wykresu

    var historyList = document.getElementById('historyList');
    var item = document.createElement('li');
    item.textContent = 'Szansa na penetrację: ' + penetrationChance.toFixed(2) + '%';
    historyList.appendChild(item);

    var accordionItem1 = document.querySelector('#accordionFlushExample .accordion-item:nth-child(1) .accordion-button');
    accordionItem1.textContent = 'Szansa na penetrację: ' + penetrationChance.toFixed(2) + '%';

    var accordionBody1 = document.querySelector('#accordionFlushExample .accordion-item:nth-child(1) .accordion-body');
    accordionBody1.textContent = '- Odległość: ' + distance + ' (m)\n' +
                                 '- Grubość Pancerza: ' + armor + ' (mm)\n' +
                                 '- Kąt Uderzenia: ' + angle + ' (stopni)\n' +
                                 '- Penetracja Pocisku: ' + penetration + ' (mm)';
    accordionBody1.classList.add('pre-line');
}

function performPenetrationCalculation(distance, armor, angle, penetration) {
    const normalizationAngle = 5;
    const normalizationFactor = 2;
    const ricochetAngle = 70;
    const calibersTwoRule = 2;
    const calibersThreeRule = 3;

    let relativeArmorThickness = armor / Math.cos((angle * Math.PI) / 180);

    let effectiveArmor = relativeArmorThickness;
    let normalizationPenetration = penetration * (1 + ((normalizationAngle - angle) / 30) * (normalizationFactor - 1));
    let normalizedPenetration = Math.max(normalizationPenetration, penetration);

    let penetrationChance = 0;

    if (penetration >= 3 * armor) {
        penetrationChance = 1;
    } else if (penetration < armor) {
        penetrationChance = 0;
    } else if (angle >= ricochetAngle) {
        let deviationAngle = Math.acos(1 / 1.4) * (180 / Math.PI);
        angle += deviationAngle;

        let twoCaliberRule = Math.max(0, 1 - Math.pow(distance / (calibersTwoRule * penetration), 2));
        let threeCaliberRule = penetration >= 3 * armor ? 1 : Math.max(0, Math.pow((calibersThreeRule * penetration - distance) / (calibersThreeRule * penetration), 1.5));

        penetrationChance = twoCaliberRule * threeCaliberRule;
    } else {
        penetrationChance = 1 - (angle / ricochetAngle);
    }

    if (penetration >= 2 * armor) {
        normalizedPenetration = (normalizedPenetration * 1.4 * penetration) / armor;
    }

    console.log("distanceNumber:", distance);
    console.log("armorNumber:", armor);
    console.log("angleNumber:", angle);
    console.log("penetrationNumber:", penetration);
    console.log("Effective Armor:", effectiveArmor);
    console.log("Normalization Penetration:", normalizationPenetration);
    console.log("Normalized Penetration:", normalizedPenetration);
    console.log("Penetration Chance:", penetrationChance);

    return penetrationChance * 100;
}
