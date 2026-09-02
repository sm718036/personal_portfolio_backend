import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controller.js";
import { adminPortfolio, publicPortfolio } from "../controllers/portfolio.controller.js";
import {
  createItem,
  deleteItem,
  updateItem,
  updateSettings,
  uploadFile,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { requireAllowedOrigin } from "../middleware/origin.js";
import { adminRateLimit, loginRateLimit } from "../middleware/rate-limit.js";
import { liveness, readiness } from "../controllers/health.controller.js";

export const apiRouter = Router();
apiRouter.get("/health", liveness);
apiRouter.get("/health/ready", readiness);
apiRouter.get("/portfolio", publicPortfolio);
apiRouter.post("/auth/login", requireAllowedOrigin, loginRateLimit, login);
apiRouter.post("/auth/logout", requireAllowedOrigin, requireAuth, logout);
apiRouter.get("/auth/me", requireAuth, me);
apiRouter.use("/admin", requireAllowedOrigin, requireAuth, adminRateLimit);
apiRouter.get("/admin/portfolio", adminPortfolio);
apiRouter.put("/admin/settings", updateSettings);
apiRouter.post("/admin/upload", upload.single("file"), uploadFile);
apiRouter.post("/admin/:resource", createItem);
apiRouter.put("/admin/:resource/:id", updateItem);
apiRouter.delete("/admin/:resource/:id", deleteItem);
