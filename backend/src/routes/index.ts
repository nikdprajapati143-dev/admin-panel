import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import authRoutes from "./auth.routes.js";
import customerRoutes from "./customer.routes.js";
import roleRoutes from "./role.routes.js";

const router = Router();

// Mount feature routers under /admin prefix
router.use("/admin", authRoutes);
router.use("/admin", adminRoutes);
router.use("/admin", roleRoutes);
router.use("/admin", customerRoutes);

export default router;
