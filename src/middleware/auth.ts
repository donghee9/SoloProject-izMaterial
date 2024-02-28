import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/userSchema";
import { CustomError } from "./error";

interface User {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

interface Customer {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      customer: Customer;
    }
  }
}

interface Admin {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      admin: Admin;
    }
  }
}

export const forCompanyValidateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new CustomError("TOKEN_NOT_FOUND", 401);
    }

    const secretJwtKey = process.env.SECRET_JWT_KEY;
    if (!secretJwtKey) {
      throw new CustomError("SECRET_KEY_NOT_FOUND", 500);
    }

    const payload = jwt.verify(accessToken, secretJwtKey) as JwtPayload;

    if (!payload.id || !payload.email || !payload.iat) {
      throw new CustomError("INVALID_PAYLOAD", 401);
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const tokenExpirationTimestamp = currentTimestamp + Number(process.env.JWT_EXPIRES_IN_FOR_COMPANY);

    if (currentTimestamp > tokenExpirationTimestamp) {
      throw new CustomError("TOKEN_EXPIRED", 401);
    }

    req.user = { id: payload.id };
    next();
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError("INTERNAL_SERVER_ERROR", 500));
    }
  }
};

export const forCustomerValidateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new CustomError("TOKEN_NOT_FOUND", 401);
    }

    const secretJwtKey = process.env.SECRET_JWT_KEY_COMPANY;
    if (!secretJwtKey) {
      throw new CustomError("SECRET_KEY_NOT_FOUND", 500);
    }

    const payload = jwt.verify(accessToken, secretJwtKey) as JwtPayload;
    console.log(payload);

    if (!payload.id || !payload.email || !payload.iat) {
      throw new CustomError("INVALID_PAYLOAD", 401);
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const tokenExpirationTimestamp = currentTimestamp + Number(process.env.JWT_EXPIRES_IN_FOR_CUSTOMER);

    if (currentTimestamp > tokenExpirationTimestamp) {
      throw new CustomError("TOKEN_EXPIRED", 401);
    }

    req.customer = { id: payload.id };
    next();
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError("INTERNAL_SERVER_ERROR", 500));
    }
  }
};

export const forAdminValidateTokenLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminLoginToken = req.headers.authorization;

    if (!adminLoginToken) {
      throw new CustomError("TOKEN_NOT_FOUND", 401);
    }

    const secretJwtKey = process.env.SECRET_JWT_KEY_ADMIN;
    if (!secretJwtKey) {
      throw new CustomError("SECRET_KEY_NOT_FOUND", 500);
    }
    const payload = jwt.verify(adminLoginToken, secretJwtKey) as JwtPayload;

    if (!payload.id || !payload.iat) {
      throw new CustomError("INVALID_PAYLOAD", 401);
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const tokenExpirationTimestamp = currentTimestamp + Number(process.env.JWT_EXPIRES_IN_FOR_ADMIN_LOGIN);

    if (currentTimestamp > tokenExpirationTimestamp) {
      throw new CustomError("TOKEN_EXPIRED", 401);
    }

    req.admin = { id: payload.id };
    next();
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError("INTERNAL_SERVER_ERROR", 500));
    }
  }
};

export const forAdminValidateTokenAllProcess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new CustomError("TOKEN_NOT_FOUND", 401);
    }

    const secretJwtKey = process.env.SECRET_JWT_KEY_ADMIN;
    if (!secretJwtKey) {
      throw new CustomError("SECRET_KEY_NOT_FOUND", 500);
    }

    const payload = jwt.verify(accessToken, secretJwtKey) as JwtPayload;

    if (!payload.id || !payload.iat) {
      throw new CustomError("INVALID_PAYLOAD", 401);
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const tokenExpirationTimestamp = currentTimestamp + Number(process.env.JWT_EXPIRES_IN_FOR_ADMIN_ALL_PROCESS);

    if (currentTimestamp > tokenExpirationTimestamp) {
      throw new CustomError("TOKEN_EXPIRED", 401);
    }

    req.admin = { id: payload.id };
    next();
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError("INTERNAL_SERVER_ERROR", 500));
    }
  }
};
