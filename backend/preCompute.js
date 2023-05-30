const mongoose = require('mongoose');
const geolib = require('geolib');

const mongoURL = "mongodb+srv://alhassan:p7OcHSJ3LRpJTgHz@stations.r5pneer.mongodb.net/stations?retryWrites=true&w=majority";

// Define schemas and models
const stationSchema = new mongoose.Schema({
    FID: {
        type: String,
        required: true,
    },
    fid: {
        type: Number,
        required: true,
    },
    geometry: {
        type: String,
        required: true,
    },
    stop_id: {
        type: String,
        required: true,
    },
    stop_name: {
        type: String,
        required: true,
    },
});

const routeSchema = new mongoose.Schema({
    FID: {
        type: String,
        required: true,
    },
    fid: {
        type: Number,
        required: true,
    },
    geometry: {
        type: String,
        required: true,
    },
    route_id: {
        type: String,
        required: true,
    },
    route_short_name: {
        type: String,
        required: true,
    },
    route_long_name: {
        type: String,
        required: true,
    },
    route_headsign: {
        type: String,
        required: true,
    },
    trip_id: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
});

const Station = mongoose.model("Station", stationSchema);
const Route = mongoose.model("Route", routeSchema);

// Function to calculate distance between two coordinates
const calculateDistance = (coord1, coord2) => {
    return geolib.getDistance(
        { latitude: coord1[0], longitude: coord1[1] },
        { latitude: coord2[0], longitude: coord2[1] }
    ) / 1000; // Conversion from meters to kilometers
};

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("database connected.");
    
    let stops = {};

    const stations = await Station.find({});
    for (let station of stations) {
        let coordinates = station.geometry.match(coordPattern)[1].split(' ').map(parseFloat);
        stops[station.stop_name] = { 'coordinates': coordinates, 'connections': {} };
    }

    const routes = await Route.find({});
    for (let route of routes) {
        let routeCoordinates = route.geometry.match(coordPattern)[0].split(',').map(coords => coords.split(' ').map(parseFloat));
        for (let i = 0; i < routeCoordinates.length - 1; i++) {
            let startCoords = routeCoordinates[i];
            let endCoords = routeCoordinates[i+1];
            let startStation = Object.keys(stops).reduce((a, b) => calculateDistance(stops[a]['coordinates'], startCoords) < calculateDistance(stops[b]['coordinates'], startCoords) ? a : b);
            let endStation = Object.keys(stops).reduce((a, b) => calculateDistance(stops[a]['coordinates'], endCoords) < calculateDistance(stops[b]['coordinates'], endCoords) ? a : b);

            if (startStation != endStation) {
                if (!stops[startStation]['connections'].hasOwnProperty(endStation))
                    stops[startStation]['connections'][endStation] = { 'route_id': route.route_id, 'distance': calculateDistance(stops[startStation]['coordinates'], stops[endStation]['coordinates']) };
                if (!stops[endStation]['connections'].hasOwnProperty(startStation))
                    stops[endStation]['connections'][startStation] = { 'route_id': route.route_id, 'distance': calculateDistance(stops[startStation]['coordinates'], stops[endStation]['coordinates']) };
            }
        }
    }

    fs.writeFileSync('metro_graph.json', JSON.stringify(stops, null, 4));
  });
