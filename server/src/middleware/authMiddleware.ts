import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('--- DEBUG START ---');
  console.log('RAW AUTH HEADER:', req.headers.authorization);
  console.log('EXTRACTED TOKEN:', token);
  console.log('JWT_SECRET IN MIDDLEWARE:', process.env.JWT_SECRET);

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
         console.log('JWT VERIFY ERROR:', error);
  console.log('--- DEBUG END ---');
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires role: ${roles.join(' or ')}`,
      });
    }
    next();
  };
};