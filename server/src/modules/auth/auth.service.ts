import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { userService, UserService, type SafeUser } from "../users/user.service";
import type { User } from "../users/user.schema";
import type { SignupInput, LoginInput, ResetPasswordInput } from "./validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../core/errors";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev_access_secret_change_me";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? "dev_refresh_secret_change_me";
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";
const SALT_ROUNDS = 10;

export type { SafeUser };

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// AuthResult matches DummyJSON login response shape:
// top-level user fields + accessToken + refreshToken.
export interface AuthResult extends SafeUser, AuthTokens {}

export interface AccessTokenPayload {
  // userId stored as number string to match serial integer PKs.
  userId: string;
  role: string;
}

export class AuthService {
  private resetTokens = new Map<string, number>();

  constructor(private readonly users: UserService = userService) {}

  private signAccessToken(userId: number, role: string): string {
    return jwt.sign({ sub: String(userId), role }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL,
    });
  }

  private signRefreshToken(userId: number): string {
    return jwt.sign({ sub: String(userId) }, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_TTL,
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      role?: string;
    };
    return {
      userId: payload.sub as string,
      role: payload.role ?? "customer",
    };
  }

  async signup(data: SignupInput): Promise<AuthResult> {
    const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
    const created: User = await this.users.createUser({
      username: data.username,
      email: data.email.toLowerCase(),
      password: hashed,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role ?? "customer",
      image: data.image,
      phone: data.phone,
    });

    const safe = this.users.stripPassword(created);
    return {
      ...safe,
      accessToken: this.signAccessToken(created.id, created.role),
      refreshToken: this.signRefreshToken(created.id),
    };
  }

  async login(data: LoginInput): Promise<AuthResult> {
    // DummyJSON login uses username, not email.
    const user = await this.users.findByUsername(data.username);
    if (!user) throw new UnauthorizedError("Invalid username or password");

    const matches = await bcrypt.compare(data.password, user.password);
    if (!matches) throw new UnauthorizedError("Invalid username or password");

    const safe = this.users.stripPassword(user);
    return {
      ...safe,
      accessToken: this.signAccessToken(user.id, user.role),
      refreshToken: this.signRefreshToken(user.id),
    };
  }

  async logout(): Promise<{ message: string }> {
    return { message: "Logged out successfully" };
  }

  async getMe(userId: number): Promise<SafeUser> {
    return this.users.getUserById(userId);
  }

  async forgetPassword(
    email: string,
  ): Promise<{ message: string; resetToken?: string }> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      return { message: "If that email exists, a reset link has been sent." };
    }
    const resetToken =
      Math.random().toString(36).slice(2) + Date.now().toString(36);
    this.resetTokens.set(resetToken, user.id);
    return { message: "Reset token generated (mock).", resetToken };
  }

  async resetPassword(data: ResetPasswordInput): Promise<{ message: string }> {
    const userId = this.resetTokens.get(data.token);
    if (!userId) throw new BadRequestError("Invalid or expired reset token");

    const hashed = await bcrypt.hash(data.newPassword, SALT_ROUNDS);
    try {
      await this.users.updatePassword(userId, hashed);
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw err;
    }

    this.resetTokens.delete(data.token);
    return { message: "Password reset successfully" };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET,
      ) as JwtPayload;
      const userId = Number(payload.sub);
      const user = await this.users.findById(userId);
      if (!user) throw new UnauthorizedError("User no longer exists");
      return { accessToken: this.signAccessToken(user.id, user.role) };
    } catch (err) {
      if (err instanceof UnauthorizedError) throw err;
      throw new UnauthorizedError("Invalid or expired refresh token");
    }
  }
}

export const authService = new AuthService();
export default authService;
