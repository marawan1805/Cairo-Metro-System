import express from "express";
import userController from "./adminController.js";
const router = express.Router();

//define function logic in controller
router.route("/").get(userController.getAllStations);
router.route("/geoJSON").get(userController.getAllStationsGEOJSON)
router.route("/routesGeoJSON").get(userController.getAllRoutesGEOJSON)
router.route("/find/:stationName").get(userController.getStationByName);
router.route("/schedules").get(userController.getAllSchedules);
router.route("/schedules/:station").get(userController.getSchedulesByStationName);
router.route("/prices").get(userController.getAllPrices);
router.route("/addStation").post(userController.addStation);
router.route("/updateStation/:stationName").post(userController.updateStation);
router.route("/route-station").post(userController.insertStation);
router.route("/deleteStation/:stationName").post(userController.deleteStationAndUpdateRoute);
router.route("/updatePrice").patch(userController.updatePrice);
router.route("/updateSchedule/:stopId").post(userController.updateSchedule);
router.route("/delete/:stationName").delete(userController.deleteStation);
router.route("/delete/:route_id").delete(userController.deleteRoute);
router.route("/updateRoute/:route_id").patch(userController.updateRoute);


export default router;