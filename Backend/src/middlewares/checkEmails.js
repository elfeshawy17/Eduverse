import { User } from './../../data/models/user.model.js';
import AppError from '../../utils/AppError.js';
import HttpText from '../../utils/HttpText.js';

export const checkEmail = async (req, res, next) => {
    const {email} = req.body;
    const exist = await User.findOne({email});

    if (exist) {
        const error = AppError.create('Email Is Already Exist', 400, HttpText.FAIL);
        return next(error);
    }

    next();
}
