import { Request, Response, NextFunction } from "express";
import { UploadService } from "../services/uploadService";
import { AuthenticatedRequest } from "../middleware/auth";

export class UploadController {
  uploadImage = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Upload request received:", {
        hasFile: !!req.file,
        user: req.user?.id,
        fileInfo: req.file
          ? {
              originalname: req.file.originalname,
              mimetype: req.file.mimetype,
              size: req.file.size,
            }
          : null,
      });

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No image file provided",
        });
      }

      // Validate file type
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          error: "File must be an image",
        });
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        return res.status(400).json({
          success: false,
          error: "Image size must be less than 5MB",
        });
      }

      const userId = parseInt(req.user!.id);
      const imageUrl = await UploadService.uploadImage(req.file, userId);

      res.status(200).json({
        success: true,
        data: {
          url: imageUrl,
          filename: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
