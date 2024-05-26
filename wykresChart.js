// Funkcje odpowiedzialne za generowanie wykresu pokazującego szanse na penetrację i odbicie na podstawie obliczeń.

// Funkcja generująca wykres
function generatePenetrationChart(penetrationChance) {
    var distance = parseFloat(document.getElementById('distanceNumber').value);
    var armor = parseFloat(document.getElementById('armorNumber').value);
    var angle = parseFloat(document.getElementById('angleNumber').value);
    var penetration = parseFloat(document.getElementById('penetrationNumber').value);

    if (!validateInputs(distance, armor, angle, penetration)) {
        return;
    }

    var ctx = document.getElementById('wykres').getContext('2d');
    var existingChart = Chart.getChart(ctx);

    if (existingChart) {
        existingChart.destroy();
    }

    var penetrationGradient = ctx.createRadialGradient(220, 220, 160, 200, 200, 500);
    penetrationGradient.addColorStop(0, 'rgba(37, 71, 8, 1)');
    penetrationGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

    var reflectionGradient = ctx.createRadialGradient(220, 220, 160, 200, 200, 500);
    reflectionGradient.addColorStop(0, 'rgba(64, 69, 69, 1)');
    reflectionGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Szansa na penetracje', 'Szansa na odbicie'],
            datasets: [{
                label: 'Chance',
                data: [penetrationChance.toFixed(4), (100 - penetrationChance).toFixed(4)],
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
                    display: false,
                },
            },
        }
    });
}

