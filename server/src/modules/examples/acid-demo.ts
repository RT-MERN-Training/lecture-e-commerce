import { db, pool } from "../../db";
import { products } from "../products/product.schema";
import { users } from "../users/user.schema";
import { carts, cartItems } from "../carts/cart.schema";
import { eq, sql } from "drizzle-orm";

/**
 * ACID Principles Demonstration
 *
 * This file demonstrates how developers explicitly implement ACID guarantees
 * through code. PostgreSQL provides the mechanisms, but WE must use them correctly.
 */

// ============================================================================
// A - ATOMICITY: Using BEGIN/COMMIT to package operations as one unit
// ============================================================================

/**
 * ACID: Atomicity Example - Transfer money between user accounts
 *
 * Developer's responsibility: Use BEGIN/COMMIT to tell the database
 * "these operations are ONE indivisible unit - all succeed or all fail together"
 * If we don't use transactions, each UPDATE would be independent and could
 * leave the system in an inconsistent state (money deducted but not added).
 */
export async function transferBalanceExample(
  fromUserId: number,
  toUserId: number,
  amount: number,
) {
  // ACID: Start transaction - tell database "lock in, we're doing a package deal"
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ACID: Step 1 - Deduct money from sender
    await client.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2",
      [amount, fromUserId],
    );

    // ACID: Simulate potential error (network issue, validation failure, etc.)
    // If error occurs here, ROLLBACK will undo Step 1
    if (amount > 10000) {
      throw new Error("Transfer amount exceeds limit");
    }

    // ACID: Step 2 - Add money to receiver
    await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [amount, toUserId],
    );

    // ACID: COMMIT - tell database "all steps succeeded, make it permanent!"
    await client.query("COMMIT");

    return { success: true, message: "Transfer completed" };
  } catch (error) {
    // ACID: ROLLBACK - tell database "abort mission, undo everything!"
    await client.query("ROLLBACK");

    return { success: false, message: "Transfer failed, all changes reverted" };
  } finally {
    client.release();
  }
}

// ============================================================================
// C - CONSISTENCY: Using Constraints to enforce business rules at DB level
// ============================================================================

/**
 * ACID: Consistency Example - Database constraints prevent invalid data
 *
 * Developer's responsibility: Define CHECK constraints, UNIQUE constraints,
 * and FOREIGN KEY constraints when creating tables. These are your last line
 * of defense - even if application code has bugs, the database will reject
 * invalid data.
 *
 * Example schema with constraints:
 *
 * CREATE TABLE accounts (
 *   id SERIAL PRIMARY KEY,
 *   username VARCHAR(64) UNIQUE NOT NULL,  -- UNIQUE prevents duplicates
 *   balance DECIMAL NOT NULL,
 *   CHECK (balance >= 0)  -- CHECK prevents negative balance
 * );
 *
 * CREATE TABLE orders (
 *   id SERIAL PRIMARY KEY,
 *   user_id INTEGER REFERENCES users(id),  -- FOREIGN KEY ensures user exists
 *   total DECIMAL CHECK (total > 0)  -- CHECK ensures positive order total
 * );
 */
export async function demonstrateConsistencyViolation() {
  try {
    // ACID: This will FAIL because of CHECK constraint (stock cannot be negative)
    await db
      .update(products)
      .set({ stock: -10 }) // Trying to set invalid negative stock
      .where(eq(products.id, 1));

    return { success: false, message: "Should not reach here" };
  } catch (error) {
    // ACID: Database rejected the operation to maintain consistency
    return {
      success: true,
      message: "Database prevented inconsistent state (negative stock)",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * ACID: Consistency Example - Unique constraint prevents duplicate usernames
 */
export async function demonstrateUniqueConstraint(username: string) {
  try {
    // ACID: First user creation succeeds
    await db.insert(users).values({
      username,
      email: `${username}@example.com`,
      password: "hashed_password",
      firstName: "Test",
      lastName: "User",
      role: "customer",
    });

    // ACID: Second attempt with same username will FAIL due to UNIQUE constraint
    await db.insert(users).values({
      username, // Same username - database will reject this
      email: `${username}2@example.com`,
      password: "hashed_password",
      firstName: "Test",
      lastName: "User",
      role: "customer",
    });

    return { success: false, message: "Should not reach here" };
  } catch (error) {
    // ACID: Database enforced consistency by rejecting duplicate username
    return {
      success: true,
      message: "Database prevented duplicate username",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================================================
// I - ISOLATION: Using FOR UPDATE to lock rows and prevent race conditions
// ============================================================================

/**
 * ACID: Isolation Example - Compare safe vs unsafe concurrent purchases
 *
 * Developer's responsibility: Use FOR UPDATE when you need to read-then-modify
 * data in a concurrent environment. This tells the database "lock this row
 * for me, don't let anyone else modify it until I'm done."
 *
 * Without FOR UPDATE (useLocking = false):
 * - User A reads: stock = 1
 * - User B reads: stock = 1  (at the same time)
 * - User A buys: stock = 0
 * - User B buys: stock = -1  (OVERSOLD!)
 *
 * With FOR UPDATE (useLocking = true):
 * - User A reads with lock: stock = 1 (row is now locked)
 * - User B tries to read with lock: WAITS for User A to finish
 * - User A buys: stock = 0, releases lock
 * - User B now reads: stock = 0, cannot buy (out of stock)
 */
export async function purchaseProductDemo(productId: number, quantity: number) {
  const USE_LOCKING = true;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ACID: THE KEY DIFFERENCE - Compare these two approaches:
    if (USE_LOCKING) {
      // ✅ SAFE: SELECT ... FOR UPDATE locks the row
      // Other transactions trying to lock this row will WAIT here
      const result = await client.query(
        "SELECT id, stock FROM products WHERE id = $1 FOR UPDATE",
        [productId],
      );
      var product = result.rows[0];
    } else {
      // ❌ UNSAFE: Regular SELECT without FOR UPDATE - NO LOCK!
      // Multiple transactions can read the same value simultaneously
      const result = await client.query(
        "SELECT id, stock FROM products WHERE id = $1",
        [productId],
      );
      var product = result.rows[0];
    }

    if (!product) {
      throw new Error("Product not found");
    }

    // ACID: Stock check behavior differs based on locking:
    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }
    // - WITH locking: This check is safe because row is locked
    // - WITHOUT locking: DANGER ZONE - another transaction might buy between
    //   this check and the update below, causing overselling!

    // During this time, another transaction might complete first
    await new Promise((resolve) => setTimeout(resolve, 100));

    // ACID: Update stock - safety depends on locking:
    await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [
      quantity,
      productId,
    ]);
    // - WITH locking: No other transaction can interfere
    // - WITHOUT locking: This might create negative stock if two transactions
    //   passed the check above with the same initial stock value

    await client.query("COMMIT");
    // ACID: Lock is released here (if locking was used), next waiting transaction can proceed

    return {
      success: true,
      message: useLocking
        ? "Purchase successful (safe with locking)"
        : "Purchase successful (but might oversell without locking!)",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    return {
      success: false,
      message: error instanceof Error ? error.message : "Purchase failed",
    };
  } finally {
    client.release();
  }
}

// ACID: Convenience wrappers for testing both approaches
export async function purchaseProductWithLocking(
  productId: number,
  quantity: number,
) {
  return purchaseProductDemo(productId, quantity, true);
}

export async function purchaseProductWithoutLocking(
  productId: number,
  quantity: number,
) {
  return purchaseProductDemo(productId, quantity, false);
}

// ============================================================================
// D - DURABILITY: Trust the database's COMMIT response
// ============================================================================

/**
 * ACID: Durability Example - Once COMMIT succeeds, data is permanent
 *
 * Developer's responsibility: Wait for and trust the COMMIT response.
 * You don't need to verify the hard disk yourself. If COMMIT returns success,
 * PostgreSQL GUARANTEES the data is written to persistent storage and will
 * survive crashes, power failures, etc.
 *
 * The database uses Write-Ahead Logging (WAL) to ensure durability:
 * 1. Changes are first written to WAL (sequential, fast)
 * 2. WAL is fsynced to disk (guaranteed persistence)
 * 3. COMMIT returns success to your code
 * 4. Later, changes are applied to actual data files (can be async)
 */
export async function createOrderWithDurabilityGuarantee(
  userId: number,
  productId: number,
  quantity: number,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ACID: Create order record
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, status) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [userId, 0, "pending"],
    );
    const orderId = orderResult.rows[0].id;

    // ACID: Update product stock
    await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [
      quantity,
      productId,
    ]);

    // ACID: COMMIT - This is the critical moment!
    // When this line completes without error, PostgreSQL has written
    // the changes to disk using WAL. Even if the server crashes 1 second later,
    // the data will be recovered from WAL on restart.
    await client.query("COMMIT");

    // ACID: At this point, you can SAFELY tell the user "Order confirmed!"
    // The database has made a binding promise that this data is permanent.
    return {
      success: true,
      orderId,
      message: "Order created and GUARANTEED to be durable",
    };
  } catch (error) {
    await client.query("ROLLBACK");

    // ACID: If we reach here, COMMIT never succeeded, so NO data was persisted
    return {
      success: false,
      message: "Order failed, no data was written to disk",
    };
  } finally {
    client.release();
  }
}

// ============================================================================
// COMBINED EXAMPLE: All ACID properties working together
// ============================================================================

/**
 * ACID: Complete Example - E-commerce checkout flow using all ACID properties
 *
 * This demonstrates how all four ACID properties work together in a real scenario:
 * - Atomicity: Multiple operations (check stock, create order, update stock) as one unit
 * - Consistency: Constraints prevent negative stock and invalid foreign keys
 * - Isolation: FOR UPDATE prevents race conditions during stock checks
 * - Durability: COMMIT guarantees the order is permanently recorded
 */
export async function completeCheckoutWithFullACID(
  userId: number,
  productId: number,
  quantity: number,
  price: number,
) {
  const client = await pool.connect();

  try {
    // ACID-A: BEGIN transaction - all following operations are atomic
    await client.query("BEGIN");

    // ACID-I: Lock the product row to prevent concurrent purchases
    const productResult = await client.query(
      "SELECT id, stock, price FROM products WHERE id = $1 FOR UPDATE",
      [productId],
    );

    const product = productResult.rows[0];

    if (!product) {
      throw new Error("Product not found");
    }

    // ACID-C: Business rule check (will also be enforced by CHECK constraint)
    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    // ACID-A: Step 1 - Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, status) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [userId, price * quantity, "completed"],
    );
    const orderId = orderResult.rows[0].id;

    // ACID-A: Step 2 - Update product stock
    // ACID-C: If this tries to set stock < 0, CHECK constraint will reject it
    await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [
      quantity,
      productId,
    ]);

    // ACID-A: Step 3 - Update user's cart
    await client.query(
      "DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = $1)",
      [userId],
    );

    // ACID-D: COMMIT - All changes are now permanent and durable
    // ACID-A: If any step above failed, ROLLBACK would undo everything
    await client.query("COMMIT");

    return {
      success: true,
      orderId,
      message: "Checkout completed with full ACID guarantees",
      explanation: {
        atomicity:
          "All 3 operations succeeded together, or would have failed together",
        consistency: "Stock cannot go negative due to CHECK constraint",
        isolation: "FOR UPDATE prevented other users from buying the same item",
        durability: "Order is permanently saved, survives any system crash",
      },
    };
  } catch (error) {
    // ACID-A: ROLLBACK - Undo all changes, maintain atomicity
    await client.query("ROLLBACK");

    return {
      success: false,
      message: error instanceof Error ? error.message : "Checkout failed",
      explanation: {
        atomicity: "All changes were rolled back, database is unchanged",
      },
    };
  } finally {
    client.release();
  }
}

/**
 * ACID: Summary for Developers
 *
 * Your responsibilities to ensure ACID:
 *
 * 1. ATOMICITY: Use BEGIN/COMMIT to define transaction boundaries
 *    - Wrap related operations in transactions
 *    - Use ROLLBACK on errors
 *
 * 2. CONSISTENCY: Define constraints when creating tables
 *    - CHECK constraints for business rules
 *    - UNIQUE constraints for uniqueness
 *    - FOREIGN KEY constraints for referential integrity
 *    - NOT NULL for required fields
 *
 * 3. ISOLATION: Use FOR UPDATE when reading data you'll modify
 *    - Prevents race conditions in concurrent scenarios
 *    - Choose appropriate isolation level if needed
 *
 * 4. DURABILITY: Trust the COMMIT response
 *    - If COMMIT succeeds, data is permanent
 *    - No need to manually verify disk writes
 *
 * PostgreSQL provides the mechanisms, but YOU must use them correctly!
 */
