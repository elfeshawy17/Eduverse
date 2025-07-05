import joi from 'joi';

export const authValidationSchema = joi.object({
    name: joi.string().trim().required().messages({
        'string.empty': 'Name is required.',
        'any.required': 'Name is required.'
    }),
    email: joi.string().trim().email().required().lowercase().messages({
        'string.empty': 'Email is required.',
        'string.email': 'Email must be a valid email address.',
        'any.required': 'Email is required.'
    }),
    password: joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 8 characters long.',
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
            'any.required': 'Password is required.'
        }),
    department: joi.string().required().messages({
        'string.empty': 'Department is required.',
        'any.required': 'Department is required.'
    }),
    role: joi.string().valid('student', 'professor', 'admin').default('student').messages({
        'any.only': 'Role must be one of: student, professor, admin.'
    }),
    passwordChangedAt: joi.date(),
    courses: joi.array().items(joi.string())
});