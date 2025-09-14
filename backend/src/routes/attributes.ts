import { Router } from "express";
import attributeController from "../controllers/attributeController";
import {
  validateRequest,
  createAttributeSchema,
  updateAttributeSchema,
} from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// All attribute routes require authentication
router.use(authenticateToken);

// GET /api/attributes - Get all attributes for authenticated user
router.get("/", attributeController.getAttributes);

// POST /api/attributes - Create new attribute
router.post(
  "/",
  validateRequest(createAttributeSchema),
  attributeController.createAttribute
);

// GET /api/attributes/type/:type - Get attributes by type
router.get("/type/:type", attributeController.getAttributesByType);

// GET /api/attributes/:id - Get specific attribute
router.get("/:id", attributeController.getAttribute);

// PUT /api/attributes/:id - Update attribute
router.put(
  "/:id",
  validateRequest(updateAttributeSchema),
  attributeController.updateAttribute
);

// DELETE /api/attributes/:id - Delete attribute
router.delete("/:id", attributeController.deleteAttribute);

export default router;
