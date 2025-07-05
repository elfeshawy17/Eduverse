import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    student: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    fileUrl: String,
    status: {
        type: String,
        enum: ['pending', 'submitted', 'missed'],
        default: 'pending'
    },
    maxGrade: {
        type: Number,
        min: 0,
        max: 100
    },
    grade: {
        type: Number,
        min: 0,
        max: 100
    },
    submittedAt: { 
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
});

// submissionSchema.pre(/^find/, function(){
//     this.populate('assignment', 'title duedate');
//     this.populate('student', 'name email');
// });

export const Submission = mongoose.model('Submission', submissionSchema);