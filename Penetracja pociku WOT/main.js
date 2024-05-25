// Tablica przechowująca historię wyników obliczeń
var calculationHistory = [];

// Funkcja sprawdzająca poprawność wartości
function checkValues(distance, armor, angle, penetration) {
    if (distance <= 0 || armor <= 0 || penetration <= 0) {
        alert("Wartości odległości, grubości pancerza i penetracji muszą być większe od zera.");
        return false;
    }
    if (angle < 0 || angle > 90 || isNaN(angle)) {
        alert("Kąt uderzenia musi być liczbą między 0 a 90 stopni.");
        return false;
    }
    // Sprawdzenie, czy któryś z parametrów nie jest wartością NaN
    if (isNaN(distance) || isNaN(armor) || isNaN(angle) || isNaN(penetration)) {
        alert("Wprowadź poprawne wartości dla wszystkich parametrów.");
        return false; // Zwraca false, jeśli któryś z parametrów jest wartością NaN
    }
    
    // Sprawdzenie czy wartości w polach tekstowych nie są puste
    if (distance !== '' && armor !== '' && angle !== '' && penetration !== '') {
        document.querySelector('.guzik-ognia').classList.add('show'); // Jeśli wszystkie pola są wypełnione, dodaj klasę show do guzika
    } else {
        document.querySelector('.guzik-ognia').classList.remove('show'); // W przeciwnym razie usuń klasę show z guzika
    }
    
    return true;
}

// Funkcja calculate, która będzie wywoływana po kliknięciu przycisku "Calculate"
function calculate() {
    // Pobranie danych z formularza HTML
    var distance = parseFloat(document.getElementById('distanceNumber').value);
    var armor = parseFloat(document.getElementById('armorNumber').value);
    var angle = parseFloat(document.getElementById('angleNumber').value);
    var penetration = parseFloat(document.getElementById('penetrationNumber').value);

    // Sprawdzenie poprawności wartości
    if (!checkValues(distance, armor, angle, penetration)) {
        return; // Przerwanie obliczeń w przypadku niepoprawnych wartości
    }

    // Wywołanie funkcji calculatePenetration z pobranymi danymi
    var penetrationChance = calculatePenetration(distance, armor, angle, penetration);

    // Dodanie wyniku do historii obliczeń
    calculationHistory.push(penetrationChance);

    // Aktualizacja wyniku na stronie
    document.getElementById('penetrationResult').textContent = penetrationChance.toFixed(2) + '%';

    // Wywołanie funkcji do generowania wykresu
    renderChart(penetrationChance);

    // Aktualizacja listy w offcanvas-body
    var historyList = document.getElementById('historyList');
    var item = document.createElement('li');
    item.textContent = 'Szansa na penetrację: ' + penetrationChance.toFixed(2) + '%';
    historyList.appendChild(item);

    // Aktualizacja Nagłówka Accordion
    var accordionItem1 = document.querySelector('#accordionFlushExample .accordion-item:nth-child(1) .accordion-button');
    accordionItem1.textContent = 'Szansa na penetrację: ' + penetrationChance.toFixed(2) + '%';

    // Aktualizacja tekstu wewnątrz Accordion
    var accordionBody1 = document.querySelector('#accordionFlushExample .accordion-item:nth-child(1) .accordion-body');
    accordionBody1.textContent = '- Odległość: ' + distance + ' (m)\n' +
                                 '- Grubość Pancerza: ' + armor + ' (mm)\n' +
                                 '- Kąt Uderzenia: ' + angle + ' (stopni)\n' +
                                 '- Penetracja Pocisku: ' + penetration + ' (mm)';

    // Dodajemy klasę, która spowoduje, że znaki nowej linii będą interpretowane
    accordionBody1.classList.add('pre-line');
}

// Funkcja calculatePenetration, która wykonuje obliczenia penetracji
function calculatePenetration(distance, armor, angle, penetration) {
    // Stałe
    const normalizationAngle = 5; // Stopnie kątów, przy których dochodzi do normalizacji
    const normalizationFactor = 2; // Współczynnik normalizacji
    const ricochetAngle = 70; // Kąt rykoszetu w stopniach
    const calibersTwoRule = 2; // Zasada dwóch kalibrów
    const calibersThreeRule = 3; // Zasada trzech kalibrów

    // Grubość względna pancerza
    let relativeArmorThickness = armor / Math.cos((angle * Math.PI) / 180); // Grubość względna pancerza

    // Obliczenia penetracji
    let effectiveArmor = relativeArmorThickness; // Grubość efektywna pancerza
    let normalizationPenetration = penetration * (1 + ((normalizationAngle - angle) / 30) * (normalizationFactor - 1)); // Penetracja po normalizacji
    let normalizedPenetration = Math.max(normalizationPenetration, penetration); // Ustawienie penetracji na większą wartość spośród penetracji i penetracji po normalizacji

    let penetrationChance = 0; // Szansa penetracji

    // Sprawdzenie warunków dla penetracji
    if (penetration >= 3 * armor) {
        penetrationChance = 1; // Pełna penetracja
    } else if (penetration < armor) {
        penetrationChance = 0; // Brak penetracji
    } else if (angle >= ricochetAngle) {
        // Obliczenie kąta odchylenia w przypadku przekroczenia kąta rykoszetu
        let deviationAngle = Math.acos(1 / 1.4) * (180 / Math.PI); // Kąt odchylenia pocisku do prostopadłej
        angle += deviationAngle;

        // Obliczenie zasady dwóch kalibrów
        let twoCaliberRule = Math.max(0, 1 - Math.pow(distance / (calibersTwoRule * penetration), 2));
        // Obliczenie zasady trzech kalibrów
        let threeCaliberRule = penetration >= 3 * armor ? 1 : Math.max(0, Math.pow((calibersThreeRule * penetration - distance) / (calibersThreeRule * penetration), 1.5));

        penetrationChance = twoCaliberRule * threeCaliberRule; // Szansa penetracji z uwzględnieniem zasad dwóch i trzech kalibrów
    } else {
        penetrationChance = 1 - (angle / ricochetAngle); // Szansa penetracji, im mniejszy kąt, tym większa szansa
    }

    // Normalizacja końcowa
    if (penetration >= 2 * armor) {
        normalizedPenetration = (normalizedPenetration * 1.4 * penetration) / armor;
    }

    // Sprawdź wartości zmiennych
    console.log("distanceNumber:", distance);
    console.log("armorNumber:", armor);
    console.log("angleNumber:", angle);
    console.log("penetrationNumber:", penetration);
    console.log("Effective Armor:", effectiveArmor);
    console.log("Normalization Penetration:", normalizationPenetration);
    console.log("Normalized Penetration:", normalizedPenetration);
    console.log("Penetration Chance:", penetrationChance);

    // Zwrócenie szansy na penetrację
    return penetrationChance * 100; // konwersja na procenty
}

// Funkcja generująca wykres
function renderChart(penetrationChance) {
    var distance = parseFloat(document.getElementById('distanceNumber').value);
    var armor = parseFloat(document.getElementById('armorNumber').value);
    var angle = parseFloat(document.getElementById('angleNumber').value);
    var penetration = parseFloat(document.getElementById('penetrationNumber').value);

    if (!checkValues(distance, armor, angle, penetration)) {
        // Nieprawidłowe wartości, nie rysuj wykresu
        return;
    }

    // Pobranie kontekstu do rysowania wykresu z elementu HTML
    var ctx = document.getElementById('wykres').getContext('2d');

    // Sprawdzenie, czy istnieje już wykres na tej kanwie
    var existingChart = Chart.getChart(ctx);

    // Jeśli istnieje, zniszcz poprzedni wykres
    if (existingChart) {
        existingChart.destroy();
    }

    // Definicja gradientu dla koloru penetracji (radialny)
    var penetrationGradient = ctx.createRadialGradient(220, 220, 160, 200, 200, 500);
    penetrationGradient.addColorStop(0, 'rgba(37, 71, 8, 1)');
    penetrationGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

    // Definicja gradientu dla koloru odbicia (radialny)
    var reflectionGradient = ctx.createRadialGradient(220, 220, 160, 200, 200, 500);
    reflectionGradient.addColorStop(0, 'rgba(64, 69, 69, 1)');
    reflectionGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
    // Stworzenie nowego wykresu kołowego za pomocą biblioteki Chart.js
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            // Dane do wykresu - szansa penetracji i szansa odbicia
            labels: ['Szansa na penetracje', 'Szansa na odbicie'],
            datasets: [{
                label: 'Chance',
                data: [penetrationChance.toFixed(4), (100 - penetrationChance).toFixed(4)], // Procentowa szansa penetracji i szansa odbicia
                // Kolory dla sektorów wykresu
                backgroundColor: [
                    penetrationGradient,
                    reflectionGradient
                ],
                borderColor: [
                    'rgba(255, 255, 255)',
                    'rgba(255, 255, 255)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false, // Wyłączenie domyślnego legendy
                },
            },
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
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

    // Funkcja sprawdzająca, czy wszystkie pola są uzupełnione
    function checkFieldsFilled() {
        const distance = parseFloat(numberField.value);
        const armor = parseFloat(numberField2.value);
        const angle = parseFloat(numberField3.value);
        const penetration = parseFloat(numberField4.value);

        // Sprawdzamy, czy wszystkie pola mają wartości
        return !isNaN(distance) && !isNaN(armor) && !isNaN(angle) && !isNaN(penetration);
    }

    // Funkcja obsługująca zmianę wartości w polach tekstowych
    function handleFieldChange() {
        if (checkFieldsFilled()) {
            fireButton.classList.add('show'); // Dodaj klasę show, jeśli wszystkie pola są uzupełnione
        } else {
            fireButton.classList.remove('show'); // Usuń klasę show, jeśli jakieś pole jest puste
        }
    }

    // Nasłuchiwanie zmian wartości w polach tekstowych
    numberField.addEventListener('input', handleFieldChange);
    numberField2.addEventListener('input', handleFieldChange);
    numberField3.addEventListener('input', handleFieldChange);
    numberField4.addEventListener('input', handleFieldChange);

    // Nasłuchiwanie zmian wartości suwaków
    slider.addEventListener('input', function() {
        numberField.value = this.value;
        handleFieldChange();
    });
    slider2.addEventListener('input', function() {
        numberField2.value = this.value;
        handleFieldChange();
    });
    slider3.addEventListener('input', function() {
        numberField3.value = this.value;
        handleFieldChange();
    });
    slider4.addEventListener('input', function() {
        numberField4.value = this.value;
        handleFieldChange();
    });

    // Funkcja do obsługi wyświetlania komunikatów toast
function showArmorToast(toastContainerId, selectedArmorToastId, selectedValue) {
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
  
  // Nasłuchiwanie kliknięcia przycisku "WYBIERAM"
  chooseButtons.forEach(function(button) {
    button.addEventListener("click", function() {
      // Pobierz najbliższy element offcanvas
      const offcanvasElement = this.closest('.offcanvas');
      if (offcanvasElement) {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      }
  
      // Pobierz wszystkie radio buttons z grupy o nazwie 'listGroupRadio' wewnątrz offcanvas
      const radioButtons = offcanvasElement.querySelectorAll("input[name='listGroupRadio']");
      let selectedValue = "";
  
      // Sprawdź, który radio button został zaznaczony
      radioButtons.forEach(function(radioButton) {
        if (radioButton.checked) {
          selectedValue = radioButton.value;
        }
      });
  
      // Przypisz wartość zaznaczonego radio buttona do pola 'armorNumber' i suwaka 'armorSlider'
      document.getElementById("armorNumber").value = selectedValue;
      document.getElementById("armorSlider").value = selectedValue;
  
      // Tablica identyfikatorów
      const toastIds = ["60TP", "Maus", "T110E3", "SuperConqueror", "Type5Heavy", "705A"];
  
      // Wywołaj funkcję showArmorToast dla każdego id
      toastIds.forEach(function(id) {
        showArmorToast(`toastContainer${id}`, `selectedArmorToast${id}`, selectedValue);
      });
    });
  });

    // Dodaj nasłuchiwanie zdarzenia zmiany wartości suwaka 'armorSlider'
    document.getElementById("armorSlider").addEventListener("input", function() {
        document.getElementById("armorNumber").value = this.value;
    });

    //  skrypt do obsługi wyboru penetracji pocisku
    let selectedPenetration = 0;
    let isPenetrationSelected = false;

    document.querySelectorAll('.button-image-static-pocisk').forEach(img => {
        img.addEventListener('click', function() {
            selectedPenetration = this.getAttribute('data-penetration');
            document.querySelector('.guzik-laduj').classList.add('show');
            zaladuj(); // Wywołanie funkcji zaladuj() po kliknięciu obrazka
            isPenetrationSelected = true; // Ustawienie flagi na true, że pocisk został wybrany
        });
    });
    
     // Dodanie obsługi kliknięcia przycisku "Załaduj"
    const loadButton = document.querySelector('.guzik-laduj'); 
    if (loadButton) {
    loadButton.addEventListener('click', function() {
        // Sprawdzenie, czy pocisk został wybrany
        if (isPenetrationSelected) {
            const offcanvasElement = this.closest('.offcanvas');
            if (offcanvasElement) {
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
                if (offcanvasInstance) {
                    offcanvasInstance.hide();
                }
            }
            // Wyświetlenie komunikatu o aktualnie wybranym pocisku w formie tostera
            const toastContainer = document.getElementById('toastContainer');
            const selectedPenetrationToast = document.getElementById('selectedPenetrationToast'); // Poprawiona linia
            if (toastContainer && selectedPenetrationToast) { // Dodatkowe sprawdzenie
                const toast = new bootstrap.Toast(selectedPenetrationToast, { // Poprawiona linia
                    autohide: true,
                    delay: 3000
                });
                toast.show();
                selectedPenetrationToast.querySelector('span').innerText = selectedPenetration; // Poprawiona linia
            }
        } else {
            // Wyświetlenie komunikatu o konieczności wyboru pocisku
            alert("Wybierz pocisk przed użyciem.");
        }
    });
}

function zaladuj() {
    if (selectedPenetration > 0) {
        document.getElementById('penetrationNumber').value = selectedPenetration;
        document.getElementById('penetrationSlider').value = selectedPenetration;
    }
}

    
    var buttons = document.querySelectorAll('.button-image-static-pocisk');
    
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Usunięcie klasy 'selected' ze wszystkich przycisków
            buttons.forEach(function(btn) {
                btn.classList.remove('selected');
            });
            // Dodanie klasy 'selected' do klikniętego przycisku
            this.classList.add('selected');
        });
    });
});



// Dodanie skryptu wywołującego Modal
function openModal() {
    const distance = parseFloat(document.getElementById('distanceNumber').value);
    const armor = parseFloat(document.getElementById('armorNumber').value);
    const angle = parseFloat(document.getElementById('angleNumber').value);
    const penetration = parseFloat(document.getElementById('penetrationNumber').value);

    // Sprawdzenie poprawności wartości
    if (!checkValues(distance, armor, angle, penetration)) {
        return; // Przerwanie działania funkcji, jeśli wartości są nieprawidłowe
    }

    // Wywołanie funkcji calculate
    calculate();

    // Otwarcie modalu po kliknięciu przycisku "OGNIA"
    var myModal = new bootstrap.Modal(document.getElementById('wynikiModal'));
    myModal.show();

    // Otwieranie offcanvas z czołgami oraz informacjami o nich (grubość pancerza)
}
function toggleOffcanvasDane60TP() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('dane60TPLewandowskiego'));
    offcanvas.toggle();
}

function toggleOffcanvasArmor60TP() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('pancerz60TPLewandowskiego'));
    offcanvas.toggle();
}

function toggleOffcanvasDaneMaus() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('daneMaus'));
    offcanvas.toggle();
}

function toggleOffcanvasArmorMaus() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('pancerzMaus'));
    offcanvas.toggle();
}

function toggleOffcanvasDaneT110E3() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('daneT110E3'));
    offcanvas.toggle();
}

function toggleOffcanvasArmorT110E3() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('pancerzT110E3'));
    offcanvas.toggle();
}

function toggleOffcanvasDaneSuperConqueror() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('daneSuperConqueror'));
    offcanvas.toggle();
}

function toggleOffcanvasArmorSuperConqueror() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('pancerzSuperConqueror'));
    offcanvas.toggle();
}

function toggleOffcanvasDaneType5Heavy() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('daneType5Heavy'));
    offcanvas.toggle();
}

function toggleOffcanvasArmorType5Heavy() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('pancerzType5Heavy'));
    offcanvas.toggle();
}

function toggleOffcanvasDaneObject705A() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('daneObject705A'));
    offcanvas.toggle();
}

function toggleOffcanvasArmorObject705A() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('pancerzObject705A'));
    offcanvas.toggle();
}

// Otwieranie offcanvas z czołgami oraz informacjami o nich (penetracja)

function toggleOffcanvasDaneFV4005() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('daneFV4005'));
    offcanvas.toggle();
}

function toggleOffcanvasPenetracjaFV4005() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('penetracjaFV4005'));
    offcanvas.toggle();
}

function toggleOffcanvasDane2() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('dane2'));
    offcanvas.toggle();
}

function toggleOffcanvasPenetracja2() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('penetracja2'));
    offcanvas.toggle();
}

function toggleOffcanvasDane3() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('dane3'));
    offcanvas.toggle();
}

function toggleOffcanvasPenetracja3() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('penetracja3'));
    offcanvas.toggle();
}

function toggleOffcanvasDane4() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('dane4'));
    offcanvas.toggle();
}

function toggleOffcanvasPenetracja4() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('penetracja4'));
    offcanvas.toggle();
}

function toggleOffcanvasDane5() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('dane5'));
    offcanvas.toggle();
}

function toggleOffcanvasPenetracja5() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('penetracja5'));
    offcanvas.toggle();
}

function toggleOffcanvasDane6() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('dane6'));
    offcanvas.toggle();
}

function toggleOffcanvasPenetracja6() {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById('penetracja6'));
    offcanvas.toggle();
}