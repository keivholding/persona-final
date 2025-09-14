import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { UserController } from "../controllers/userController";

const router = Router();
const userController = new UserController();

// Search user by ID and get their contexts
router.get(
  "/search/:userId",
  authenticateToken,
  userController.searchUserById.bind(userController)
);

export default router;
