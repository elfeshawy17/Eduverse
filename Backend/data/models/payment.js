import { model, Schema } from "mongoose";

const paymentSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        required: true,
    },
    term: {
        type: Number, 
        required: true,
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    }],
    totalHours: {
        type: Number,
        required: true,
    },
    hourRate: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false
});

paymentSchema.index({ student: 1, level: 1, term: 1 }, { unique: true });

export const Payment = model("Payment", paymentSchema);