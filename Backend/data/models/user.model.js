import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(value);
            },
            message: 'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.'
        }
    },
    department: {
        type: String,
        required: true,
        enum: ['Communication Engineering', 'Control Engineering', 'Computer Science', 'Biomedical Engineering', 'Networking', 'Automation', 'Cybersecurity', 'IT'],
        trim: true
    },
    role: {
        type: String,
        enum: ['student', 'professor', 'admin'],
        default: 'student'
    },
    level: {
        type: Number,
        enum: [0, 1, 2, 3, 4],
        required: false,
        validate: {
            validator: function(value) {
                return this.role === 'student' ? (value !== undefined && value !== null) : true;
            },
            message: 'Level is required for students only.'
        }
    },
    academicId: {
        type: String,
        unique: true,
        required: false,
        validate: {
            validator: function(value) {
                return this.role === 'student' ? (value !== undefined && value !== null) : true;
            },
            message: 'Academic ID is required for students only.'
        },
        trim: true
    },
    passwordChangedAt: Date,
    courses: [{
        type: Schema.Types.ObjectId,
        ref: "Course",
        validate: {
        validator: function() {
            return this.role === 'student';
        },
        message: "Only students can have courses"
        }
    }]
}, {
    timestamps: true,
    versionKey: false
});


userSchema.pre('save', function(){
    this.password = bcrypt.hashSync(this.password, 8);
});

userSchema.pre('findOneAndUpdate', async function(next) {
    if (this._update.password) {
        this._update.password = bcrypt.hashSync(this._update.password, 8);
    }
    if (this._update.level !== undefined) {
        const role = this._update.role || this.getQuery().role;
        if (role === 'student' && (this._update.level === undefined || this._update.level === null)) {
            return next(new Error('Level is required for students.'));
        }
        if (role !== 'student' && this._update.level !== undefined) {
            delete this._update.level;
        }
    }
    if (this._update.academicId !== undefined) {
        const role = this._update.role || this.getQuery().role;
        if (role === 'student' && (this._update.academicId === undefined || this._update.academicId === null)) {
            return next(new Error('Academic ID is required for students.'));
        }
        if (role !== 'student' && this._update.academicId !== undefined) {
            delete this._update.academicId;
        }
    }
    if (this._update.department && !['Communication Engineering', 'Control Engineering', 'Computer Science', 'Medical Engineering', 'Networking', 'Automation', 'Cybersecurity'].includes(this._update.department)) {
        return next(new Error('Department must be one of: Communication Engineering, Control Engineering, Computer Science, Medical Engineering, Networking, Automation, Cybersecurity'));
    }
    next();
});

userSchema.pre('find', function(next) {
    this.populate('courses', 'title professor hours');
    next();
});

export const User = mongoose.model('User', userSchema);