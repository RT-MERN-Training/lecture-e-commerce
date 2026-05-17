import { ErrorCode } from "./error-codes";

export type AppErrorContent = string;

export enum HttpCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export abstract class AppError extends Error {
  public readonly httpCode: HttpCode;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;
  public readonly details: unknown;

  constructor({
    name,
    httpCode,
    description,
    code = ErrorCode.INTERNAL_SERVER_ERROR,
    isOperational = true,
    details = null,
  }: {
    name?: string;
    httpCode: HttpCode;
    description: string;
    code?: ErrorCode;
    isOperational?: boolean;
    details?: unknown;
  }) {
    super(description);
    this.name = name ?? new.target.name;
    this.httpCode = httpCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this);
    }
  }
}

export class BadRequestError extends AppError {
  constructor(message?: string, code?: ErrorCode, details?: unknown) {
    super({
      httpCode: HttpCode.BAD_REQUEST,
      description: message ?? "Bad request",
      code: code ?? ErrorCode.BAD_REQUEST,
      details,
    });
  }
}

export class ConflictError extends AppError {
  constructor(message?: string, code?: ErrorCode) {
    super({
      httpCode: HttpCode.CONFLICT,
      description: message ?? "Conflict",
      code: code ?? ErrorCode.CONFLICT,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message?: string, code?: ErrorCode) {
    super({
      httpCode: HttpCode.UNAUTHORIZED,
      description: message ?? "Unauthorized",
      code: code ?? ErrorCode.UNAUTHORIZED,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(message?: string, code?: ErrorCode) {
    super({
      httpCode: HttpCode.FORBIDDEN,
      description: message ?? "Forbidden",
      code: code ?? ErrorCode.FORBIDDEN,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(message?: string, code?: ErrorCode) {
    super({
      httpCode: HttpCode.NOT_FOUND,
      description: message ?? "Not found",
      code: code ?? ErrorCode.RESOURCE_NOT_FOUND,
    });
  }
}

export class ValidationError extends AppError {
  constructor(message?: string, details?: unknown) {
    super({
      httpCode: HttpCode.BAD_REQUEST,
      description: message ?? "Validation failed",
      code: ErrorCode.VALIDATION_ERROR,
      details,
    });
  }
}
