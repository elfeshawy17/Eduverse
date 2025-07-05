import { Course } from "../../../data/models/course.js";
import { Lecture } from "../../../data/models/lecture.js";
import AppError from "../../../utils/AppError.js";
import HttpText from "../../../utils/HttpText.js";
import asyncErrorHandler from "../../middlewares/asyncErrorHandler.js";


export const addLecture = asyncErrorHandler(async(req,res,next)=>{

    const course = await Course.findById(req.params.courseId);
    if(!course) {
        const error=AppError.create("Course is not found.",404,HttpText.FAIL)
        return next(error);
    }

    const fileUrl = req.file.path;
    let lecture = new Lecture({
        ...req.body,
        course,
        fileUrl
    });
    await lecture.save();

    const updatedCourse = await Course.updateOne(
        { _id: req.params.courseId },
        { $push: { lecture: lecture._id } }
    );

    if (updatedCourse.modifiedCount === 0) {
        const error = AppError.create('Failed to add lecture to this course.', 500, HttpText.FAIL);
        return next(error);
    }

    res.status(201).json({status:HttpText.SUCCESS,data:lecture});
})

export const getAllLecture = asyncErrorHandler(async(req,res,next)=>{

    const course = await Course.findById(req.params.courseId);
    if(!course) {
        const error=AppError.create("Course is not found.",404,HttpText.FAIL)
        return next(error);
    }

    const pageNumber = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 4;
    const skip = (parseInt(pageNumber - 1)) * limit;

    const lectures = await Lecture.find({course:course._id}).populate('course', 'name').limit(limit).skip(skip);
    const total = await Lecture.countDocuments({course:course._id});

    res.status(200).json({status:HttpText.SUCCESS,data:{lectures, total}});
});

export const getSpecificLecture = asyncErrorHandler(
    async (req, res, next) => {

        const lecture = await Lecture.findById(req.params.id);

        if (!lecture) {
            const error = AppError.create('Lecture is not found.', 404, HttpText.FAIL);
            next(error);
        }

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: {lecture}
        });

    }
)

export const updateLecture = asyncErrorHandler(async(req, res, next) => {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
        const error = AppError.create('Lecture is not found.', 404, HttpText.FAIL);
        return next(error);
    }

    // Only update title
    if (req.body.title) {
        lecture.title = req.body.title;
    } else {
        const error = AppError.create('Title is required for update.', 400, HttpText.FAIL);
        return next(error);
    }

    await lecture.save();

    res.status(200).json({
        status: HttpText.SUCCESS,
        data: lecture
    });
});

export const deleteLecture =asyncErrorHandler(async(req,res,next)=>{

    let lecture = await Lecture.findByIdAndDelete(req.params.id)

    if(!lecture){
        const error=AppError.create("Lecture doesnt exist",400,HttpText.FAIL)
        return next(error)
    }

    res.status(200).json({status:HttpText.SUCCESS,data:lecture})
})