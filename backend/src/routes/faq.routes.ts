import { Router } from "express";
import { PERMISSIONS } from "../constants/permissions.js";
import { FaqController } from "../controllers/faq.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { authorizePermissions } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";
import { idParamSchema } from "../validators/common.validator.js";
import {
    createFaqSchema,
    faqQuerySchema,
    updateFaqSchema,
    updateFaqStatusSchema,
} from "../validators/faq.validator.js";

const router = Router();
const faqController = new FaqController();

// Require authentication for all FAQ management endpoints
router.use(authenticate);

router.post(
    "/faqs",
    authorizePermissions(PERMISSIONS.FAQ_CREATE),
    validate(createFaqSchema),
    faqController.createFaq,
);

router.get(
    "/faqs",
    authorizePermissions(PERMISSIONS.FAQ_READ, PERMISSIONS.FAQ_LIST),
    validate(faqQuerySchema),
    faqController.getAllFaqs,
);

router.get(
    "/faqs/categories",
    authorizePermissions(PERMISSIONS.FAQ_READ, PERMISSIONS.FAQ_LIST),
    faqController.getCategories,
);

router.get(
    "/faqs/:id",
    authorizePermissions(PERMISSIONS.FAQ_READ, PERMISSIONS.FAQ_LIST),
    validate(idParamSchema),
    faqController.getFaqById,
);

router.put(
    "/faqs/:id",
    authorizePermissions(PERMISSIONS.FAQ_EDIT),
    validate(updateFaqSchema),
    faqController.updateFaq,
);

router.patch(
    "/faqs/:id/status",
    authorizePermissions(PERMISSIONS.FAQ_EDIT),
    validate(updateFaqStatusSchema),
    faqController.updateFaqStatus,
);

router.delete(
    "/faqs/:id",
    authorizePermissions(PERMISSIONS.FAQ_DELETE),
    validate(idParamSchema),
    faqController.deleteFaq,
);

export default router;
