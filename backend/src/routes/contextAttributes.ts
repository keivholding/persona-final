import { Router } from "express";
import contextAttributeController from "../controllers/contextAttributeController";
import {
  validateRequest,
  assignAttributeToContextSchema,
} from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/privacy-matrix - Get the privacy matrix
router.get("/privacy-matrix", contextAttributeController.getPrivacyMatrix);

// POST /api/context-attributes - Assign attribute to context
router.post(
  "/context-attributes",
  validateRequest(assignAttributeToContextSchema),
  contextAttributeController.assignAttributeToContext
);

// DELETE /api/context-attributes/:contextId/:attributeId - Remove attribute from context
router.delete(
  "/context-attributes/:contextId/:attributeId",
  contextAttributeController.removeAttributeFromContext
);

// GET /api/contexts/:contextId/attributes - Get attributes for a context
router.get(
  "/contexts/:contextId/attributes",
  contextAttributeController.getAttributesForContext
);

// GET /api/attributes/:attributeId/contexts - Get contexts for an attribute
router.get(
  "/attributes/:attributeId/contexts",
  contextAttributeController.getContextsForAttribute
);

export default router;
