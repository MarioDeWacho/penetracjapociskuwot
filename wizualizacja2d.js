// Wizualizacja 2d ręcznego ustawiania kąta uderzenia.

document.addEventListener("DOMContentLoaded", function() {
    // Pobiera elementy DOM dla czołgów, suwaka kąta, przycisku reset, przycisku ustaw kąt i elementu wyświetlającego aktualny kąt
    const shootingTank = document.getElementById("shooting-tank");
    const targetTank = document.getElementById("target-tank");
    const angleRange = document.getElementById("angleRange");
    const shotPath = document.getElementById("shot-path");
    const resetButton = document.getElementById("resetButton");
    const setAngleButton = document.getElementById("setAngleButton");
    const angleNumber = document.getElementById("angleNumber");
    const angleSlider = document.getElementById("angleSlider");
    const currentAngle = document.getElementById("currentAngle");

    // Funkcja do obliczania koloru w zależności od kąta
    function getColorFromAngle(angle) {
        const normalizedAngle = Math.abs(angle) / 90; // Normalizuje kąt do zakresu od 0 do 1
        const red = Math.min(255, Math.round(normalizedAngle * 255));
        const green = 255 - red;
        return `rgb(${red}, ${green}, 0)`;
    }

    // Funkcja aktualizująca pozycję i obrót czołgu strzelającego na podstawie zadanego kąta
    function updateTankPosition(angle) {
        const radians = angle * (Math.PI / 180); // Konwertuje kąt na radiany

        // Pobiera pole bitwy i oblicza jego środek za każdym razem, gdy wywoływana jest funkcja
        const battlefield = document.getElementById("battlefield");
        const centerX = battlefield.offsetWidth / 2;
        const centerY = battlefield.offsetHeight / 2;
        const radius = 150; // Promień, po którym porusza się czołg strzelający

        // Oblicza współrzędne punktu zakotwiczenia na prawym boku nieruchomego czołgu
        const targetTankRightX = centerX + 25; // Środek prawego boku nieruchomego czołgu
        const targetTankRightY = centerY;

        // Oblicza nową współrzędną X i Y czołgu strzelającego
        const x = targetTankRightX + radius * Math.cos(radians);
        const y = targetTankRightY - radius * Math.sin(radians);

        // Ustawia nową pozycję czołgu strzelającego
        shootingTank.style.left = `${x - 25}px`; // Przesuwa czołg, aby był wycentrowany
        shootingTank.style.top = `${y - 75}px`; // Przesuwa czołg, aby był wycentrowany

        // Obraca czołg strzelający, aby był zwrócony w stronę nieruchomego czołgu
        const angleDeg = Math.atan2(targetTankRightY - y, targetTankRightX - x) * (180 / Math.PI) + 90;
        shootingTank.style.transform = `rotate(${angleDeg}deg)`;

        // Aktualizuje długość i położenie trajektorii strzału
        const deltaX = x - targetTankRightX;
        const deltaY = y - targetTankRightY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Ustawia długość trajektorii strzału i obrót
        shotPath.style.width = `${distance}px`;
        shotPath.style.left = `${targetTankRightX}px`; // Zaczyna linię od prawego boku nieruchomego czołgu
        shotPath.style.top = `${targetTankRightY}px`; // Ustawia linię na środku wysokości nieruchomego czołgu
        const angleRad = Math.atan2(deltaY, deltaX);
        const anglePathDeg = angleRad * (180 / Math.PI);
        shotPath.style.transform = `rotate(${anglePathDeg}deg) translateX(0%)`; // Obraca linię i ustawia punkt zaczepienia

        // Aktualizuje kolor linii
        shotPath.style.borderTopColor = getColorFromAngle(angle);

        // Aktualizuje wyświetlany kąt
        currentAngle.textContent = Math.abs(angle);
    }

    // Nasłuchuje zmiany wartości suwaka kąta i aktualizuje pozycję czołgu strzelającego
    angleRange.addEventListener("input", function() {
        const angle = parseInt(angleRange.value, 10); // Pobiera wartość kąta z suwaka
        updateTankPosition(angle); // Aktualizuje pozycję czołgu
    });

    // Nasłuchuje kliknięcia przycisku reset i resetuje pozycję czołgu strzelającego
    resetButton.addEventListener("click", function() {
        angleRange.value = 0; // Ustawia suwak na środek
        updateTankPosition(0); // Aktualizuje pozycję czołgu
    });

    // Nasłuchuje kliknięcia przycisku ustaw kąt i ustawia wartość w polu input oraz suwaku
    setAngleButton.addEventListener("click", function() {
        const angle = parseInt(currentAngle.textContent, 10); // Pobiera wartość aktualnego kąta
        angleNumber.value = angle; // Ustawia wartość w polu input
        angleSlider.value = angle; // Ustawia wartość w suwaku
        angleRange.value = angle; // Ustawia wartość w suwaku angleRange
        updateTankPosition(angle); // Aktualizuje pozycję czołgu

        // Zamyka modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('ustawKat'));
        modal.hide();
    });

    // Aktualizuje pozycję czołgu, gdy modal zostanie otwarty
    const modalElement = document.getElementById('ustawKat');
    modalElement.addEventListener('shown.bs.modal', function () {
        updateTankPosition(parseInt(angleRange.value, 10)); // Aktualizuje pozycję czołgu przy otwarciu modala
    });

    // Ustawia początkową pozycję czołgu strzelającego na kąt 0 stopni
    updateTankPosition(0);
});
