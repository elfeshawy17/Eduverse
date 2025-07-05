import { Router } from "express";
import { protectRoute } from './../../middlewares/protectRoute.js';
import { allowedTo } from './../../middlewares/allowedTo.js';
import paymentConfigController from "./paymentConfig.controller.js";

const paymentConfigRouter = Router();

paymentConfigRouter.use(protectRoute);

paymentConfigRouter.post('/', allowedTo('admin'), paymentConfigController.setConfig);

paymentConfigRouter.get('/', allowedTo('admin'), paymentConfigController.getConfig);

export default paymentConfigRouter;