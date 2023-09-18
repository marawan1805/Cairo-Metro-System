import mongoose from "mongoose";

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
    route_id: {
        type: String,
        required: true,
    },
});

const Station = mongoose.model("stations", stationSchema);

export default Station;