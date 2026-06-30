import { Request, Response, NextFunction } from 'express';

// Extend Request interface to hold user context
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'customer' | 'admin' | 'driver';
    email: string;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    // In production, verify token with jwt.verify
    // For local development stub / test mode, simulate success:
    req.user = {
      id: 'mock-user-uuid',
      role: 'customer',
      email: 'customer@example.com'
    };
    next();
  } else {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Access token is missing or invalid'
      }
    });
  }
};

export const requireRole = (roles: Array<'customer' | 'admin' | 'driver'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource'
        }
      });
    }
  };
};
