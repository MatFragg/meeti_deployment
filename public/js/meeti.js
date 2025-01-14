document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('#location-map')) {
        showMap();
    }
});


function showMap() {
    const lat = document.querySelector('#lat').value,
        lng = document.querySelector('#lng').value
        address = document.querySelector('#address').value; 

    var map = L.map('location-map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
        .bindPopup(address)
        .openPopup();
}