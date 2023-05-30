import express from "express";
import userController from "./adminController.js";
const router = express.Router();

//define function logic in controller
router.route("/").get(userController.getAllStations);
router.route("/:stationName").get(userController.getStationByName);
router.route("/addStation").post(userController.addStation);
router.route("/delete/:stationName").delete(userController.deleteStation);

export default router;  