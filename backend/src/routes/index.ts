import { Router } from "express";
import authRoutes from "./auth";
import contextRoutes from "./contexts";
import attributeRoutes from "./attributes";
import contextAttributeRoutes from "./contextAttributes";
import identityRequestRoutes from "./identityRequests";
import userRoutes from "./users";
import uploadRoutes from "./upload";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Mount route modules
router.use("/auth", authRoutes);
router.use("/contexts", contextRoutes);
router.use("/attributes", attributeRoutes);
router.use("/", contextAttributeRoutes); // Privacy matrix and context-attribute routes
router.use("/identity-requests", identityRequestRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);

export default router;
