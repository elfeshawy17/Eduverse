import AppError from "../../utils/AppError.js";
import HttpText from "../../utils/HttpText.js";

export const allowedTo = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            const error = AppError.create('You do not have permission to perform this action.', 403, HttpText.FAIL);
            return next(error);
        }

        next();

    }

}