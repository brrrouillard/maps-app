let lat = 50.8504500;
let lon = 4.3487800;
let mymap = null;
const API_URL = "http://localhost:5000/items";

/*
* TO GET USER LOCATION
*/
/*navigator.geolocation.getCurrentPosition(position => {
    lat = position.coords.latitude;
    lon = position.coords.longitude
});*/

let popups = [];

let data = {
    docs: []
};

fetch(API_URL) // FIRST FETCH TO SERVER
    .then(response => {
        response.json()
            .then(json => {
                data.docs = json.docs;
                addMarkers();
            })
    });

// Fonction d'initialisation de la carte
const initMap = () => {
    // Créer l'objet "mymap" et l'insèrer dans l'élément HTML qui a l'ID "map"
    mymap = L.map('mapid').setView([lat, lon], 11);
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(mymap);
}

const addMarkers = () => {
    data.docs.map(item => {
        if (typeof item.lat != null || typeof item.lon != null) {
            let popupText = "";
            if (typeof item.images !== 'undefined') // If there is an image in data
                popupText += `<img src="${item.images[0]}" class="map-image-preview"/>`;

            popupText += `
            <b>${item.name}</b><br>
            ${item.description}
            `; // Popup text

            let marker = L.marker([item.lat, item.lon])
            .bindPopup(popupText).openPopup().addTo(mymap);
        }
    });
}

const pushNewItem = (name, description, lat, lon) => {
    data.docs.push({
        name: name,
        description: description,
        lat: lat,
        lon: lon
    });
}

const init = () => {
    initMap();
    addMarkers();
    mymap.on('click', onMapClick); // LISTENER
}


/*
* EVENT LISTENERS 
*/

const formHandler = () => {
    let form = document.querySelector('.addItemForm');
    data.docs.push({
        name: form.children[0].value,
        description: form.children[1].value,
        lat: form.children[2].value,
        lon: form.children[3].value,
    });
    addMarkers();
}

const onMapClick = e => {
    console.log(e);
    document.querySelector('.logs').innerHTML = e.latlng.lat;
    let newName = prompt("Entrez le nom de l'objet");
    let newDesc = prompt("Entrez une description");
    pushNewItem(newName, newDesc, e.latlng.lat, e.latlng.lng);

    let postData = {
        name: newName,
        description: newDesc,
        lat: e.latlng.lat,
        lon: e.latlng.lng
    }

    console.log(JSON.stringify(postData));
    fetch(`${API_URL}/new`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
            method: "POST"
        });
    addMarkers();
}

window.onload = init(); 
