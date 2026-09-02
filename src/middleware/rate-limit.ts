import { rateLimit } from "express-rate-limit";

const common = {
  standardHeaders: "draft-8" as const,
  legacyHeaders: false,
};

export const loginRateLimit = rateLimit({
  ...common,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many sign-in attempts. Try again later." },
});

export const adminRateLimit = rateLimit({
  ...common,
  windowMs: 60 * 1000,
  limit: 120,
  message: { message: "Too many requests. Try again shortly." },
});
