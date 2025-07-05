import { Router } from "express";
import { protectRoute } from "../../middlewares/protectRoute.js";
import enrollmentController from "./enrollment.controller.js";
import { allowedTo } from "../../middlewares/allowedTo.js";


export const enrollmentRouter = Router();

enrollmentRouter.use(protectRoute);

enrollmentRouter.get('/', allowedTo('admin'), enrollmentController.getAllEnrollments);
enrollmentRouter.post('/', allowedTo('admin'), enrollmentController.addNewEnroll);
enrollmentRouter.delete('/:id', allowedTo('admin'), enrollmentController.deleteEnroll);
enrollmentRouter.put('/:id', allowedTo('admin'), enrollmentController.updateEnroll);