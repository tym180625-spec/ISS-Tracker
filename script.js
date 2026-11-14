//([latitude, longitude], zoom level)
const map = L.map('issMap').setView([0, 0], 10);

//tile url and attribution, just found in leaflet documentation, can use other tile providers as well
//the attribution is an object that gives credit to the tile provider, in this case OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//customize icon
const issIcon = L.icon({
    iconUrl: 'ISS.webp',
    iconSize: [100, 64],
    iconAnchor: [25, 16],
});

//create marker for later
const marker = L.marker([0, 0], {icon: issIcon}).addTo(map);

//create line path of iss
let latlngs = [];

const issPath = L.polyline(latlngs, {color: 'red'}).addTo(map);

//api endpoint for iss location
const api_url = "https://api.wheretheiss.at/v1/satellites/25544";
let hasInitialPosition = false;

const getISS = async () => {
    const response = await fetch(api_url);
    if (!response.ok) {
        throw new Error(`ISS location request failed: ${response.status}`);
    }

    //need to convert the response to json before we can use it
    const data = await response.json();
    console.log(data.latitude);
    console.log(data.longitude);

    //can even use destructuring to get the lat and long
    const {latitude, longitude} = data;
    console.log(latitude);
    console.log(longitude);

    document.getElementById("lat").textContent = latitude;
    document.getElementById("long").textContent = longitude;
    
    marker.setLatLng([latitude, longitude]);
    if (!hasInitialPosition) {
        map.setView([latitude, longitude], 10);
        hasInitialPosition = true;
    }

    latlngs.push([latitude, longitude]);
    issPath.setLatLngs(latlngs);
}

getISS().catch(console.error);
setInterval(() => getISS().catch(console.error), 5000);
