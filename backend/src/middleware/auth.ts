import { Request, Response, NextFunction } from 'express';
import { extractToken, verifyToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization || '';
  console.log(`🔐 Auth Middleware [${req.method} ${req.url}] - Authorization header:`, authHeader ? 'Present' : 'Missing');
  const token = extractToken(authHeader);

  if (!token) {
    console.log(`❌ Auth Middleware [${req.method} ${req.url}] - No token extracted from header`);
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  console.log(`✓ Auth Middleware [${req.method} ${req.url}] - Token extracted, verifying...`);
  const decoded = verifyToken(token);
  if (!decoded) {
    console.log(`❌ Auth Middleware [${req.method} ${req.url}] - Token verification failed`);
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  console.log(`✓ Auth Middleware [${req.method} ${req.url}] - Token valid, userId: ${decoded.userId}, role: ${decoded.role}`);
  req.userId = decoded.userId;
  req.userRole = decoded.role;
  next();
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    console.log(`👤 Role Check [${req.method} ${req.url}] - userId: ${req.userId}, userRole: ${req.userRole}, required: ${roles.join(',')}`);
    if (!req.userId) {
      console.log(`❌ Role Check [${req.method} ${req.url}] - No userId found`);
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (!req.userRole || !roles.includes(req.userRole)) {
      console.log(`❌ Role Check [${req.method} ${req.url}] - User role "${req.userRole}" not in required ${roles.join(',')}`);
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    console.log(`✓ Role Check [${req.method} ${req.url}] - User authorized`);
    next();
  };
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    res.status(400).json({ error: 'Validation error', details: err.message });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
};
