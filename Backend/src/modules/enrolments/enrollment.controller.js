import { Course } from "../../../data/models/course.js";
import { Enrollment } from "../../../data/models/enrollment.js";
import { User } from "../../../data/models/user.model.js";
import AppError from "../../../utils/AppError.js";
import HttpText from "../../../utils/HttpText.js";
import asyncErrorHandler from "../../middlewares/asyncErrorHandler.js";


const getAllEnrollments = asyncErrorHandler(
    async (req, res, next) => {

    let pageNumber = req.query.page * 1 || 1;
    if(pageNumber<1)pageNumber = 1;
    let limit = 4;
    const skip = (parseInt(pageNumber-1)) * limit;

    const enrollments = await Enrollment.find().limit(limit).skip(skip);

    res.status(200).json({
            status:HttpText.SUCCESS,
            data: { enrollments }
    });
});

const addNewEnroll = asyncErrorHandler(
    async (req, res, next) => {

        const { academicId, courses } = req.body;

        if (typeof courses === 'string') {
            courses = courses
                .split(',')
                .map(code => code.trim()) 
                .filter(code => code.length > 0); 
        }
        req.body.courses = courses;

        const coursesInDB = await Course.find({ courseCode: { $in: courses } });

        if (coursesInDB.length !== courses.length) {
            const error = AppError.create("There is invalid course code.", 400, HttpText.FAIL)
            return next(error);
        }

        const courseIds = coursesInDB.map(course => course._id);

        const updatedStudent = await User.updateOne(
            { academicId }, 
            { $addToSet: { courses: { $each: courseIds } } } 
        );

        if (updatedStudent.modifiedCount === 0) {
            const error = AppError.create('Failed to enroll courses', 500, HttpText.FAIL);
            return next(error);
        }

        const updatedStudentData = await User.findOne({ academicId }).select('name courses');

        const newEnroll = new Enrollment({
            studentName: updatedStudentData.name,
            academicId,
            courses
        });
        await newEnroll.save();

        res.status(201).json({
            status: HttpText.SUCCESS,
            data: newEnroll
        });

});

const deleteEnroll = asyncErrorHandler(
    async (req, res, next) => {

        const enrollment = await Enrollment.findById(req.params.id);
        if (!enrollment) {
            const error = AppError.create("This enrollment does not exist.", 404, HttpText.FAIL)
            return next(error);
        }

        await User.updateOne(
            { academicId: enrollment.academicId },
            { $set: { courses: [] } } 
        );

        await Enrollment.deleteOne(enrollment);

        res.status(200).json({
            status: HttpText.SUCCESS,
        });
});

const updateEnroll = asyncErrorHandler(
    async (req, res, next) => {

        const { academicId, courses } = req.body;

        const enrollment = await Enrollment.findOneAndUpdate(
            { academicId },
            { $set: { courses } },
            { new: true }
        );

        if (!enrollment) {
            const error = AppError.create("This enrollment does not exist.", 404, HttpText.FAIL)
            return next(error);
        }

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: enrollment
        });
    }
);

export default {
    getAllEnrollments,
    addNewEnroll,
    deleteEnroll,
    updateEnroll
}