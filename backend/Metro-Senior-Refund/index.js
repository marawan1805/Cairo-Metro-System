import express from "express";
import createError from "http-errors";
import cors from "cors";
import seniorRouter from "./seniorRoutes.js";
import refundRouter from "./refundRoutes.js";

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(
  {
    origin: "*"
  }
));
// app.options("*", cors());

app.use("/api/senior-request", seniorRouter);
app.use("/api/refund-request", refundRouter);

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

const PORT = 3001;
app.listen(PORT, () => console.log(`Senior service running on http://localhost:${PORT}`));