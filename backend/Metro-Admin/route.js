import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  FID: {
    type: String,
  },
  fid: {
    type: Number,
  },
  geometry: {
    type: String,
  },
  route_id: {
    type: String,
  },
  route_short_name: {
    type: String,
  },
  route_long_name: {
    type: String,
  },
  route_headsign: {
    type: String,
  },
  trip_id: {
    type: String,
  },
  destination: {
    type: String,
  },
  direction: {
    type: Number,
  },
});

const Route = mongoose.model('route', routeSchema);

export default Route;








