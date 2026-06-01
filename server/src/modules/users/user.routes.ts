import { Router } from "express";
import userController from "./user.controller";
import { requireAuth } from "../auth/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", userController.list);
router.get("/:id", userController.getById);
router.patch("/:id", userController.update);
router.put("/:id", userController.update);
router.patch("/:id/preferences", userController.updatePreferences);

export default router;
