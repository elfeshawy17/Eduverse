import express from "express";
import paymentController from "./payment.controller.js";
import { protectRoute } from "../../middlewares/protectRoute.js";
import { allowedTo } from "../../middlewares/allowedTo.js";

const paymentRouter = express.Router();

paymentRouter.post("/webhook", paymentController.handleStripeWebhook);

paymentRouter.post("/create-session", protectRoute, allowedTo("student"), paymentController.createStripeSession);

paymentRouter.get("/student/status", protectRoute, allowedTo("student"), paymentController.getStudentPayment);

paymentRouter.get("/admin/search", protectRoute, allowedTo("admin"), paymentController.searchStudentPayment);

export default paymentRouter;