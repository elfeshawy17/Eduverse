import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "pdf_uploads",
        upload_preset: "pdf_public_upload",
        resource_type: "auto",
        format: async (req, file) => "pdf", 
        public_id: (req, file) => {
            const title = req.body.title;
            if (title) {
                return title;
            } else {
                // Use user ID + assignment ID + timestamp for unique identification
                const timestamp = Date.now();
                const userId = req.user?._id || 'unknown';
                const assignmentId = req.params?.assignmentId || 'unknown';
                return `submission_${userId}_${assignmentId}_${timestamp}`;
            }
        }
    }
});

export const upload = multer({ storage });