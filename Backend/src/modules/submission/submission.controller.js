import { Assignment } from "../../../data/models/assignment.js";
import { Submission } from "../../../data/models/submission.js";
import AppError from "../../../utils/AppError.js";
import HttpText from "../../../utils/HttpText.js";
import asyncErrorHandler from "../../middlewares/asyncErrorHandler.js";


const addSubmission = asyncErrorHandler(
    async (req, res, next) => {
        // First check if the assignment exists
        const assignment = await Assignment.findById(req.params.assignmentId);
        if (!assignment) {
            const error = AppError.create('Assignment not found.', 404, HttpText.FAIL);
            return next(error);
        }

        // check if the student has already submitted
        const existingSubmission = await Submission.findOne({ assignment: assignment._id, student: req.user._id });
        if (existingSubmission) {
            const error = AppError.create('You have already submitted for this assignment.', 400, HttpText.FAIL);
            return next(error);
        }

        // Check if the deadline has passed
        if (assignment.duedate < Date.now()) {
            const error = AppError.create('Deadline has passed.', 400, HttpText.FAIL);
            return next(error);
        }

        const fileUrl = req.file.path;
        const submission = new Submission({
            student: req.user._id,
            assignment: req.params.assignmentId,  // Use the assignment ID directly
            fileUrl,
            status: 'submitted'
        });

        await submission.save();

        res.status(201).json({
            status: HttpText.SUCCESS,
            data: { submission }
        });
    }
);

const getAllSubmissions = asyncErrorHandler(
    async (req, res, next) => {

        const assignment = await Assignment.findById(req.params.assignmentId);

        if(!assignment){
            const error = AppError.create('This assignment is not found.', 404, HttpText.FAIL);
            return next(error);
        }

        const pageNumber = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 4;
        const skip = (parseInt(pageNumber - 1)) * limit;

        const submissions = await Submission.find({ assignment: assignment._id }).populate('student', 'name email').skip(skip).limit(limit);

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: {submissions}
        });

    }
);

const getSubmission = asyncErrorHandler(
    async (req, res, next) => {

        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            const error = AppError.create('This submission is not found.', 404, HttpText.FAIL);
            return next(error);
        }

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: {submission}
        });

    }
);

const getSubmissionStatus = asyncErrorHandler(
    async (req, res, next) => {
        
        const assignment = await Assignment.findById(req.params.assignmentId);

        if (!assignment) {
            const error = AppError.create('This assignment is not found.', 404, HttpText.FAIL);
            return next(error);
        }

        const submission = await Submission.findOne({ student: req.user._id, assignment: req.params.assignmentId });

        if (!submission && assignment.duedate > Date.now()) {
            return res.status(200).json({
                status: HttpText.SUCCESS,
                data: { status: 'pending' }
            });
        }

        if (!submission) {
            return res.status(200).json({
                status: HttpText.SUCCESS,
                data: { status: 'missed' }
            });
        }

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: {
                id: submission._id,
                status: submission.status
            }
        });

    }
);

const updateSubmission = asyncErrorHandler(
    async (req, res, next) => {

        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            const error = AppError.create('This submission is not found.', 404, HttpText.FAIL);
            return next(error);
        }

        if (submission.student._id.toString() !== req.user._id.toString()) {
            const error = AppError.create('You do not have permission to view this submission.', 403, HttpText.FAIL);
            return next(error);
        }

        if (submission.assignment.duedate < Date.now()) {
            const error = AppError.create('Deadline has passed.', 400, HttpText.FAIL);
            return next(error);
        }

        const updatedSubmission = await Submission.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: updatedSubmission
        });

    }
);

const deleteSubmission = asyncErrorHandler(
    async (req, res, next) => {

        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            const error = AppError.create('This submission is not found.', 404, HttpText.FAIL);
            return next(error);
        }

        const deletedSubmission = await Submission.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: null
        });

    }
);

const gradeSubmission = asyncErrorHandler(
    async (req, res, next) => {

        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            const error = AppError.create('This submission is not found.', 404, HttpText.FAIL);
            return next(error);
        }

        const updatedSubmission = await Submission.findByIdAndUpdate(req.params.id, {
            maxGrade: req.body.maxGrade,
            grade: req.body.grade
        }, {
            new: true,
        }
        );

        res .status(200).json({
            status: HttpText.SUCCESS,
            data: updatedSubmission
        });
    }
);

const getGrade = asyncErrorHandler(
    async (req, res, next) => {

        const grade = await Submission.findById(req.params.id).select('grade maxGrade');
        
        if (!grade) {
            res.status(200).json({
                status: HttpText.SUCCESS,
                data: null
            });
        }

        res.status(200).json({
            status: HttpText.SUCCESS,
            data: grade
        });
    }
);

export default {
    addSubmission,
    getAllSubmissions,
    getSubmission,
    updateSubmission,
    deleteSubmission,
    getSubmissionStatus,
    gradeSubmission,
    getGrade
}