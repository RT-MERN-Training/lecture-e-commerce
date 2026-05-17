/**
 * Seed script — populates the DB with mock data matching the DummyJSON schema.
 * Run with: `npm run db:seed`
 *
 * Safe to run multiple times: truncates tables first for a clean dataset.
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { sql } from "drizzle-orm";
import { db, pool } from "./index";
import { users, products, carts, cartItems } from "./schema";
import rawProducts from "./products.json";
import rawUsers from "./users.json";

const SALT_ROUNDS = 10;

const productData = rawProducts;
const userData = rawUsers;

async function seed() {
  console.log("🌱 Starting seed...");

  console.log("🧹 Clearing existing data...");
  await db.execute(
    sql`TRUNCATE TABLE ${cartItems}, ${carts}, ${products}, ${users} RESTART IDENTITY CASCADE`,
  );

  console.log("👤 Inserting users...");
  const insertedUsers = await db
    .insert(users)
    .values(
      await Promise.all(
        userData.map(async (u) => ({
          username: u.username,
          email: u.email,
          password: await bcrypt.hash(u.plainPassword, SALT_ROUNDS),
          role: u.role,
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phone,
          image: u.image,
        })),
      ),
    )
    .returning();
  console.log(`   ✔ ${insertedUsers.length} users`);

  console.log("📦 Inserting products...");
  const insertedProducts = await db
    .insert(products)
    .values(productData)
    .returning();
  console.log(`   ✔ ${insertedProducts.length} products`);

  const [emily, michael] = insertedUsers;
  const [prd1, prd2, , , prd5] = insertedProducts;

  // prd1 = Essence Mascara $9.99, prd2 = Eyeshadow Palette $19.99, prd5 = Red Nail Polish $8.99
  console.log("🛒 Inserting carts...");
  const [emilysCart, michaelsCart] = await db
    .insert(carts)
    .values([
      { userId: emily.id, total: "39.97", discountedTotal: "39.97" },
      { userId: michael.id, total: "8.99", discountedTotal: "8.99" },
    ])
    .returning();

  await db.insert(cartItems).values([
    {
      cartId: emilysCart.id,
      productId: prd1.id,
      quantity: 2,
      priceAtAdd: "9.99",
    },
    {
      cartId: emilysCart.id,
      productId: prd2.id,
      quantity: 1,
      priceAtAdd: "19.99",
    },
    {
      cartId: michaelsCart.id,
      productId: prd5.id,
      quantity: 1,
      priceAtAdd: "8.99",
    },
  ]);
  console.log(`   ✔ 2 carts with items`);

  console.log("✅ Seed complete!");
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
