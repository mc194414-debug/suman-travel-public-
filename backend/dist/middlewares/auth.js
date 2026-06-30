"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateJWT = void 0;
const authenticateJWT = (req, res, next) => {
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
    }
    else {
        res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Access token is missing or invalid'
            }
        });
    }
};
exports.authenticateJWT = authenticateJWT;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        }
        else {
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
exports.requireRole = requireRole;
