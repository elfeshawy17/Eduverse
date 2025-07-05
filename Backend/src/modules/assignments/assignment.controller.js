import { Assignment } from "../../../data/models/assignment.js"
import { Course } from "../../../data/models/course.js";
import AppError from "../../../utils/AppError.js"
import HttpText from "../../../utils/HttpText.js"
import asyncErrorHandler from "../../middlewares/asyncErrorHandler.js"



export const addAssignment = asyncErrorHandler(

    async(req,res,next)=>{

        const course = await Course.findById(req.params.courseId);
        if(!course) {
            const error = AppError.create("Course is not found.",404,HttpText.FAIL)
            return next(error);
        }

        const fileUrl = req.file.path; 

        let assignment = new Assignment({
            ...req.body,
            course,
            fileUrl
        })
        await assignment.save()

        const updatedCourse = await Course.updateOne(
            { _id: req.params.courseId },
            { $push: {assignment: assignment._id } }
        );

        if (updatedCourse.modifiedCount === 0) {
            const error = AppError.create('Failed to add assignment to this course.', 500, HttpText.FAIL);
            return next(error);
        }

        res.status(201).json({status:HttpText.SUCCESS,data:assignment});
});

export const getAllAssignment = asyncErrorHandler(
    async(req,res,next)=>{

    const course = await Course.findById(req.params.courseId);
        if(!course) {
        const error=AppError.create("Course is not found.",404,HttpText.FAIL)
        return next(error);
        }

    const pageNumber = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 4;
    const skip = (parseInt(pageNumber - 1)) * limit;

    const assignments = await Assignment.find({course:course._id}).limit(limit).skip(skip);

    res.status(200).json({status:HttpText.SUCCESS,data:assignments});
})

export const getSpecificAssignment = asyncErrorHandler(
    async (req, res, next) => {

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            const error = AppError.create('Assignment is not found.', 404, HttpText.FAIL);
            next(error);
        }

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: {assignment}
        });

    }
)

export const updateAssignment = asyncErrorHandler(async(req, res, next) => {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
        const error = AppError.create("Assignment doesn't exist", 400, HttpText.FAIL);
        return next(error);
    }

    // Only update title and dueDate
    if (req.body.title) {
        assignment.title = req.body.title;
    }
    if (req.body.duedate) {
        assignment.duedate = req.body.duedate;
    }

    // Validate that at least one field is being updated
    if (!req.body.title && !req.body.duedate) {
        const error = AppError.create("At least one field (title or dueDate) is required for update", 400, HttpText.FAIL);
        return next(error);
    }

    await assignment.save();

    res.status(200).json({
        status: HttpText.SUCCESS,
        data: assignment
    });
});

export const deleteAssignment =asyncErrorHandler(async(req,res,next)=>{

    let assignment =await Assignment.findByIdAndDelete(req.params.id)

    if(!assignment){
        const error=AppError.create("Assignment doesnt exist",400,HttpText.FAIL)
        return next(error)
    }

    res.status(201).json({status:HttpText.SUCCESS,data:assignment})
})