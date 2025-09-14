import { Router } from "express";
import contextController from "../controllers/contextController";
import {
  validateRequest,
  createContextSchema,
  updateContextSchema,
} from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/contexts - Get all contexts for user
router.get("/", contextController.getContexts);

// POST /api/contexts - Create new context
router.post(
  "/",
  validateRequest(createContextSchema),
  contextController.createContext
);

// GET /api/contexts/:id - Get specific context
router.get("/:id", contextController.getContext);

// PUT /api/contexts/:id - Update context
router.put(
  "/:id",
  validateRequest(updateContextSchema),
  contextController.updateContext
);

// DELETE /api/contexts/:id - Delete context
router.delete("/:id", contextController.deleteContext);

export default router;
