import type { Request, Response } from "express";
import { authService, AuthService } from "./auth.service";
import {
  signupSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  refreshSchema,
} from "./validator";
import { UnauthorizedError } from "../../core/errors";

export class AuthController {
  constructor(private readonly auth: AuthService = authService) {}

  signup = async (req: Request, res: Response) => {
    const input = signupSchema.parse(req.body);
    const result = await this.auth.signup(input);
    res.status(201).json(result);
  };

  login = async (req: Request, res: Response) => {
    const input = loginSchema.parse(req.body);
    const result = await this.auth.login(input);
    res.json(result);
  };

  logout = async (_req: Request, res: Response) => {
    const result = await this.auth.logout();
    res.json(result);
  };

  forgetPassword = async (req: Request, res: Response) => {
    const { email } = forgetPasswordSchema.parse(req.body);
    const result = await this.auth.forgetPassword(email);
    res.json(result);
  };

  resetPassword = async (req: Request, res: Response) => {
    const input = resetPasswordSchema.parse(req.body);
    const result = await this.auth.resetPassword(input);
    res.json(result);
  };

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = refreshSchema.parse(req.body);
    const result = await this.auth.refresh(refreshToken);
    res.json(result);
  };

  // GET /auth/me — protected by requireAuth, which sets req.userId.
  me = async (req: Request, res: Response) => {
    if (!req.userId) throw new UnauthorizedError("Not authenticated");
    const user = await this.auth.getMe(Number(req.userId));
    res.json(user);
  };
}

export const authController = new AuthController();
export default authController;
