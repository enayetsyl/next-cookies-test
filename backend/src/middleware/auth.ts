import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type AuthedRequest = Request & { user?: { sub: string; email: string; role: string } };

export function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = { sub: decoded.sub, email: decoded.email, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
