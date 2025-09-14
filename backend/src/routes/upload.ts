import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { uploadSingle } from "../middleware/upload";
import { UploadController } from "../controllers/uploadController";

const router = Router();
const uploadController = new UploadController();

// Upload single image
router.post(
  "/image",
  authenticateToken,
  uploadSingle,
  uploadController.uploadImage
);

export default router;
