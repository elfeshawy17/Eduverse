import Joi from "joi";

const configValidationSchema = Joi.object({
    hourRate: Joi.number().integer().min(1).required()
        .messages({
            "number.base": "Hour rate must be a number",
            "number.integer": "Hour rate must be an integer",
            "number.min": "Hour rate must be at least 1",
            "any.required": "Hour rate is required"
        }),

    term: Joi.number().integer().required()
        .messages({
            "any.only": "Term must be either 'first' or 'second'",
            "any.required": "Term is required"
        })
});

export default configValidationSchema;