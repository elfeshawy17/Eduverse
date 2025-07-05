import { Router } from "express";
import { checkEmail } from './../../middlewares/checkEmails.js';
import authContoller from "./auth.contoller.js";
import { validate } from "../../middlewares/validate.js";
import { authValidationSchema } from "./auth.validate.js";

export const authRouter = Router();

authRouter.post('/register', checkEmail, validate(authValidationSchema), authContoller.register);

authRouter.post('/login', authContoller.login);

authRouter.post('/changePassword', authContoller.changePassword);