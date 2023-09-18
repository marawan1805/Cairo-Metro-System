import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({

    numOfStations: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Prices = mongoose.model('prices', priceSchema);

export default Prices;
