// Funkcje i nasłuchiwacze zdarzeń związane z interakcją użytkownika, takie jak obsługa suwaków, przycisków wyboru, przycisku "fire" oraz aktualizacji wartości na stronie.

document.addEventListener("DOMContentLoaded", function() {
    // Inicjalizacja zmiennych dla suwaków i pól liczbowych
    const slider = document.getElementById('distanceSlider');
    const numberField = document.getElementById('distanceNumber');
    const slider2 = document.getElementById('armorSlider');
    const numberField2 = document.getElementById('armorNumber');
    const slider3 = document.getElementById('angleSlider');
    const numberField3 = document.getElementById('angleNumber');
    const slider4 = document.getElementById('penetrationSlider');
    const numberField4 = document.getElementById('penetrationNumber');
    const fireButton = document.querySelector('.guzik-ognia');
    const chooseButtons = document.querySelectorAll(".btn-primary-wybieram");

    // Dodanie nasłuchiwania zdarzeń dla pól liczbowych
    numberField.addEventListener('input', handleFieldChange);
    numberField2.addEventListener('input', handleFieldChange);
    numberField3.addEventListener('input', handleFieldChange);
    numberField4.addEventListener('input', handleFieldChange);

    // Dodanie nasłuchiwania zdarzeń dla suwaków
    slider.addEventListener('input', function() {
        numberField.value = this.value;
        handleFieldChange();
        highlightElement(numberField);
    });
    slider2.addEventListener('input', function() {
        numberField2.value = this.value;
        handleFieldChange();
        highlightElement(numberField2);
    });
    slider3.addEventListener('input', function() {
        numberField3.value = this.value;
        handleFieldChange();
        highlightElement(numberField3);
    });
    slider4.addEventListener('input', function() {
        numberField4.value = this.value;
        handleFieldChange();
        highlightElement(numberField4);
    });

    // Funkcja do wyświetlania powiadomienia
    function displayArmorToast(toastContainerId, selectedArmorToastId, selectedValue) {
        const toastContainer = document.getElementById(toastContainerId);
        const selectedArmorToast = document.getElementById(selectedArmorToastId);

        if (toastContainer && selectedArmorToast) {
            const toast = new bootstrap.Toast(selectedArmorToast, {
                autohide: true,
                delay: 3000
            });
            toast.show();
            selectedArmorToast.querySelector('span').innerText = selectedValue;
        }
    }

    // Obsługa kliknięcia przycisku wyboru
    chooseButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            const offcanvasElement = this.closest('.offcanvas');
            if (offcanvasElement) {
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
                if (offcanvasInstance) {
                    offcanvasInstance.hide();
                }
            }

            const radioButtons = offcanvasElement.querySelectorAll("input[name='listGroupRadio']");
            let selectedValue = "";

            radioButtons.forEach(function(radioButton) {
                if (radioButton.checked) {
                    selectedValue = radioButton.value;
                }
            });

            document.getElementById("armorNumber").value = selectedValue;
            document.getElementById("armorSlider").value = selectedValue;
            handleFieldChange(); // Wywołanie funkcji po wprowadzeniu zmian
            highlightElement(document.getElementById("armorNumber"));

            const toastIds = ["60TP", "Maus", "T110E3", "SuperConqueror", "Type5Heavy", "705A"];

            toastIds.forEach(function(id) {
                displayArmorToast(`toastContainer${id}`, `selectedArmorToast${id}`, selectedValue);
            });
        });
    });

    // Obsługa zmiany wartości suwaka pancerza
    document.getElementById("armorSlider").addEventListener("input", function() {
        document.getElementById("armorNumber").value = this.value;
        handleFieldChange(); // Wywołanie funkcji po wprowadzeniu zmian
        highlightElement(document.getElementById("armorNumber"));
    });

    let selectedPenetration = 0;
    let isPenetrationSelected = false;

    // Obsługa kliknięcia przycisku pocisku
    document.querySelectorAll('.button-image-static-pocisk').forEach(img => {
        img.addEventListener('click', function () {
            selectedPenetration = this.getAttribute('data-penetration');
            const closestOffcanvas = this.closest('.offcanvas');
            const loadButton = closestOffcanvas.querySelector('.guzik-laduj');
            loadButton.classList.add('show');
            loadPenetrationValue();
            isPenetrationSelected = true;
            highlightSelectedButton(this);
        });
    });

    // Obsługa kliknięcia przycisku ładowania
    document.querySelectorAll('.guzik-laduj').forEach(button => {
        button.addEventListener('click', function () {
            if (isPenetrationSelected) {
                const offcanvasElement = this.closest('.offcanvas');
                if (offcanvasElement) {
                    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
                    if (offcanvasInstance) {
                        offcanvasInstance.hide();
                    }
                }
                const toastIds = ["FV4005", "E100", "GRILLE15", "AMX50FOCHB", "CC3", "BZ75"];
                toastIds.forEach(function (id) {
                    if (id) {
                        displayPenetrationToast(`toastContainer${id}`, `selectedPenetrationToast${id}`, selectedPenetration);
                    }
                });
            } else {
                alert("Wybierz pocisk przed użyciem.");
            }
        });
    });

    // Funkcja do załadowania wartości penetracji
    function loadPenetrationValue() {
        if (selectedPenetration > 0) {
            document.getElementById('penetrationNumber').value = selectedPenetration;
            document.getElementById('penetrationSlider').value = selectedPenetration;
            handleFieldChange(); // Wywołanie funkcji po wprowadzeniu zmian
            highlightElement(document.getElementById('penetrationNumber'));
        }
    }

    // Funkcja do podświetlania wybranego przycisku
    function highlightSelectedButton(button) {
        document.querySelectorAll('.button-image-static-pocisk').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
    }

    // Funkcja do wyświetlania powiadomienia o wybranym pocisku
    function displayPenetrationToast(toastContainerId, selectedPenetrationToastId, selectedValue) {
        const toastContainer = document.getElementById(toastContainerId);
        const selectedPenetrationToast = document.getElementById(selectedPenetrationToastId);

        if (toastContainer && selectedPenetrationToast) {
            const toast = new bootstrap.Toast(selectedPenetrationToast, {
                autohide: true,
                delay: 3000
            });
            toast.show();
            selectedPenetrationToast.querySelector('span').innerText = selectedValue;
        }
    }

    // Dodanie funkcji odtwarzania dźwięku po kliknięciu przycisku "OGNIA"
    function playFireSound() {
        const clickSound = document.getElementById('clickSoundGuzikOgnia');
        if (clickSound) {
            clickSound.play();
        } else {
            console.log('Nie znaleziono elementu audio o id clickSoundGuzikOgnia');
        }
    }

    // Dodanie nasłuchiwania zdarzenia kliknięcia dla przycisku "OGNIA"
    if (fireButton) {
        fireButton.addEventListener('click', function() {
            playFireSound();
        });
    }
});
