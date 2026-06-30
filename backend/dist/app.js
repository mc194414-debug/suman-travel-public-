"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("./middlewares/logger");
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
// Rate Limiter: 100 requests per minute general
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_ERROR',
            message: 'Too many requests, please try again later.'
        }
    }
});
app.use(limiter);
// Body Parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging
app.use(logger_1.requestLogger);
// Register API Router
app.use('/api/v1', routes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is healthy', timestamp: new Date() });
});
// Start Server
app.listen(PORT, () => {
    logger_1.logger.info(`Suman Travels backend listening on port ${PORT}`);
});
