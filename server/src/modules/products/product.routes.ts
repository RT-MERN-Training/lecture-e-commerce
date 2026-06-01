import { Router } from "express";
import productController from "./product.controller";

const router = Router();

// GET /products/categories must come BEFORE /:id to avoid being matched as param.
router.get("/categories", productController.listCategories);
router.get("/", productController.list);
router.get("/:id", productController.getById);
router.post("/", productController.create);
router.patch("/:id", productController.update);
router.put("/:id", productController.update);
router.delete("/:id", productController.remove);
router.patch("/:id/metadata", productController.updateMetadata);
router.post("/:id/images", productController.addImages);

export default router;
