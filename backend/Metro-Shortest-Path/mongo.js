require("dotenv").config()
const mongoose = require("mongoose");
const mongoURL = process.env.CONNECTION_STRING;

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
  }).catch((err) => console.log(err.message));

module.exports = { userDatabase };