import Joi from "joi";

const courseValidationSchema = Joi.object({
    courseCode: Joi.string().trim().alphanum().min(2).max(10).required()
        .messages({
            "string.base": "Course code must be a string",
            "string.empty": "Course code is required",
            "string.alphanum": "Course code must contain only letters and numbers",
            "string.min": "Course code must be at least 2 characters",
            "string.max": "Course code must not exceed 10 characters",
            "any.required": "Course code is required"
        }),

    title: Joi.string().trim().min(3).max(100).required()
        .messages({
            "string.empty": "Title is required",
            "string.min": "Title must be at least 3 characters",
            "string.max": "Title must not exceed 100 characters",
            "any.required": "Title is required"
        }),

    professor: Joi.string().required()
        .messages({
            "any.required": "Professor ID is required",
            "string.base": "Professor must be a valid ObjectId"
        }),

    department: Joi.string().trim().min(2).max(50).required()
        .messages({
            "string.empty": "Department is required",
            "string.min": "Department name must be at least 2 characters",
            "string.max": "Department name must not exceed 50 characters",
            "any.required": "Department is required"
        }),

    hours: Joi.number().integer().min(1).max(6).required()
        .messages({
            "number.base": "Hours must be a number",
            "number.integer": "Hours must be an integer",
            "number.min": "Hours must be at least 1",
            "number.max": "Hours must not exceed 10",
            "any.required": "Hours is required"
        }),

    lecture: Joi.array().items(Joi.string()).optional()
        .messages({
            "array.base": "Lecture must be an array of ObjectIds",
            "string.base": "Each lecture ID must be a valid ObjectId"
        }),

    students: Joi.array().items(Joi.string()).optional()
        .messages({
            "array.base": "Students must be an array of ObjectIds",
            "string.base": "Each student ID must be a valid ObjectId"
        }),

    assignment: Joi.array().items(Joi.string()).optional()
        .messages({
            "array.base": "Assignments must be an array of ObjectIds",
            "string.base": "Each assignment ID must be a valid ObjectId"
        })
});

export default courseValidationSchema;
