import { rateLimit } from "express-rate-limit";

const RateLimiter = rateLimit({
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

export default RateLimiter