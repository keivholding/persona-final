import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { UserService } from "../services/userService";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Search for a user by ID and return their basic info + contexts (no attributes)
   */
  async searchUserById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const userIdNumber = parseInt(userId, 10);

      // Get user with their contexts (no attributes for privacy)
      const userWithContexts = await this.userService.findUserWithContexts(
        userIdNumber
      );

      if (!userWithContexts) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: userWithContexts,
        },
      });
    } catch (error) {
      console.error("Error searching user:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
