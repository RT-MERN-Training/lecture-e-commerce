import type { Request, Response } from "express";
import { productService, ProductService } from "./product.service";
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  listQuerySchema,
  updateMetadataSchema,
  addImagesSchema,
} from "./validator";

export class ProductController {
  constructor(private readonly products: ProductService = productService) {}

  // GET /products?limit=&skip=&category=&search=
  // Response shape mirrors DummyJSON: { products, total, skip, limit }
  list = async (req: Request, res: Response) => {
    const params = listQuerySchema.parse(req.query);
    const result = await this.products.listProducts(params);
    res.json(result);
  };

  // GET /products/categories
  listCategories = async (_req: Request, res: Response) => {
    const categories = await this.products.listCategories();
    res.json(categories);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = productIdParamSchema.parse(req.params);
    const product = await this.products.getProduct(id);
    res.json(product);
  };

  create = async (req: Request, res: Response) => {
    const input = createProductSchema.parse(req.body);
    const created = await this.products.createProduct(input);
    res.status(201).json(created);
  };

  update = async (req: Request, res: Response) => {
    const { id } = productIdParamSchema.parse(req.params);
    const input = updateProductSchema.parse(req.body);
    const updated = await this.products.updateProduct(id, input);
    res.json(updated);
  };

  remove = async (req: Request, res: Response) => {
    const { id } = productIdParamSchema.parse(req.params);
    await this.products.deleteProduct(id);
    res.status(204).send();
  };

  updateMetadata = async (req: Request, res: Response) => {
    const { id } = productIdParamSchema.parse(req.params);
    const metadata = updateMetadataSchema.parse(req.body);
    const updated = await this.products.updateProductMetadata(id, metadata);
    res.json(updated);
  };

  addImages = async (req: Request, res: Response) => {
    const { id } = productIdParamSchema.parse(req.params);
    const { images } = addImagesSchema.parse(req.body);
    const updated = await this.products.addProductImages(id, images);
    res.json(updated);
  };
}

export const productController = new ProductController();
export default productController;
