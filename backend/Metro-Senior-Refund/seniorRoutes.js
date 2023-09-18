import express from "express";
import seniorController from "./seniorController.js";
const router = express.Router();

//define function logic in controller
router.route("/").get(seniorController.getAllSeniorRequests);
router.route("/update").patch(seniorController.updateSeniorRequest);
router.route("/approve").post(seniorController.approveSeniorRequest);
router.route("/reject").post(seniorController.rejectSeniorRequest);
export default router;  