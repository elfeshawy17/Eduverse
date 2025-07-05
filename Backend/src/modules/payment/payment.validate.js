import Joi from 'joi';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const paymentValidationSchema = Joi.object({
    student: objectId.required()
        .messages({
            "string.pattern.base": "Student ID must be a valid ObjectId",
            "any.required": "Student ID is required"
        }),

    level: Joi.number().valid(0, 1, 2, 3, 4, 5).required()
        .messages({
            "number.base": "Level must be a number",
            "any.only": "Level must be one of 0 to 5",
            "any.required": "Level is required"
        }),

        term: Joi.number().integer().required()
        .messages({
            "any.only": "Term must be either 'first' or 'second'",
            "any.required": "Term is required"
        }),

    courses: Joi.array().items(
        objectId.required().messages({
            "string.pattern.base": "Each course ID must be a valid ObjectId",
            "any.required": "Course ID is required"
        })
    ).min(1).required()
        .messages({
            "array.base": "Courses must be an array of ObjectIds",
            "array.min": "At least one course must be selected",
            "any.required": "Courses are required"
        }),

    totalHours: Joi.number().positive().required()
        .messages({
            "number.base": "Total hours must be a number",
            "number.positive": "Total hours must be greater than zero",
            "any.required": "Total hours are required"
        }),

    hourRate: Joi.number().positive().required()
        .messages({
            "number.base": "Hour rate must be a number",
            "number.positive": "Hour rate must be greater than zero",
            "any.required": "Hour rate is required"
        }),

    totalAmount: Joi.number().positive().required()
        .messages({
            "number.base": "Total amount must be a number",
            "number.positive": "Total amount must be greater than zero",
            "any.required": "Total amount is required"
        }),

    isPaid: Joi.boolean().default(false)
        .messages({
            "boolean.base": "isPaid must be true or false"
        })
});

export default paymentValidationSchema;