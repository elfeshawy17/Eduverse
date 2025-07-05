import AppError from "../../../utils/AppError.js";
import HttpText from "../../../utils/HttpText.js";
import asyncErrorHandler from "../../middlewares/asyncErrorHandler.js"
import { User } from './../../../data/models/user.model.js';
import { Config } from './../../../data/models/paymentConfig.js';
import { Payment } from "../../../data/models/payment.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createStripeSession = asyncErrorHandler(
    async (req, res, next) => {
        const paymentConfig = await Config.findOne();
        if (!paymentConfig) {
            const error = AppError.create('Payment configuration not found.', 500, HttpText.FAIL);
            return next(error);
        }

        const { hourRate, term } = paymentConfig;

        const student = await User.findById(req.user.id).populate('courses');
        if (!student) {
            const error = AppError.create('Student not found.', 404, HttpText.FAIL);
            return next(error);
        }

        const studentLevel = student.level;

        const amount = student.courses.reduce((acc, course) => acc + course.hours * hourRate, 0);

        // Create or update payment record before creating Stripe session
        const paymentRecord = await Payment.findOneAndUpdate(
            { student: student._id, level: studentLevel, term },
            {
                student: student._id,
                level: studentLevel,
                term,
                courses: student.courses.map(course => course._id),
                totalHours: student.courses.reduce((acc, course) => acc + course.hours, 0),
                hourRate: hourRate,
                totalAmount: amount,
                isPaid: false
            },
            { upsert: true, new: true }
        );

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Payment for level ${studentLevel} term ${term}`,
                    },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/eduverse/student/payment-success`,
            cancel_url: `${process.env.CLIENT_URL}/eduverse/student/payment-failure`,
            customer_email: student.email,
            client_reference_id: student._id.toString(),
            metadata: {
                paymentId: paymentRecord._id.toString(),
                studentId: student._id.toString(),
                level: studentLevel.toString(),
                term: term.toString()
            }
        });

        res.status(200).json({
            success: HttpText.SUCCESS,
            data: session
        });
    }
);

const handleStripeWebhook = asyncErrorHandler(
    async (req, res, next) => {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log('Payment completed for session:', session.id);
                
                // Update payment record as paid
                const paymentId = session.metadata.paymentId;
                const updatedPayment = await Payment.findByIdAndUpdate(
                    paymentId,
                    { 
                        isPaid: true,
                        orderId: session.payment_intent,
                        totalAmount: session.amount_total / 100
                    },
                    { new: true }
                );

                if (updatedPayment) {
                    console.log('Payment record updated successfully:', updatedPayment._id);
                } else {
                    console.error('Payment record not found for ID:', paymentId);
                }
                break;

            case 'checkout.session.expired':
                const expiredSession = event.data.object;
                console.log('Payment session expired:', expiredSession.id);
                // You can add logic here to handle expired sessions
                // For example, send email to student to retry payment
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                console.log('Payment failed:', failedPayment.id);
                // You can add logic here to handle failed payments
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        res.json({ received: true });
    }
);

const getStudentPayment = asyncErrorHandler(
    async (req, res, next) => {
        const student = await User.findById(req.user.id);
        if (!student) {
            const error = AppError.create('Student not found.', 404, HttpText.FAIL);
            return next(error);
        }

        const studentLevel = student.level;
        
        const paymentConfig = await Config.findOne();
        if (!paymentConfig) {
            const error = AppError.create('Payment configuration not found.', 500, HttpText.FAIL);
            return next(error);
        }

        const term = paymentConfig.term;

        const studentPayment = await Payment.findOne({ student: student._id, term, level: studentLevel });

        if (!studentPayment || studentPayment.isPaid == false) {
            return res.status(200).json({
                status: HttpText.SUCCESS,
                data: null,
                message: 'No payment record found for this term and level.'
            });
        }

        return res.status(200).json({
            status: HttpText.SUCCESS,
            data: studentPayment,
        });
    }
);

const searchStudentPayment = asyncErrorHandler(
    async (req, res, next) => {
        const { name, term, level } = req.query;

        const student = await User.findOne({ name: name.toLowerCase(), role: 'student' });
        if (!student) {
            const error = AppError.create('Student not found.', 404, HttpText.FAIL);
            return next(error);
        }

        const studentId = student._id;

        const paymentRecord = await Payment.findOne({ student: studentId, term, level }).populate('student courses');

        if (!paymentRecord || paymentRecord.isPaid == false) {
            return res.status(200).json({
                status: HttpText.SUCCESS,
                data: null,
                message: 'No payment record found for this term and level.'
            });
        }

        return res.status(200).json({
            status: HttpText.SUCCESS,
            data: paymentRecord,
        });
    }
);

export default {
    getStudentPayment,
    createStripeSession,
    handleStripeWebhook,
    searchStudentPayment,
}
