import { User } from './../../data/models/user.model.js';
import jwt from 'jsonwebtoken';
import AppError from "../../utils/AppError.js";
import HttpText from "../../utils/HttpText.js";

export const protectRoute = async (req, res, next) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        const error = AppError.create("Access denied. No token provided.", 400, HttpText.FAIL);
        return next(error);
    }

    let userPayload = null;

    try{
        userPayload = jwt.verify(token, process.env.JWT_SECRET);
    } catch(err) {
        const error = AppError.create("Invalid token.", 400, HttpText.FAIL);
        return next(error);
    }

    const user = await User.findById(userPayload.userId);
    if (!user) {
        const error = AppError.create("User is not found.", 401, HttpText.FAIL);
        return next(error);
    }

    if (user.passwordChangedAt) {
        const time = parseInt(user.passwordChangedAt.getTime() /1000);
        if (time > userPayload.iat) {
            const error = AppError.create("Password was changed. Please log in again.", 401, HttpText.FAIL);
            return next(error);
        }
    }

    req.user = user;
    next();

}