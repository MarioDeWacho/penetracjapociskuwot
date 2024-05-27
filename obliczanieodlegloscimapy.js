//Funkcja licząca odległość między czołgami na mapach


document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    
    // Znajdź elementy w DOM
    const imageContainer = document.getElementById('image-container');
    const line = document.getElementById('line');
    const distanceDisplay = document.getElementById('distance');

    if (!imageContainer) {
        console.log('imageContainer not found');
        return;
    }
    if (!line) {
        console.log('line not found');
        return;
    }
    if (!distanceDisplay) {
        console.log('distanceDisplay not found');
        return;
    }

    console.log('Elements found:');
    console.log('imageContainer:', imageContainer);
    console.log('line:', line);
    console.log('distanceDisplay:', distanceDisplay);

    // Zmienna do przechowywania punktów
    let points = [];
    // Zmienna do przechowywania aktualnie przeciąganego punktu
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
            distanceDisplay.textContent = `Distance: ${Math.round(distance)} m`;
        } else {
            line.style.display = 'none';
            distanceDisplay.textContent = '';
        }
    }

    // Funkcja do tworzenia nowego punktu
    function createPoint(x, y, colorClass) {
        console.log(`Creating point at (${x}, ${y})`);
        const point = document.createElement('div');
        point.className = `point ${colorClass}`;
        point.style.left = `${x - 7.5}px`; // Pozycjonowanie uwzględniające większy rozmiar punktu
        point.style.top = `${y - 7.5}px`;

        // Dodaj zdarzenie do przeciągania punktu
        point.addEventListener('mousedown', function(e) {
            console.log('mousedown event on point');
            draggingPoint = point;
            document.addEventListener('mousemove', movePoint);
            document.addEventListener('mouseup', stopDragging);
        });

        // Dodaj punkt do kontenera
        imageContainer.appendChild(point);
        return {element: point, x, y};
    }

    // Funkcja do przemieszczania punktu
    function movePoint(e) {
        const rect = imageContainer.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        // Ograniczenie ruchu do obszaru obrazka
        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        draggingPoint.style.left = `${x - 7.5}px`; // Pozycjonowanie uwzględniające większy rozmiar punktu
        draggingPoint.style.top = `${y - 7.5}px`;

        const pointIndex = points.findIndex(p => p.element === draggingPoint);
        points[pointIndex] = {element: draggingPoint, x, y};

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
        console.log('Click event on imageContainer');
        if (draggingPoint) return;

        const rect = imageContainer.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        // Ograniczenie ruchu do obszaru obrazka
        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        if (points.length < 2) {
            const colorClass = points.length === 0 ? 'green' : 'red';
            points.push(createPoint(x, y, colorClass));
        } else {
            // Aktualizacja położenia istniejącego punktu zamiast jego usunięcia
            const colorClass = e.target.classList.contains('green') ? 'green' : 'red';
            if (colorClass === 'green') {
                points[0].x = x;
                points[0].y = y;
                points[0].element.style.left = `${x - 7.5}px`;
                points[0].element.style.top = `${y - 7.5}px`;
            } else {
                points[1].x = x;
                points[1].y = y;
                points[1].element.style.left = `${x - 7.5}px`;
                points[1].element.style.top = `${y - 7.5}px`;
            }
        }

        updateLine();
    });
});