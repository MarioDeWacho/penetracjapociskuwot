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
// Funkcja zamykająca dowolny otwarty modal w momencie otwarcia inndego
document.addEventListener('DOMContentLoaded', function() {
    // Function to close all modals
    function closeAllModals() {
        var modals = document.querySelectorAll('.modal.show');
        modals.forEach(function(modal) {
            var modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }

    // Nasłuchiwanie otwarcia modala
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach(function(button) {
        button.addEventListener('click', function(event) {
            var targetModal = document.querySelector(button.getAttribute('data-bs-target'));
            if (targetModal) {
                closeAllModals();
                var modalInstance = new bootstrap.Modal(targetModal);
                modalInstance.show();
            }
        });
    });

    
    document.querySelectorAll('.modal').forEach(function(modal) {
        modal.addEventListener('show.bs.modal', function () {
            closeAllModals();
        });
    });
});