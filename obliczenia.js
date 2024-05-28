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
    // Przeliczenie kąta z stopni na radiany
    const angleInRadians = (angle * Math.PI) / 180;
    // Obliczenie efektywnej grubości pancerza pod kątem
    let effectiveArmor = armor / Math.cos(angleInRadians);

    // Sprawdzenie zasad twoCaliberRule i threeCaliberRule
    let penetrationChance = 0;

    if (penetration < armor) {
        // Jeśli kaliber pocisku jest mniejszy niż grubość pancerza
        penetrationChance = 0;
    } else if (penetration >= 3 * armor) {
        // Jeśli kaliber pocisku jest większy lub równy 3 razy grubości pancerza
        penetrationChance = 1;
    } else if (penetration >= 2 * armor) {
        // Jeśli kaliber pocisku jest większy lub równy 2 razy grubości pancerza
        penetrationChance = penetration / (1.5 * effectiveArmor);
    } else {
        // Standardowa penetracja uwzględniająca efektywną grubość pancerza
        penetrationChance = penetration / effectiveArmor;
    }

    // Ograniczenie szansy penetracji do zakresu od 0 do 1
    penetrationChance = Math.max(0, Math.min(1, penetrationChance));

    console.log("distanceNumber:", distance);
    console.log("armorNumber:", armor);
    console.log("angleNumber:", angle);
    console.log("penetrationNumber:", penetration);
    console.log("Effective Armor:", effectiveArmor);
    console.log("Penetration Chance:", penetrationChance);

    return penetrationChance * 100;
}
