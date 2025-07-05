import Joi from "joi";

const lectureValidationSchema = Joi.object({
    course: Joi.string()
        .messages({
            "any.required": "Course ID is required",
            "string.base": "Course must be a valid ObjectId"
        }),

    title: Joi.string().trim().min(3).max(100).required()
        .messages({
            "string.empty": "Title is required",
            "string.min": "Title must be at least 3 characters",
            "string.max": "Title must not exceed 100 characters",
            "any.required": "Title is required"
        }),

    fileUrl: Joi.string()
        .messages({
            "string.uri": "File URL must be a valid URL",
            "any.required": "File URL is required"
        }),

    order: Joi.number().integer().min(1).required()
        .messages({
            "number.base": "Order must be a number",
            "number.integer": "Order must be an integer",
            "number.min": "Order must be at least 1",
            "any.required": "Order is required"
        })
});

export default lectureValidationSchema 
