function generatePenetrationChart(penetrationChance) {
    var distance = parseFloat(document.getElementById('distanceNumber').value);
    var armor = parseFloat(document.getElementById('armorNumber').value);
    var angle = parseFloat(document.getElementById('angleNumber').value);
    var penetration = parseFloat(document.getElementById('penetrationNumber').value);

    if (!validateInputs(distance, armor, angle, penetration)) {
        return;
    }

    // Ustawienie wartości parametrów w modalu
    document.getElementById('distanceValue').textContent = distance.toFixed(2);
    document.getElementById('armorValue').textContent = armor.toFixed(2);
    document.getElementById('angleValue').textContent = angle.toFixed(2);
    document.getElementById('penetrationValue').textContent = penetration.toFixed(2);

    var ctx = document.getElementById('wykres').getContext('2d');
    var existingChart = Chart.getChart(ctx);

    if (existingChart) {
        existingChart.destroy();
    }

    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Szansa na penetracje', 'Szansa na odbicie'],
            datasets: [{
                label: 'Chance',
                data: [penetrationChance.toFixed(4), (100 - penetrationChance).toFixed(4)],
                backgroundColor: [
                    'rgba(37, 71, 8, 1)',
                    'rgba(64, 69, 69, 1)'
                ],
                borderColor: [
                    'rgba(192, 192, 192)',
                    'rgba(192, 192, 192)'
                ],
                borderWidth: 2
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
            animation: {
                duration: 300,
                easing: 'easeInOutQuad',
                animateScale: true,
                animateRotate: true,
            }
        }
    });
}
