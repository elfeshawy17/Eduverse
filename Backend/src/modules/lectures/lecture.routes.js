import { Router } from "express";
import { addLecture, deleteLecture, getAllLecture, getSpecificLecture, updateLecture } from "./lecture.controller.js";
import { protectRoute } from "../../middlewares/protectRoute.js";
import { allowedTo } from "../../middlewares/allowedTo.js";
import lectureValidationSchema  from "./lecture.validate.js";
import { createValidator } from "express-joi-validation";
import { upload } from "../../middlewares/upload.js";
import { validateFile } from './../../middlewares/validatePDF.js';

const lectureRouter = Router();
const validator = createValidator(); 

lectureRouter.use(protectRoute);

lectureRouter.get("/:courseId", allowedTo('professor', 'student'), getAllLecture);
lectureRouter.post("/:courseId", allowedTo('professor'), upload.single('fileUrl'), validateFile, validator.body(lectureValidationSchema), addLecture);
lectureRouter.get("/:id", allowedTo('professor', 'student'), getSpecificLecture);
lectureRouter.put("/:id", allowedTo('professor'),  updateLecture);
lectureRouter.delete("/:id", allowedTo('professor'),  deleteLecture);

export default lectureRouter;