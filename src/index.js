import mapStyles from './js/dark-map-style';

import {render} from './js/deck';

const selectEl = '#source-select';
let analitics = null;


function getSources() {
    return fetch('./data/sources.json').then(
        res => res.json()
    );
}

function getDatFromSource(input) {
    return fetch(`./data/${input}`).then(
        res => res.json()
    );
}

async function changeSource() {
    const el = document.querySelector(selectEl);
    const data = await getDatFromSource(el.value);
    render(data);

    analitics.logEvent('source_changed', {
        source: el.value,
    });
}

function showSources(data, selected) {
    selected = !!selected ? selected : 0;
    const select = document.querySelector(selectEl);
    data.forEach((d, i) => {
        const option = document.createElement('option');
        option.value = d.name;
        option.text = d.data;
        if (i === selected) {
            option.selected = 'selected';
        }
        select.appendChild(option);
    });
}

async function init () {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.7700483, lng: 13.2365304},
        zoom: 6.12,
        disableDefaultUI: true,
        styles: mapStyles
    });

    const sources = await getSources();
    const data = await getDatFromSource(sources[sources.length - 1].name);
    showSources(sources, sources.length - 1);

    render(data)
        .setMap(map);
}

window.initMap = init;
window.changeSource = changeSource;

document.addEventListener('DOMContentLoaded', () => {
    const firebaseConfig = {
        apiKey: "AIzaSyA_E0PhBv-tAdh9K02Y6EaPI2kqQ8lHFHs",
        authDomain: "covid-deckgl.firebaseapp.com",
        databaseURL: "https://covid-deckgl.firebaseio.com",
        projectId: "covid-deckgl",
        storageBucket: "covid-deckgl.appspot.com",
        messagingSenderId: "396813169079",
        appId: "1:396813169079:web:46cc801619fa819f99b832",
        measurementId: "G-S0FTKQBSBQ"
    };
    firebase.initializeApp(firebaseConfig);
    analitics = firebase.analytics();

    analitics.logEvent('page_visualization');
});
