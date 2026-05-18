import { Router } from "express";
import cartController from "./cart.controller";

const router = Router();

// GET /carts/user/:userId — returns cart for a specific user.
router.get("/user/:userId", cartController.getCartByUserId);

router.get("/", cartController.list);
router.get("/:id", cartController.getById);
router.post("/", cartController.create);
router.patch("/:id", cartController.update);
router.put("/:id", cartController.update);
router.post("/:id/items", cartController.addItem);
router.delete("/:id", cartController.remove);

export default router;
