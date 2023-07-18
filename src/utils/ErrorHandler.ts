import { NextFunction, Request, Response } from "express";
import { CustomError } from "./CustomError";

export class ErrorHandler {
  static handleError(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({
        status: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      status: false,
      message: error.message,
    })
  }
}
