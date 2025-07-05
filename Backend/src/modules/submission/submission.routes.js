import { Router } from "express";
import { protectRoute } from "../../middlewares/protectRoute.js";
import { allowedTo } from "../../middlewares/allowedTo.js";
import submissionController from "./submission.controller.js";
import { validateFile } from "../../middlewares/validatePDF.js";
import { upload } from "../../middlewares/upload.js";


export const submissionRouter = Router();

submissionRouter.use(protectRoute);

submissionRouter.route('/:assignmentId')
                .post(allowedTo('student'), upload.single('fileUrl'), validateFile, submissionController.addSubmission)

submissionRouter.get("/:assignmentId", allowedTo('professor'), submissionController.getAllSubmissions)

submissionRouter.get("/:assignmentId/status", allowedTo('student'), submissionController.getSubmissionStatus)

submissionRouter.route('/:id')
                .get(allowedTo('student', 'professor'), submissionController.getSubmission)
                .put(allowedTo('student'), submissionController.updateSubmission)
                .delete(allowedTo('professor', 'student'), submissionController.deleteSubmission)

submissionRouter.post("/grade/:id", allowedTo('professor'), submissionController.gradeSubmission)

submissionRouter.get("/grade/:id", allowedTo('professor', 'student'), submissionController.getGrade)