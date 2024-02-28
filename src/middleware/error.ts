import { Request, Response, NextFunction } from "express";

export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const catchAsync = (func: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((error: Error) => next(error));
  };
};
export const globalErrorHandler = (err: Error | CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 400;
  const errorMessage = err instanceof CustomError ? err.message : "internal server error";

  if (res.headersSent) {
    return next(err);
  }
  res.status(statusCode).json({ error: errorMessage });
};

export default errorHandler;
