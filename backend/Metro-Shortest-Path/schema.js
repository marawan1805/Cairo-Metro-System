const mongoose = require("mongoose");
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

const Station = mongoose.model("stations", stationSchema);
const Route = mongoose.model("routes", routeSchema);

module.exports = {
  Station: Station,
  Route: Route,
};
