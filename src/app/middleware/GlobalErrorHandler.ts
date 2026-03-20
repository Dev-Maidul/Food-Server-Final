import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { handleZodError } from "./handleZodError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong!";
  let errors: any = null;

  /* -------------------- ZOD VALIDATION ERROR -------------------- */
  if (err instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation failed";
    errors = handleZodError(err);
  } else {
    /* -------------------- CUSTOM / GENERIC ERROR -------------------- */
    statusCode = err.statusCode || statusCode;
    message = err.message || message;
    errors = err.errors || null;
  }

  res.status(statusCode).json({
    success: false,
    // statusCode,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default globalErrorHandler;
