import type { Request, Response } from "express";
import { userService, UserService } from "./user.service";
import { updateUserSchema, userIdParamSchema, updatePreferencesSchema } from "./validator";
import { ForbiddenError, UnauthorizedError } from "../../core/errors";

export class UserController {
  constructor(private readonly users: UserService = userService) {}

  private requireSelfOrAdmin(req: Request, targetId: number) {
    if (!req.userId || !req.userRole) {
      throw new UnauthorizedError("Not authenticated");
    }
    if (req.userRole !== "admin" && Number(req.userId) !== targetId) {
      throw new ForbiddenError("Insufficient permissions");
    }
  }

  list = async (req: Request, res: Response) => {
    if (!req.userId || !req.userRole) {
      throw new UnauthorizedError("Not authenticated");
    }
    if (req.userRole !== "admin") {
      throw new ForbiddenError("Admin access required");
    }
    const result = await this.users.listUsers();
    res.json(result);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = userIdParamSchema.parse(req.params);
    this.requireSelfOrAdmin(req, id);
    const user = await this.users.getUserById(id);
    res.json(user);
  };

  update = async (req: Request, res: Response) => {
    const { id } = userIdParamSchema.parse(req.params);
    this.requireSelfOrAdmin(req, id);
    const input = updateUserSchema.parse(req.body);
    const updated = await this.users.updateUser(id, input);
    res.json(updated);
  };

  updatePreferences = async (req: Request, res: Response) => {
    const { id } = userIdParamSchema.parse(req.params);
    this.requireSelfOrAdmin(req, id);
    const preferences = updatePreferencesSchema.parse(req.body);
    const updated = await this.users.updateUserPreferences(id, preferences);
    res.json(updated);
  };
}

export const userController = new UserController();
export default userController;
