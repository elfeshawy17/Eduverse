import { Course } from "../../../data/models/course.js"
import asyncErrorHandler from "../../middlewares/asyncErrorHandler.js"
import AppError from "../../../utils/AppError.js"
import HttpText from "../../../utils/HttpText.js"
import { User } from "../../../data/models/user.model.js";

export const addCourse = asyncErrorHandler(async(req,res,next)=>{

    const { title, courseCode, department, hours } = req.body;
    const professorName = req.body.professor;
    const normalizedProfName = professorName.trim().toLowerCase();

    // validate course exist
    const exists = await Course.findOne({title})
    if(exists){
        const error = AppError.create("Course already exist",400,HttpText.FAIL)
        return next(error)
    }

    // Validate professor
    const profUser = await User.findOne({ name: normalizedProfName });
    if (!profUser || profUser.role !== 'professor') {
        return next(AppError.create('Invalid professor name or role', 400, HttpText.FAIL));
    }

    const course = new Course({
        title,
        courseCode,
        professor: profUser._id,
        department,
        hours,
        lecture: [],
        assignment: []
    });
    await course.save();

    res.status(201).json({
        status: HttpText.SUCCESS,
        data: { course }
    });
});

export const getAllCourses = asyncErrorHandler(async(req,res,next)=>{

    let pageNumber =req.query.page *1 || 1
    if(pageNumber<1)pageNumber=1
    let limit = 4
    const skip =(parseInt(pageNumber-1))*limit

    let courses = await Course.find().skip(skip).limit(limit).populate('professor', 'name');

    res.status(201).json({
        status:HttpText.SUCCESS,
        data: { courses }
    })
});

export const getProfessorCourses = asyncErrorHandler(async(req, res, next) => {

    let pageNumber =req.query.page *1 || 1
    if(pageNumber<1)pageNumber=1
    let limit = 4
    const skip =(parseInt(pageNumber-1))*limit

    const courses = await Course.find({ professor: req.user.id })
        .populate('lecture', 'title')
        .populate('assignment', 'title')
        .skip(skip).limit(limit)

    res.status(200).json({
        status: HttpText.SUCCESS,
        data: courses
    });
});

export const getSpecificCourse = asyncErrorHandler(
    async (req, res, next) => {

        const course = await Course.findById(req.params.id).populate('assignment', 'title fileUrl duedate').populate('lecture', 'title fileUrl');
        if (!course) {
            const error = AppError.create('Course is not found.', 404, HttpText.FAIL);
            next(error);
        }

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: {course}
        });

    }
);

export const updateCourse = asyncErrorHandler(async(req,res,next)=>{
    let course =await Course.findById(req.params.id)


    if(!course){
        const error=AppError.create("course doesnt exist",400,HttpText.FAIL)
        return next(error)
    }


    let Updated =await Course.findByIdAndUpdate(req.params.id,req.body,{new:true})

    res.status(201).json({status:HttpText.SUCCESS,data:Updated})
});

export const deleteCourse = asyncErrorHandler(async(req,res,next)=>{

    let course =await Course.findByIdAndDelete(req.params.id)

    if(!course){
        const error=AppError.create("course doesnt exist",400,HttpText.FAIL)
        return next(error)
    }

    res.status(201).json({status:HttpText.SUCCESS,data:course})
});

export const getProfessorCoursesCount = asyncErrorHandler(async(req,res,next)=>{
    const count = await Course.countDocuments({professor:req.user.id})
    res.status(200).json({status:HttpText.SUCCESS,data:count})
});
