import { Router } from "express";
import cartController from "./cart.controller";
import { requireAuth } from "../auth/auth.middleware";

const router = Router();

// GET /carts/user — returns the calling user's own cart (auth required).
// Must come BEFORE /:id to avoid being matched as a param.
router.get("/user", requireAuth, cartController.myCart);

router.get("/", cartController.list);
router.get("/:id", cartController.getById);
router.post("/", cartController.create);
router.patch("/:id", cartController.update);
router.put("/:id", cartController.update);
router.post("/:id/items", cartController.addItem);
router.delete("/:id", cartController.remove);

export default router;
