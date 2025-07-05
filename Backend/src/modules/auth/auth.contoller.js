import { User } from './../../../data/models/user.model.js';
import AppError from '../../../utils/AppError.js';
import HttpText from '../../../utils/HttpText.js';
import asyncErrorHandler from '../../middlewares/asyncErrorHandler.js';
import { generateJwt } from '../../../utils/generateJwt.js';
import bcrypt from 'bcrypt';


const register = asyncErrorHandler(
    async (req, res, next) => {

        const user = new User(req.body);
        await user.save();

        const token = generateJwt({userId: user._id, role: user.role});

        res.status(201).json({
            status: HttpText.SUCCESS,
            data: {user, token}
        });

    }
);

const login = asyncErrorHandler(
    async (req, res, next) => {

        const user = await User.findOne({email: req.body.email});

        if (user && bcrypt.compareSync(req.body.password, user.password)){
            const token = generateJwt({userId: user._id, role: user.role});
            return res.status(200).json({
                status: HttpText.SUCCESS,
                data: {user, token}
            });
        }

        const error = AppError.create('Invalid email or password', 400, HttpText.FAIL);
        next(error);

    }
);

const changePassword = asyncErrorHandler(
    async (req, res, next) => {

        const user = await User.findOne({email: req.body.email});

        if (user && bcrypt.compareSync(req.body.password, user.password)) {

            const {password, newPassword} = req.body;

            if (password == newPassword) {
                const error = AppError.create('New password cannot be the same as the old password.', 400, HttpText.FAIL);
                return next(error);
            }

            const user = await User.findOneAndUpdate(
                {email: req.body.email},
                {password: req.body.newPassword, passwordChangedAt: Date.now()},
                {new: true}
            );

            const token = generateJwt({userId: user._id, role: user.role});
            return res.status(200).json({
                status: HttpText.SUCCESS,
                data: {user, token}
            });

        }

        const error = AppError.create('Invalid Email or Password', 400, HttpText.FAIL);
        next(error);

    }
);


export default {
    register,
    login,
    changePassword
}