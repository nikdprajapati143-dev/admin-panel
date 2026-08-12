import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { uploadSingleImage } from "../middlewares/upload.js";
import { validate } from "../middlewares/validate.js";
import { updateProfileSchema } from "../validators/admin.validator.js";
import {
    changePasswordSchema,
    forgotPasswordSchema,
    loginSchema,
    resetPasswordSchema,
} from "../validators/auth.validator.js";

const router = Router();
const authController = new AuthController();

// Public Auth Endpoints
router.post(
    "/auth/login",
    authLimiter,
    validate(loginSchema),
    authController.login,
);

router.post(
    "/auth/refresh",
    authController.refreshToken,
);

router.post(
    "/auth/forgot-password",
    authLimiter,
    validate(forgotPasswordSchema),
    authController.forgotPassword,
);

router.post(
    "/auth/reset-password",
    authLimiter,
    validate(resetPasswordSchema),
    authController.resetPassword,
);

// Protected Auth & Profile Endpoints
router.use(authenticate);

router.post("/auth/logout", authController.logout);

router.post(
    "/auth/change-password",
    validate(changePasswordSchema),
    authController.changePassword,
);

router.get("/profile", authController.getProfile);

router.put(
    "/profile",
    uploadSingleImage,
    validate(updateProfileSchema),
    authController.updateProfile,
);

export default router;
