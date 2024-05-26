function toggleOffcanvas(id) {
    var offcanvas = new bootstrap.Offcanvas(document.getElementById(id));
    offcanvas.toggle();
}

// Otwieranie offcanvas z czołgami oraz informacjami o nich (grubość pancerza)
function toggleOffcanvasDaneArmorTank(id) {
    toggleOffcanvas('dane' + id);
    toggleOffcanvas('pancerz' + id);
}

// Otwieranie offcanvas z czołgami oraz informacjami o nich (penetracja)
function toggleOffcanvasDanePenetrationTank(id) {
    toggleOffcanvas('dane' + id);
    toggleOffcanvas('penetracja' + id);
}