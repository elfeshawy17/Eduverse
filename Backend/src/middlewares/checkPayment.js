import { Payment } from "../../data/models/payment.js";
import { User } from "../../data/models/user.model.js";
import AppError from "../../utils/AppError.js";
import HttpText from "../../utils/HttpText.js";


const checkPayment = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('payment');

        // Allow admin and professor to get course
        if (user.role !== 'student') {
            next();
        }

        // Check if user exists and is a student
        if (!user) {
            return next(AppError.create('Student not found', 404, HttpText.FAIL));
        }

        // Check if payment record exists
        if (!user.payment) {
            return next(AppError.create('No payment record found', 404, HttpText.FAIL));
        }

        // Check if payment is completed
        if (!user.payment.hasPaid) {
            return next(AppError.create(`Please pay ${user.payment.totalFee} EGP to access your courses`, 403, HttpText.FAIL));
        }

        next();
    } catch (error) {
        return next(AppError.create(error.message, 500, HttpText.ERROR));
    }
};

export default checkPayment;