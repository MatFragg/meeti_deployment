import {OpenStreetMapProvider} from 'leaflet-geosearch';
import attendance from './attendance.js';
import deleteComment from './deleteComment.js';

// Get value from DB

const lat = document.querySelector('#lat').value || -12.051750;
const lng = document.querySelector('#lng').value || -77.034746;
const address = document.querySelector('#address').value || '';
const map = L.map('map').setView([lat, lng], 15);

let markers = new L.FeatureGroup().addTo(map);
let marker;

const geocodeService = L.esri.Geocoding.geocodeService();


// Put the ping at Edition
if(lat && lng){
    marker = new L.marker([lat,lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(map)
    .bindPopup(address)
    .openPopup();

    markers.addLayer(marker);
    // Detect movement
    marker.on('moveend', function (e) {
        marker = e.target;
        const position = marker.getLatLng();
        map.panTo(new L.LatLng(position.lat, position.lng), 1000);

        // Reverse Geocoding when the user moves the pin
        geocodeService.reverse().latlng(position, 15).run(function (error, geocodeResult) {
            fillInputs(geocodeResult);
            // Asign the values to marker's popup
            marker.bindPopup(geocodeResult.address.LongLabel);
        });
    });
}

document.addEventListener('DOMContentLoaded',()=>{
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Search the Address
    const searcher = document.querySelector('#searcherform');
    searcher.addEventListener('input', searchAddress);
});

function searchAddress(e) {
    if (e.target.value.length > 8) {
        // If there is an older ping , clean it
        markers.clearLayers();

        // Remove the current marker if it exists
        if (marker) {
            map.removeLayer(marker);
        }

        // Use Provider
        const provider = new OpenStreetMapProvider();
        provider.search({ query: e.target.value }).then((result) => {
            console.log('Search result:', result);
            if (result && result.length > 0 && result[0].bounds) {
                geocodeService.reverse().latlng(result[0].bounds[0], 15).run(function (error, geocodeResult) {
                    if (error) {
                        console.error('Geocode error:', error);
                        return;
                    }
                    console.log('Geocode result:', geocodeResult);
                    fillInputs(geocodeResult);
                    // Show the map
                    map.setView(result[0].bounds[0], 15);

                    // Add the pin
                    marker = new L.marker(result[0].bounds[0], {
                        draggable: true,
                        autoPan: true
                    })
                    .addTo(map)
                    .bindPopup(result[0].label)
                    .openPopup();

                    // Assign the marker to its container
                    markers.addLayer(marker);

                    // Detect movement
                    marker.on('moveend', function (e) {
                        marker = e.target;
                        const position = marker.getLatLng();
                        map.panTo(new L.LatLng(position.lat, position.lng), 1000);

                        // Reverse Geocoding when the user moves the pin
                        geocodeService.reverse().latlng(position, 15).run(function (error, geocodeResult) {
                            fillInputs(geocodeResult);
                            // Asign the values to marker's popup
                            marker.bindPopup(geocodeResult.address.LongLabel);
                        });
                    });
                });
            } else {
                console.warn('No valid results found for query:', e.target.value);
            }
        }).catch((error) => {
            console.error('Search error:', error);
        });    
    };
}

function fillInputs(result) {
    document.querySelector('#address').value = result.address.Address || '';
    document.querySelector('#city').value = result.address.City || '';
    document.querySelector('#state').value = result.address.Region || '';
    document.querySelector('#country').value = result.address.CountryCode || '';
    document.querySelector('#lat').value = result.latlng.lat || '';
    document.querySelector('#lng').value = result.latlng.lng || '';
}