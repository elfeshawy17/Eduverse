import { User } from './../../../data/models/user.model.js';
import AppError from '../../../utils/AppError.js';
import HttpText from '../../../utils/HttpText.js';
import asyncErrorHandler from '../../middlewares/asyncErrorHandler.js';
import { Course } from '../../../data/models/course.js';


const addUser = asyncErrorHandler(
    async (req, res, next) => {

        const user = new User(req.body);
        await user.save();

        if (user.role === 'admin'){
            if (user.department !== 'IT') {
                user.department = 'IT';
            }
        }

        res.status(201).json({
            status: HttpText.SUCCESS,
            data: {user}
        })

    }
);

const getAllUsers = asyncErrorHandler(
    async (req, res, next) => {

        const pageNumber = req.query.page *1 || 1;
        if (pageNumber < 1) pageNumber = 1;
        const limit = req.query.limit || 4;
        const skip = parseInt(pageNumber -1) * limit;

        const users = await User.find().limit(limit).skip(skip);

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: {users}
        })

    }
);

const getAllAdmins = asyncErrorHandler(
    async (req, res, next) => {

        const admins = await User.find({role: 'admin'});

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: {admins}
        })
    }
);

const getAllProfessors = asyncErrorHandler(
    async (req, res, next) => {

        const professors = await User.find({role: 'professor'});

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: {professors}
        })
    }
);

const getAllStudents = asyncErrorHandler(
    async (req, res, next) => {

        const students = await User.find({role: 'student'});    

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: {students}
        })
    }
);

const getSpecificUser = asyncErrorHandler(
    async (req, res, next) => {

        const user = await User.findById(req.params.id);

        if (!user) {
            const error = AppError.create('User is not found', 404, HttpText.FAIL);
            return next(error); 
        }

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: {user}
        });

    }
);

const updateUser = asyncErrorHandler(
    async (req, res, next) => {

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});

        if (!user) {
            const error = AppError.create('User is not found', 404, HttpText.FAIL);
            return next(error); 
        }

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: {user}
        });

    }
);

const deleteUser = asyncErrorHandler(
    async (req, res, next) => {

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            const error = AppError.create('User is not found', 404, HttpText.FAIL);
            return next(error); 
        }

        res.status(200).json({
            status: HttpText.SUCCESS,
        });

    }
);

const getProfile = asyncErrorHandler(
    async (req, res, next) => {

    const user = await User.findById(req.user.id).select('name email academicId department level role');
    if (!user) {
        const error = AppError.create('User is not found', 404, HttpText.FAIL);
        return next(error);
    }

    const profileData = {
        name: user.name,
        email: user.email,
        dept: user.department,
    };

    if (user.role === 'student') {
        profileData.id = user.academicId;
        profileData.level = user.level;
    }

    res.status(200).json({
        status: HttpText.SUCCESS,
        data: profileData
    });
});

const getUserCourses = asyncErrorHandler(
    async (req, res, next) => {

    const user = await User.findById(req.user.id).populate('courses', 'title professor hours');

    res.status(200).json({
        status: HttpText.SUCCESS,
        data: user.courses
    });
});

const getStates = asyncErrorHandler(
    async (req, res, next) => {

        const studentsCount = await User.countDocuments({ role: "student" });
        const professorsCount = await User.countDocuments({ role: "professor" });
        const adminsCount = await User.countDocuments({ role: "admin" });

        res.status(200).json({
            studentsCount,
            professorsCount,
            adminsCount
    });

});

export default {
    addUser,
    getAllUsers,
    getAllAdmins,
    getAllProfessors,
    getAllStudents,
    getSpecificUser,
    updateUser,
    deleteUser,
    getProfile,
    getUserCourses,
    getStates
}