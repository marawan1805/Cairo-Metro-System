import mongoose from "mongoose";
const mongoURL =
  "mongodb+srv://alhassan:p7OcHSJ3LRpJTgHz@stations.r5pneer.mongodb.net/stations?retryWrites=true&w=majority";

// const port = 3005
let isConnected = false;
const userDatabase = mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    isConnected = true;
    console.log("database connected.");
  });

export { userDatabase };