import mapStyles from './js/dark-map-style';

import {render} from './js/deck';

const selectEl = '#source-select';


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
    const value = document.querySelector(selectEl).value;
    const data = await getDatFromSource(value);
    render(data)
}

function showSources(data) {
    const select = document.querySelector(selectEl);
    data.forEach(d => {
        const option = document.createElement('option');
        option.value = d.name;
        option.text = d.data;
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
    showSources(sources);
    const data = await getDatFromSource(sources[sources.length - 1].name);

    const options = document.querySelectorAll(selectEl + '>option');
    options[options.length - 1].selected = 'selected';

    render(data)
        .setMap(map);
}

window.initMap = init;
window.changeSource = changeSource;

