import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokenHandler.js';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string | number;
        role: string;
    };
}

export const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    let token = '';

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1] as string;
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            message: 'Authentication required. Access token is missing.',
        });
    }

    try {
        const decoded: any = verifyToken(token);
        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };
        next();
    } catch (error: any) {
        return res
            .status(401)
            .json({ message: 'Invalid or expired access token' });
    }
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                data: {
                    success: false,
                    message: 'Authentication required.',
                },
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                data: {
                    message: 'You are not authorized to perform this action.',
                },
            });
        }

        next();
    };
};
