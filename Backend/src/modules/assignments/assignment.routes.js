import { Router } from "express";
import { addAssignment, deleteAssignment, getAllAssignment, getSpecificAssignment, updateAssignment } from "./assignment.controller.js";
import { protectRoute } from "../../middlewares/protectRoute.js";
import { allowedTo } from "../../middlewares/allowedTo.js";
import { createValidator } from "express-joi-validation";
import assignmentValidationSchema from "./assignment.validate.js";
import { validateFile } from "../../middlewares/validatePDF.js";
import { upload } from "../../middlewares/upload.js";

const assignmentRouter = Router();
const validator = createValidator(); 

assignmentRouter.use(protectRoute); 

assignmentRouter.get("/:courseId", allowedTo('professor', 'student'), getAllAssignment);
assignmentRouter.post("/:courseId", allowedTo('professor'), upload.single('fileUrl'), validateFile, validator.body(assignmentValidationSchema), addAssignment);
assignmentRouter.get('/:id', allowedTo('professor', 'student'), getSpecificAssignment);
assignmentRouter.put("/:id", allowedTo('professor'), updateAssignment);
assignmentRouter.delete("/:id", allowedTo('professor'), deleteAssignment);


export default assignmentRouter;