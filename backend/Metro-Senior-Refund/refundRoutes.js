import express from "express";
import refundController from "./refundController.js";
const router = express.Router();


router.route("/").get(refundController.getAllRefundRequests);
router.route("/approve").post(refundController.approveRefundRequest);
router.route("/reject").post(refundController.rejectRefundRequest);
router.route("/:id").post(refundController.createRefundRequest);

export default router;  