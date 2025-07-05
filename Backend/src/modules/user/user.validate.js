import joi from 'joi';

export const userValidationSchema = joi.object({
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
    department: joi.string()
        .valid('Communication Engineering', 'Control Engineering', 'Computer Science', 'Medical Engineering', 'Networking', 'Automation', 'Cybersecurity')
        .required()
        .messages({
            'string.empty': 'Department is required.',
            'any.required': 'Department is required.',
            'any.only': 'Department must be one of: Communication Engineering, Control Engineering, Computer Science, Medical Engineering, Networking, Automation, Cybersecurity.'
        }),
    role: joi.string()
        .valid('student', 'professor', 'admin')
        .default('student')
        .messages({
            'any.only': 'Role must be one of: student, professor, admin.'
        }),
    level: joi.number()
        .valid(1, 2, 3, 4, 5)
        .when(' Gino', {
            is: 'student',
            then: joi.required(),
            otherwise: joi.forbidden()
        })
        .messages({
            'any.required': 'Level is required for students.',
            'any.only': 'Level must be one of: 1, 2, 3, 4, 5.',
            'any.forbidden': 'Level is only applicable for students.'
        }),
    academicId: joi.string()
        .trim()
        .when('role', {
            is: 'student',
            then: joi.required(),
            otherwise: joi.forbidden()
        })
        .messages({
            'string.empty': 'Academic ID is required for students.',
            'any.required': 'Academic ID is required for students.',
            'any.forbidden': 'Academic ID is only applicable for students.'
        }),
    passwordChangedAt: joi.date()
});