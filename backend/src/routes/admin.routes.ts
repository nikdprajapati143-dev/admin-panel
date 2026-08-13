import { Router } from "express";
import { PERMISSIONS } from "../constants/permissions.js";
import { AdminController } from "../controllers/admin.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { authorizePermissions } from "../middlewares/authorize.js";
import { uploadSingleImage } from "../middlewares/upload.js";
import { validate } from "../middlewares/validate.js";
import {
    createAdminSchema,
    updateAdminSchema,
    updateAdminStatusSchema,
} from "../validators/admin.validator.js";
import { idParamSchema, paginationQuerySchema } from "../validators/common.validator.js";

const router = Router();
const adminController = new AdminController();

// Require authentication for all admin management endpoints
router.use(authenticate);

router.post(
    "/admins",
    authorizePermissions(PERMISSIONS.ADMIN_CREATE),
    uploadSingleImage,
    validate(createAdminSchema),
    adminController.createAdmin,
);

router.get(
    "/admins",
    authorizePermissions(PERMISSIONS.ADMIN_READ),
    validate(paginationQuerySchema),
    adminController.getAllAdmins,
);

router.get(
    "/admins/:id",
    authorizePermissions(PERMISSIONS.ADMIN_READ),
    validate(idParamSchema),
    adminController.getAdminById,
);

router.put(
    "/admins/:id",
    authorizePermissions(PERMISSIONS.ADMIN_EDIT),
    uploadSingleImage,
    validate(updateAdminSchema),
    adminController.updateAdmin,
);

// Dedicated Status Update API Route
router.patch(
    "/admins/:id/status",
    authorizePermissions(PERMISSIONS.ADMIN_EDIT),
    validate(updateAdminStatusSchema),
    adminController.updateAdminStatus,
);

router.delete(
    "/admins/:id",
    authorizePermissions(PERMISSIONS.ADMIN_DELETE),
    validate(idParamSchema),
    adminController.deleteAdmin,
);

export default router;
