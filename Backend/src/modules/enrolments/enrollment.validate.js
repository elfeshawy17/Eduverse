import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid course ID format");
    }
    return value;
};

const enrollmentValidationSchema = Joi.object({
    studentName: Joi.string().trim().min(3).max(100).required()
        .messages({
            "string.base": "Student name must be a string",
            "string.empty": "Student name is required",
            "string.min": "Student name must be at least 3 characters",
            "string.max": "Student name must not exceed 100 characters",
            "any.required": "Student name is required"
        }),

    academicId: Joi.string().trim().required()
        .messages({
            "string.base": "Academic ID must be a string",
            "string.empty": "Academic ID is required",
            "any.required": "Academic ID is required"
        }),

    courses: Joi.array().items(
        Joi.string().custom(objectIdValidator).required()
    ).min(1).required()
        .messages({
            "array.base": "Courses must be an array",
            "array.min": "At least one course is required",
            "any.required": "Courses field is required"
        })
});

export default enrollmentValidationSchema;
