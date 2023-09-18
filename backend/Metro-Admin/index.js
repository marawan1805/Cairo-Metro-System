import express from "express";
import createError from "http-errors";
import cors from "cors";
import adminRouter from "./adminRoutes.js";
import "./mongo.js";


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.options("*", cors());

app.use("/api/admin", adminRouter);

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

const PORT = 3008;
app.listen(PORT, () => console.log(`Admin service running on http://localhost:${PORT}`));