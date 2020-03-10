import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';

let deck = null;

const scatterplot = (data) => new ScatterplotLayer({
    id: 'scatter',
    data: data,
    opacity: 0.8,
    filled: true,
    radiusMinPixels: 2,
    radiusMaxPixels: 5,
    getPosition: d => [d.long, d.lat],
    getFillColor: d => d.totale_casi > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100],
    getWeight: d => d.totale_casi * 1000,
    radiusPixels: 50,
    pickable: true,
    onHover: ({object, x, y}) => {
        const el = document.getElementById('tooltip');
        if (object) {
            /*
            *  "data": "2020-03-08 18:00:00",
              "stato": "ITA",
              "codice_regione": 1,
              "denominazione_regione": "Piemonte",
              "codice_provincia": 991,
              "denominazione_provincia": "In fase di definizione/aggiornamento",
              "sigla_provincia": 0,
              "lat": 0,
              "long": 0,
              "totale_casi": 88
            *
            *
            * */
            el.innerHTML = `<h1>${object.denominazione_provincia}: ${object.totale_casi}</h1>`;
            el.style.display = 'block';
            el.style.opacity = 0.9;
            el.style.left = x + 'px';
            el.style.top = y + 'px';
        } else {
            el.style.opacity = 0.0;
        }
    },

    onClick: ({object, x, y}) => {
        window.open(`https://www.gunviolencearchive.org/incident/${object.incident_id}`)
    },
});

const heatmap = (data) => new HeatmapLayer({
    id: 'heat',
    data: data,
    getPosition: d => [d.long, d.lat],
    getWeight: d => d.totale_casi,
    radiusPixels: 50,
});

const hexagon = (data) => new HexagonLayer({
    id: 'hex',
    data: data,
    getPosition: d => [d.long, d.lat],
    getElevationWeight: d => d.totale_casi,
    elevationScale: 100,
    extruded: true,
    radius: 1609,
    opacity: 0.6,
    coverage: 0.88,
    lowerPercentile: 50
});

export function render(data) {
    if (!deck) {
        deck = new GoogleMapsOverlay();
    }
    deck.setProps({
        layers: [
            scatterplot(data),
            heatmap(data),
            hexagon(data)
        ],
    });
    return deck;
}
