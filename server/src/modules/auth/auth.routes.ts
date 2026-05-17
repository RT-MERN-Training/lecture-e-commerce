import { Router } from "express";
import authController from "./auth.controller";
import { requireAuth } from "./auth.middleware";

const router = Router();

// Public endpoints
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/refresh", authController.refresh);

// Protected endpoints
router.get("/me", requireAuth, authController.me);

export default router;
