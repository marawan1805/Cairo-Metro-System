import express from "express";
import createError from "http-errors";
import cors from "cors";
import tripRouter from "./tripRoutes.js";
import * as dotenv from 'dotenv' 
import morgan from "morgan";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.options("*", cors());
app.use(morgan("tiny"));
app.use("/api/trips", tripRouter);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message
  });
});

const PORT = 3009;
app.listen(PORT, () => console.log(`Trip service running on http://localhost:${PORT}`));