import { Router } from "express";
import { PermissionController } from "../controllers/permission.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();
const permissionController = new PermissionController();

router.use(authenticate);

router.get("/permissions", permissionController.getAllPermissions);

export default router;
