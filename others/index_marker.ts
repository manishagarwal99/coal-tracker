/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

let map: google.maps.Map;
let infoWindow;
let directionsService ;
let directionsRenderer;

function initMap(): void {

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        zoom: 6,
        center: new google.maps.LatLng(22.5344, 87.331),
        mapTypeId: "roadmap",
    });
    directionsRenderer.setMap(map);

    // Create a <script> tag and set the USGS URL as the source.
    const script = document.createElement("script");
    infoWindow = new google.maps.InfoWindow();

    // const transitLayer = new google.maps.TransitLayer();
    // transitLayer.setMap(map);

    // script.src = "files/railway_sheds.js";
    // script.src = "files/industrial_belts.js";
    //script.src = "files/ports.js";
    script.src = "files/all.js";

    document.getElementsByTagName("head")[0].appendChild(script);
    map.addListener("click", (e) => {
        //console.log(e.latLng.toJSON());
        //placeMarkerAndPanTo(e.latLng, map);
    });
}

function placeMarkerAndPanTo(latLng, map) {
    new google.maps.Marker({
        position: latLng,
        map: map,
    });
    map.panTo(latLng);
    calcRoute(latLng);
    calcRoute1(latLng);
}

function calcRoute(latLng) {
    let start = latLng;
    let end = new google.maps.LatLng(22.5726, 88.3639);
    let request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        }
    });
}
function calcRoute1(latLng) {
    let start = latLng;
    let end = { lat: 20.8333, lng: 86.9013 };
    let request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        }
    });
}


// Loop through the results array and place a marker for each
// set of coordinates.
const ports_callback = function (results: any) {
    for (let i = 0; i < results.features.length; i++) {
        const coords = results.features[i].geometry.coordinates;
        const latLng = new google.maps.LatLng(coords[0], coords[1]);

        const marker = new google.maps.Marker({
            position: latLng,
            title: results.features[i].id,
            map: map,
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
        });

        marker.addListener("click", () => {
            infoWindow.close();
            infoWindow.setContent(marker.getTitle());
            infoWindow.open(marker.getMap(), marker);
        });
    }
};

const industrial_belts_callback = function (results: any) {
    for (let i = 0; i < results.features.length; i++) {
        const coords = results.features[i].geometry.coordinates;
        const latLng = new google.maps.LatLng(coords[0], coords[1]);

        const marker = new google.maps.Marker({
            position: latLng,
            title: results.features[i].id,
            map: map,
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
            }
        });

        marker.addListener("click", () => {
            infoWindow.close();
            infoWindow.setContent(marker.getTitle());
            infoWindow.open(marker.getMap(), marker);
        });
    }
};
const railway_sheds_callback = function (results: any) {
    for (let i = 0; i < results.features.length; i++) {
        const coords = results.features[i].geometry.coordinates;
        const latLng = new google.maps.LatLng(coords[0], coords[1]);

        const marker = new google.maps.Marker({
            position: latLng,
            title: results.features[i].id,
            map: map,
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            }
        });

        marker.addListener("click", () => {
            infoWindow.close();
            infoWindow.setContent(marker.getTitle());
            infoWindow.open(marker.getMap(), marker);
        });
    }
};

declare global {
    interface Window {
        initMap: () => void;
        ports_callback: (results: any) => void;
        industrial_belts_callback: (results: any) => void;
        railway_sheds_callback: (results: any) => void;
    }
}
window.initMap = initMap;
window.ports_callback = ports_callback;
window.industrial_belts_callback = industrial_belts_callback;
window.railway_sheds_callback = railway_sheds_callback;
export {};
