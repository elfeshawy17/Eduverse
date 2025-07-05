import { model, Schema } from "mongoose";

const enrollmentSchema = new Schema({
    studentName:{ 
        type: String,
        required: true,
        trim: true 
    },
    academicId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    courses:[{
        type: String,
        required: true
    }]
},{
    timestamps:true,
    versionKey:false
});

export const Enrollment = model("Enrollment", enrollmentSchema);