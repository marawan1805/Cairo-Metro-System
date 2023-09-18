import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    route_id: {
        type: String, required: true
    },
    direction: {
        type: String, required: true
    },
    stop_id: {
        type: String, required: true
    },
    stop_name: {
        type: String, required: true
    },
    arrival_time: {
        type: String, required: true
    },
    departure_time: {
        type: String, required: true
    }
});




const Schedule = mongoose.model("schedules", scheduleSchema);

export default Schedule;