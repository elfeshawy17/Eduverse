import AppError from "../../utils/AppError.js";
import HttpText from "../../utils/HttpText.js";

export const validateFile = (req, res, next) => {

  if (!req.file) {
    const error = AppError.create('Please upload file.', 400, HttpText.FAIL)
    return next(error);
  }

  if (req.file.mimetype !== "application/pdf") {
    const error = AppError.create('This file is not pdf.', 400, HttpText.FAIL)
    return next(error);
  }

  next();
};
