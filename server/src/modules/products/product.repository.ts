import { eq, ilike, sql } from "drizzle-orm";
import { db } from "../../db";
import { products, type Product, type NewProduct } from "./product.schema";

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    return db.select().from(products);
  }

  async findById(id: number): Promise<Product | null> {
    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    return row ?? null;
  }

  async search(query: string): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(ilike(products.title, `%${query}%`));
  }

  async findByCategory(category: string): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.category, category));
  }

  async findAllCategories(): Promise<{ slug: string; name: string; url: string }[]> {
    const rows = await db
      .selectDistinct({ category: products.category })
      .from(products);
    return rows.map((r) => ({
      slug: r.category,
      name: r.category.replace(/-/g, ' '),
      url: `/products/category/${r.category}`,
    }));
  }

  async create(data: NewProduct): Promise<Product> {
    const [row] = await db.insert(products).values(data).returning();
    return row;
  }

  async update(id: number, data: Partial<NewProduct>): Promise<Product | null> {
    const [row] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    return row ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const rows = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });
    return rows.length > 0;
  }

  async findPaginated(
    limit: number,
    skip: number,
    category?: string,
    search?: string,
  ): Promise<{ products: Product[]; total: number }> {
    let query = db.select().from(products).$dynamic();
    let countQuery = db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(products)
      .$dynamic();

    if (category) {
      query = query.where(eq(products.category, category));
      countQuery = countQuery.where(eq(products.category, category));
    }
    if (search) {
      query = query.where(ilike(products.title, `%${search}%`));
      countQuery = countQuery.where(ilike(products.title, `%${search}%`));
    }

    const [rows, [{ count }]] = await Promise.all([
      query.limit(limit).offset(skip),
      countQuery,
    ]);

    return { products: rows, total: count };
  }

  async findByAvailabilityStatus(status: string): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(sql`${products.metadata}->>'availabilityStatus' = ${status}`);
  }

  async findByMinimumOrderQuantity(minQty: number): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(
        sql`(${products.metadata}->>'minimumOrderQuantity')::int >= ${minQty}`,
      );
  }

  async updateMetadata(
    id: number,
    metadata: Partial<NonNullable<Product["metadata"]>>,
  ): Promise<Product | null> {
    const [row] = await db
      .update(products)
      .set({
        metadata: sql`${products.metadata} || ${JSON.stringify(metadata)}::jsonb`,
      })
      .where(eq(products.id, id))
      .returning();
    return row ?? null;
  }

  async addImages(id: number, newImages: string[]): Promise<Product | null> {
    const [row] = await db
      .update(products)
      .set({
        images: sql`${products.images} || ${JSON.stringify(newImages)}::jsonb`,
      })
      .where(eq(products.id, id))
      .returning();
    return row ?? null;
  }
}

export const productRepository = new ProductRepository();
export default productRepository;
