import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError, ValidationError } from "./custom-errors";
import { ErrorCode } from "./error-codes";

const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const ve = new ValidationError("Validation failed", err.issues);
    return res.status(ve.httpCode).json({
      error: {
        code: ve.code,
        message: ve.message,
        details: ve.details,
        requestId: null,
        ...(process.env.NODE_ENV !== "production" && { debug: err.stack }),
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.httpCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? null,
        requestId: null,
        ...(process.env.NODE_ENV !== "production" && { debug: err.stack }),
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    error: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
      details: null,
      requestId: null,
      ...(process.env.NODE_ENV !== "production" && {
        debug: err instanceof Error ? err.stack : String(err),
      }),
    },
  });
};

export default errorMiddleware;
