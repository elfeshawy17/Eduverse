import Joi from "joi";


const assignmentValidationSchema = Joi.object({
    title: Joi.string().trim().min(3).max(100).required()
        .messages({
            "string.empty": "Title is required",
            "string.min": "Title must be at least 3 characters",
            "string.max": "Title must not exceed 100 characters",
            "any.required": "Title is required"
        }),

    fileUrl: Joi.string().uri().optional()
        .messages({
            "string.uri": "File URL must be a valid URL"
        }),

    duedate: Joi.date().iso().required()
        .messages({
            "date.base": "Due date must be a valid date",
            "date.format": "Due date must be in ISO format",
            "any.required": "Due date is required"
        }),

    submissions: Joi.array().items(
        Joi.object({
            student: Joi.string().required()
                .messages({
                    "any.required": "Student ID is required",
                    "string.base": "Student must be a valid ObjectId"
                }),

            fileUrl: Joi.string().uri().optional()
                .messages({
                    "string.uri": "File URL must be a valid URL"
                }),

                submittedAt: Joi.date().iso().default(() => new Date())
        })
    ).optional()
});


export default assignmentValidationSchema 
