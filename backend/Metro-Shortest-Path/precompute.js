const mongoose = require('mongoose');
const geolib = require('geolib');
const fs = require('fs');
const path = require('path');

const jsonDirectory = path.join(process.cwd(), 'json');

module.exports = function precompute() {

// Regular expression pattern for coordinates
const coordPattern = /\((.+)\)/;

// Connect to MongoDB
mongoose.connect('mongodb+srv://alhassan:p7OcHSJ3LRpJTgHz@stations.r5pneer.mongodb.net/stations?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
const stopsCollection = db.collection('stations');
const routesCollection = db.collection('routes');

let stops = {};

stopsCollection.find().toArray((err, stopResults) => {
    stopResults.forEach(stop => {
        let coordinateString = coordPattern.exec(stop.geometry)[1].trim();
        let coordinates = coordinateString.split(' ').map(coord => parseFloat(coord)).filter(coord => coord);

        stops[stop.stop_name] = { 'coordinates': coordinates, 'connections': {} };
    });

    function calculateDistance(coord1, coord2) {
        return geolib.getDistance(
            { latitude: coord1[1], longitude: coord1[0] },
            { latitude: coord2[1], longitude: coord2[0] },
            1
        ) / 1000; // Converting from meters to kilometers
    }

    routesCollection.find().toArray((err, routeResults) => {
        routeResults.forEach(row => {
            let routeCoordinates = coordPattern.exec(row.geometry)[1].split(",").map(coords => coords.split().map(coord => parseFloat(coord)));

            for (let i = 0; i < routeCoordinates.length - 1; i++) {
                let startCoords = routeCoordinates[i], endCoords = routeCoordinates[i + 1];
                let startStation = Object.keys(stops).reduce((a, b) => calculateDistance(stops[a].coordinates, startCoords) < calculateDistance(stops[b].coordinates, startCoords) ? a : b);
                let endStation = Object.keys(stops).reduce((a, b) => calculateDistance(stops[a].coordinates, endCoords) < calculateDistance(stops[b].coordinates, endCoords) ? a : b);

                if (startStation !== endStation) {
                    if (!stops[startStation].connections[endStation]) {
                        stops[startStation].connections[endStation] = { 'route_id': row.route_id, 'distance': calculateDistance(stops[startStation].coordinates, stops[endStation].coordinates) };
                    }
                    if (!stops[endStation].connections[startStation]) {
                        stops[endStation].connections[startStation] = { 'route_id': row.route_id, 'distance': calculateDistance(stops[startStation].coordinates, stops[endStation].coordinates) };
                    }
                }
            }
        });

        // Save the output to a JSON file
        fs.writeFileSync(jsonDirectory + '/metro_graph.json', JSON.stringify(stops, null, 4));
    });
});
}