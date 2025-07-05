import { Router } from "express";
import { checkEmail } from './../../middlewares/checkEmails.js';
import userController from "./user.controller.js";
import { protectRoute } from './../../middlewares/protectRoute.js';
import { allowedTo } from "../../middlewares/allowedTo.js";
import { validate } from './../../middlewares/validate.js';
import { userValidationSchema } from "./user.validate.js";
import checkPayment from "../../middlewares/checkPayment.js";


export const userRouter = Router();

userRouter.use(protectRoute);

userRouter.route('/')
            .post(checkEmail, allowedTo('admin'), validate(userValidationSchema), userController.addUser)
            .get(allowedTo('admin'), userController.getAllUsers)

userRouter.get('/admins', allowedTo('admin'), userController.getAllAdmins);

userRouter.get('/professors', allowedTo('admin'), userController.getAllProfessors);

userRouter.get('/students', allowedTo('admin'), userController.getAllStudents);

userRouter.get('/me', allowedTo('student', 'professor', 'admin'), userController.getProfile);

userRouter.get('/courses', allowedTo('student'), userController.getUserCourses);

userRouter.get('/states', allowedTo('admin'), userController.getStates);

userRouter.get('/:id', checkEmail, allowedTo('admin'), userController.getSpecificUser);

userRouter.route('/:id')
            .put(allowedTo('admin'), userController.updateUser)
            .delete(allowedTo('admin'), userController.deleteUser)
