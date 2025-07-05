import AppError from "../../utils/AppError.js";
import HttpText from "../../utils/HttpText.js";


export const validate = (schema) => {

    return (req, res, next) => {

        const {err} = schema.validate({...req.body, ...req.params, ...req.query}, {abortEarly: false});
        if (!err) {
            next();
        } else {
            let errorMessage = err.details.map( (err) => {
                return err.message;
            });
            const error = AppError.create(errorMessage, 400, HttpText.FAIL);
            return next(error);
        }

    }

}