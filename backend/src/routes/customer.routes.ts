import { Router } from "express";
import { PERMISSIONS } from "../constants/permissions.js";
import { CustomerController } from "../controllers/customer.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { authorizePermissions } from "../middlewares/authorize.js";
import { uploadSingleImage } from "../middlewares/upload.js";
import { validate } from "../middlewares/validate.js";
import { idParamSchema } from "../validators/common.validator.js";
import {
    createCustomerSchema,
    customerQuerySchema,
    updateCustomerSchema,
    updateCustomerStatusSchema,
} from "../validators/customer.validator.js";

const router = Router();
const customerController = new CustomerController();

// Require authentication for all customer management endpoints
router.use(authenticate);

router.post(
    "/customers",
    authorizePermissions(PERMISSIONS.CUSTOMER_CREATE),
    uploadSingleImage,
    validate(createCustomerSchema),
    customerController.createCustomer,
);

router.get(
    "/customers",
    authorizePermissions(PERMISSIONS.CUSTOMER_READ),
    validate(customerQuerySchema),
    customerController.getAllCustomers,
);

router.get(
    "/customers/:id",
    authorizePermissions(PERMISSIONS.CUSTOMER_READ),
    validate(idParamSchema),
    customerController.getCustomerById,
);

router.put(
    "/customers/:id",
    authorizePermissions(PERMISSIONS.CUSTOMER_EDIT),
    uploadSingleImage,
    validate(updateCustomerSchema),
    customerController.updateCustomer,
);

// Dedicated Customer Status Update API Route
router.patch(
    "/customers/:id/status",
    authorizePermissions(PERMISSIONS.CUSTOMER_EDIT),
    validate(updateCustomerStatusSchema),
    customerController.updateCustomerStatus,
);

router.delete(
    "/customers/:id",
    authorizePermissions(PERMISSIONS.CUSTOMER_DELETE),
    validate(idParamSchema),
    customerController.deleteCustomer,
);

export default router;
