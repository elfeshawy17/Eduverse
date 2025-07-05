import joi from 'joi';

export const submissionValidationSchema = joi.object({
    student: joi.string().required().messages({
        'string.empty': 'Student ID is required.',
        'any.required': 'Student ID is required.'
    }),
    assignment: joi.string().required().messages({
        'string.empty': 'Assignment ID is required.',
        'any.required': 'Assignment ID is required.'
    }),
    fileUrl: joi.string().uri().messages({
        'string.uri': 'File URL must be a valid URI.'
    }),
    status: joi.string().valid('pending', 'submitted').default('pending').messages({
        'any.only': 'Status must be either "pending" or "submitted".'
    }),
    submittedAt: joi.date().default(Date.now)
});