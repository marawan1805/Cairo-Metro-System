import express from "express";
import tripController from "./tripController.js";
const router = express.Router();
  
//define function logic in controller
router.route("/").get(tripController.getAllTrips);
router.route("/:id").get(tripController.getTripById);
router.route("/delete").delete(tripController.deleteTrip);
router.route("/update").patch(tripController.updateTrip);
router.route("/book").post(tripController.bookTrip);


export default router;  