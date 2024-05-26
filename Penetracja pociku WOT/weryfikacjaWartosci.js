// Funkcje do obsługi walidacji formularza i sprawdzania poprawności wartości wprowadzanych przez użytkownika. Jego głównym celem jest zapewnienie, że dane wejściowe są prawidłowe przed dalszym przetwarzaniem.

// Tablica przechowująca historię wyników obliczeń
var calculationHistory = [];

// Funkcja sprawdzająca poprawność wartości
function validateInputs(distance, armor, angle, penetration) {
    if (distance <= 0 || armor <= 0 || penetration <= 0) {
        alert("Wartości odległości, grubości pancerza i penetracji muszą być większe od zera.");
        return false;
    }
    if (angle < 0 || angle > 90 || isNaN(angle)) {
        alert("Kąt uderzenia musi być liczbą między 0 a 90 stopni.");
        return false;
    }
    if (isNaN(distance) || isNaN(armor) || isNaN(angle) || isNaN(penetration)) {
        alert("Wprowadź poprawne wartości dla wszystkich parametrów.");
        return false;
    }
    return true;
}

function handleFieldChange() {
    const fireButton = document.querySelector('.guzik-ognia');
    if (areAllFieldsFilled()) {
        fireButton.classList.add('show');
    } else {
        fireButton.classList.remove('show');
    }
}

function areAllFieldsFilled() {
    const distance = parseFloat(document.getElementById('distanceNumber').value);
    const armor = parseFloat(document.getElementById('armorNumber').value);
    const angle = parseFloat(document.getElementById('angleNumber').value);
    const penetration = parseFloat(document.getElementById('penetrationNumber').value);
    return !isNaN(distance) && !isNaN(armor) && !isNaN(angle) && !isNaN(penetration);
}

function highlightElement(element) {
    element.classList.add('highlight');
    setTimeout(() => {
        element.classList.remove('highlight');
    }, 1500); // Usuwa klasę po 1 sekundzie
}
