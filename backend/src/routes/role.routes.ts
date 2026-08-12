import { Router } from "express";
import { PERMISSIONS } from "../constants/permissions.js";
import { RoleController } from "../controllers/role.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { authorizePermissions } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";
import { idParamSchema, paginationQuerySchema } from "../validators/common.validator.js";
import { createRoleSchema, updateRoleSchema } from "../validators/role.validator.js";

const router = Router();
const roleController = new RoleController();

// Require authentication for all role management endpoints
router.use(authenticate);

router.post(
    "/roles",
    authorizePermissions(PERMISSIONS.ROLE_CREATE),
    validate(createRoleSchema),
    roleController.createRole,
);

router.get(
    "/roles",
    authorizePermissions(PERMISSIONS.ROLE_READ),
    validate(paginationQuerySchema),
    roleController.getAllRoles,
);

router.get(
    "/roles/:id",
    authorizePermissions(PERMISSIONS.ROLE_READ),
    validate(idParamSchema),
    roleController.getRoleById,
);

router.put(
    "/roles/:id",
    authorizePermissions(PERMISSIONS.ROLE_EDIT),
    validate(updateRoleSchema),
    roleController.updateRole,
);

router.delete(
    "/roles/:id",
    authorizePermissions(PERMISSIONS.ROLE_DELETE),
    validate(idParamSchema),
    roleController.deleteRole,
);

export default router;
