// Funkcja otwierająca modal na podstawie jego ID
function openModal(modalId) {
    // Jeśli modalId to "wynikiModal", wykonaj obliczenia
    if (modalId === 'wynikiModal') {
        const distance = parseFloat(document.getElementById('distanceNumber').value);
        const armor = parseFloat(document.getElementById('armorNumber').value);
        const angle = parseFloat(document.getElementById('angleNumber').value);
        const penetration = parseFloat(document.getElementById('penetrationNumber').value);

        // Sprawdzenie poprawności wartości
        if (!validateInputs(distance, armor, angle, penetration)) {
            return; // Przerwanie działania funkcji, jeśli wartości są nieprawidłowe
        }

        // Wywołanie funkcji calculatePenetrationChance
        calculatePenetrationChance();
    }

    // Otwarcie odpowiedniego modala
    var myModal = new bootstrap.Modal(document.getElementById(modalId));
    myModal.show();
}
