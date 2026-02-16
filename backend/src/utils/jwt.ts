import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

export interface DecodedToken {
  userId: string;
  role: string;
}

export const generateToken = (userId: string, role: string = 'client'): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('🔑 JWT Decoded:', { userId: decoded.userId, role: decoded.role });
    return decoded.userId ? { userId: decoded.userId, role: decoded.role || 'client' } : null;
  } catch (error) {
    console.log('❌ JWT Verification Error:', (error as any).message);
    return null;
  }
};

export const extractToken = (authHeader: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
