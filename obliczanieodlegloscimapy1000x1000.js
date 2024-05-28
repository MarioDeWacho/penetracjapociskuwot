//Funkcja licząca odległość między czołgami na mapach


document.addEventListener('DOMContentLoaded', function() {
    console.log('Zdarzenie DOMContentLoaded wywołane');

    // Funkcja inicjalizująca dla modalu
    function initializeModal(modalId) {
        const modal = document.getElementById(modalId);
        const imageContainer = modal.querySelector('.modal-body #image-container');
        const line = imageContainer.querySelector('#line');
        const distanceDisplay = modal.querySelector('#distance');

        if (!imageContainer || !line || !distanceDisplay) {
            console.log(`Nie znaleziono wymaganych elementów w modalu ${modalId}`);
            return;
        }

        console.log(`Znalezione elementy w modalu ${modalId}:`, { imageContainer, line, distanceDisplay });

        let points = [];
        let draggingPoint = null;

        // Funkcja do obliczania odległości między dwoma punktami
        function calculateDistance(p1, p2) {
            const dx = p2.x - p1.x;
            const dy = p1.y - p2.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        // Funkcja do aktualizacji linii między punktami
        function updateLine() {
            if (points.length === 2) {
                line.setAttribute('x1', points[0].x);
                line.setAttribute('y1', points[0].y);
                line.setAttribute('x2', points[1].x);
                line.setAttribute('y2', points[1].y);
                line.style.display = 'block';

                const distance = calculateDistance(points[0], points[1]);
                distanceDisplay.textContent = `${Math.round(distance)}`;
            } else {
                line.style.display = 'none';
                distanceDisplay.textContent = '';
            }
        }

        // Funkcja do tworzenia nowego punktu
        function createPoint(x, y, colorClass) {
            console.log(`Tworzenie punktu w (${x}, ${y})`);
            const point = document.createElement('div');
            point.className = `point ${colorClass}`;
            point.style.left = `${x - 7.5}px`;
            point.style.top = `${y - 7.5}px`;

            // Dodaj zdarzenie do przeciągania punktu
            point.addEventListener('mousedown', function(e) {
                draggingPoint = point;
                document.addEventListener('mousemove', movePoint);
                document.addEventListener('mouseup', stopDragging);
            });

            imageContainer.appendChild(point);
            return { element: point, x, y };
        }

        // Funkcja do przemieszczania punktu
        function movePoint(e) {
            const rect = imageContainer.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            x = Math.max(0, Math.min(x, rect.width));
            y = Math.max(0, Math.min(y, rect.height));

            draggingPoint.style.left = `${x - 7.5}px`;
            draggingPoint.style.top = `${y - 7.5}px`;

            const pointIndex = points.findIndex(p => p.element === draggingPoint);
            points[pointIndex] = { element: draggingPoint, x, y };

            updateLine();
        }

        // Funkcja do zatrzymania przeciągania
        function stopDragging() {
            document.removeEventListener('mousemove', movePoint);
            document.removeEventListener('mouseup', stopDragging);
            draggingPoint = null;
        }

        // Obsługa kliknięcia w kontenerze obrazu
        imageContainer.addEventListener('click', function(e) {
            if (draggingPoint) return;

            const rect = imageContainer.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            x = Math.max(0, Math.min(x, rect.width));
            y = Math.max(0, Math.min(y, rect.height));

            if (points.length < 2) {
                const colorClass = points.length === 0 ? 'green' : 'red';
                points.push(createPoint(x, y, colorClass));
            } else {
                const colorClass = e.target.classList.contains('green') ? 'green' : 'red';
                const pointIndex = colorClass === 'green' ? 0 : 1;
                points[pointIndex].x = x;
                points[pointIndex].y = y;
                points[pointIndex].element.style.left = `${x - 7.5}px`;
                points[pointIndex].element.style.top = `${y - 7.5}px`;
            }

            updateLine();
        });

        // Obsługa przycisku WYBIERAM
        modal.querySelector('#chooseDistanceBtn').addEventListener('click', function() {
            const distance = distanceDisplay.textContent;
            document.getElementById('distanceSlider').value = distance;
            document.getElementById('distanceNumber').value = distance;
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        });
    }

    // Inicjalizacja wszystkich modalów
    ['ustawOdlegloscAbbey', 'ustawOdlegloscAirfield', 'ustawOdlegloscArcticRegion', 
     'ustawOdlegloscCliff', 'ustawOdlegloscDesert', 'ustawOdlegloscElHallouf', 
     'ustawOdlegloscErlenberg', 'ustawOdlegloscFishermansBay', 'ustawOdlegloscFjords', 
     'ustawOdlegloscHighway', 'ustawOdlegloscKarelia', 'ustawOdlegloscLiveOaks', 
     'ustawOdlegloscMalinovka', 'ustawOdlegloscMountainPass', 'ustawOdlegloscMurovanka', 
     'ustawOdlegloscPearlRiver', 'ustawOdlegloscProhorovka', 'ustawOdlegloscSereneCoast', 
     'ustawOdlegloscSiegfriedLine', 'ustawOdlegloscSteppes', 'ustawOdlegloscWestfeld']
    .forEach(initializeModal);
});

