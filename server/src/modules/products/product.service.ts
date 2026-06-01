import { productRepository, ProductRepository } from "./product.repository";
import type { Product, NewProduct } from "./product.schema";
import { NotFoundError } from "../../core/errors";

// Response shape that coerces numeric string fields from Drizzle to numbers.
export interface ProductResponse
  extends Omit<Product, "price" | "discountPercentage" | "rating"> {
  price: number;
  discountPercentage: number;
  rating: number;
}

export interface ProductsListResponse {
  products: ProductResponse[];
  total: number;
  skip: number;
  limit: number;
}

const toResponse = (p: Product): ProductResponse => ({
  ...p,
  price: Number(p.price),
  discountPercentage: Number(p.discountPercentage),
  rating: Number(p.rating),
});

export class ProductService {
  constructor(
    private readonly products: ProductRepository = productRepository,
  ) {}

  async listProducts(params: {
    limit?: number;
    skip?: number;
    category?: string;
    search?: string;
  }): Promise<ProductsListResponse> {
    const limit = params.limit ?? 30;
    const skip = params.skip ?? 0;
    const { products, total } = await this.products.findPaginated(
      limit,
      skip,
      params.category,
      params.search,
    );
    return { products: products.map(toResponse), total, skip, limit };
  }

  async getProduct(id: number): Promise<ProductResponse> {
    const product = await this.products.findById(id);
    if (!product) throw new NotFoundError("Product not found");
    return toResponse(product);
  }

  async listCategories(): Promise<{ slug: string; name: string; url: string }[]> {
    return this.products.findAllCategories();
  }

  async createProduct(data: NewProduct): Promise<ProductResponse> {
    const created = await this.products.create(data);
    return toResponse(created);
  }

  async updateProduct(
    id: number,
    data: Partial<NewProduct>,
  ): Promise<ProductResponse> {
    const updated = await this.products.update(id, data);
    if (!updated) throw new NotFoundError("Product not found");
    return toResponse(updated);
  }

  async deleteProduct(id: number): Promise<void> {
    const ok = await this.products.delete(id);
    if (!ok) throw new NotFoundError("Product not found");
  }

  async getProductsByAvailability(status: string): Promise<ProductResponse[]> {
    const products = await this.products.findByAvailabilityStatus(status);
    return products.map(toResponse);
  }

  async getProductsByMinOrderQuantity(minQty: number): Promise<ProductResponse[]> {
    const products = await this.products.findByMinimumOrderQuantity(minQty);
    return products.map(toResponse);
  }

  async updateProductMetadata(
    id: number,
    metadata: Partial<NonNullable<Product["metadata"]>>,
  ): Promise<ProductResponse> {
    const updated = await this.products.updateMetadata(id, metadata);
    if (!updated) throw new NotFoundError("Product not found");
    return toResponse(updated);
  }

  async addProductImages(id: number, images: string[]): Promise<ProductResponse> {
    const updated = await this.products.addImages(id, images);
    if (!updated) throw new NotFoundError("Product not found");
    return toResponse(updated);
  }
}

export const productService = new ProductService();
export default productService;
