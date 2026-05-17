import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { ForbiddenError, UnauthorizedError } from "../../core/errors";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      // userId stored as string (JWT sub), convert to number when needed.
      userId?: string;
      userRole?: string;
    }
  }
}

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(
      new UnauthorizedError("Missing or malformed Authorization header"),
    );
  }
  const token = header.slice("Bearer ".length);
  try {
    const { userId, role } = authService.verifyAccessToken(token);
    req.userId = userId;
    req.userRole = role;
    next();
  } catch {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};

export const requireRole =
  (...allowed: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.userId || !req.userRole) {
      return next(new UnauthorizedError("Not authenticated"));
    }
    if (!allowed.includes(req.userRole)) {
      return next(new ForbiddenError("Insufficient permissions"));
    }
    next();
  };
