import { Router } from "express";
import { identityRequestController } from "../controllers/identityRequestController";
import { authenticateToken } from "../middleware/auth";
import { validateRequest } from "../middleware/validation";
import Joi from "joi";

const router = Router();

// Validation schemas
const createRequestSchema = Joi.object({
  requestee_user_id: Joi.number().integer().positive().required(),
  context_id: Joi.number().integer().positive().required(),
  purpose: Joi.string().max(1000).optional(),
});

const respondToRequestSchema = Joi.object({
  status: Joi.string().valid("approved", "denied").required(),
  response_message: Joi.string().max(500).optional(),
});

// All routes require authentication
router.use(authenticateToken);

// POST /api/identity-requests - Create a new request
router.post(
  "/",
  validateRequest(createRequestSchema),
  identityRequestController.createRequest.bind(identityRequestController)
);

// GET /api/identity-requests/received - Get requests received by the user
router.get(
  "/received",
  identityRequestController.getReceivedRequests.bind(identityRequestController)
);

// GET /api/identity-requests/sent - Get requests sent by the user
router.get(
  "/sent",
  identityRequestController.getSentRequests.bind(identityRequestController)
);

// GET /api/identity-requests/pending/count - Get count of pending requests
router.get(
  "/pending/count",
  identityRequestController.getPendingCount.bind(identityRequestController)
);

// GET /api/identity-requests/:id - Get a specific request
router.get(
  "/:id",
  identityRequestController.getRequest.bind(identityRequestController)
);

// PUT /api/identity-requests/:id/respond - Respond to a request (approve/deny)
router.put(
  "/:id/respond",
  validateRequest(respondToRequestSchema),
  identityRequestController.respondToRequest.bind(identityRequestController)
);

// PUT /api/identity-requests/:id/revoke - Revoke an approved request
router.put(
  "/:id/revoke",
  identityRequestController.revokeRequest.bind(identityRequestController)
);

// DELETE /api/identity-requests/:id - Delete a request
router.delete(
  "/:id",
  identityRequestController.deleteRequest.bind(identityRequestController)
);

export default router;
