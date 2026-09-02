import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controller.js";
import { adminPortfolio, publicPortfolio } from "../controllers/portfolio.controller.js";
import { createItem, deleteItem, updateItem, updateSettings, uploadFile } from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

export const apiRouter = Router();
apiRouter.get("/health", (_req, res) => res.json({ status: "ok" }));
apiRouter.get("/portfolio", publicPortfolio);
apiRouter.post("/auth/login", login);
apiRouter.post("/auth/logout", logout);
apiRouter.get("/auth/me", requireAuth, me);
apiRouter.get("/admin/portfolio", requireAuth, adminPortfolio);
apiRouter.put("/admin/settings", requireAuth, updateSettings);
apiRouter.post("/admin/upload", requireAuth, upload.single("file"), uploadFile);
apiRouter.post("/admin/:resource", requireAuth, createItem);
apiRouter.put("/admin/:resource/:id", requireAuth, updateItem);
apiRouter.delete("/admin/:resource/:id", requireAuth, deleteItem);
