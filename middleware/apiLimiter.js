import { rateLimit } from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many login attempts, please try again in 15 minutes",
    code: 429
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests from this IP, please try again later",
    code: 429
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 3,
  message: {
    message: "Too many requests, please try again later.",
    status: "error",
    code: 429,
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
