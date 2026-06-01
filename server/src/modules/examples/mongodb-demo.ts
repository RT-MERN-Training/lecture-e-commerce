/**
 * MongoDB Demo - For Educational Purposes Only
 *
 * This file demonstrates MongoDB syntax and patterns.
 * Code is NOT meant to run - it's purely for learning and understanding NoSQL concepts.
 *
 * Key MongoDB Features:
 * - Flexible schema (schemaless documents)
 * - Document-based data model (JSON-like documents)
 * - Embedded documents and arrays
 * - Powerful aggregation pipeline
 * - Horizontal scaling capabilities
 */

import { MongoClient, ObjectId } from "mongodb";

// ============================================================================
// SETUP: MongoDB Connection (Conceptual)
// ============================================================================

/**
 * MongoDB: Connection setup
 *
 * MongoDB uses a single client with connection pooling built-in.
 */
const MONGODB_URI = "mongodb://localhost:27017";
const client = new MongoClient(MONGODB_URI);
const db = client.db("ecommerce");

// Collections (like tables in SQL databases, but schemaless)
const usersCollection = db.collection("users");
const productsCollection = db.collection("products");
const ordersCollection = db.collection("orders");

// ============================================================================
// MONGODB DOCUMENTS: Flexible Schema
// ============================================================================

/**
 * MongoDB Documents:
 * - No schema required (documents can have different fields)
 * - Flexible structure (can add/remove fields anytime)
 * - Documents are JSON-like (BSON format internally)
 * - Optional schema validation (can be added if needed)
 */

// Example MongoDB document:
const exampleUserDocument = {
  _id: new ObjectId(), // MongoDB's default primary key
  username: "john_doe",
  email: "john@example.com",
  createdAt: new Date(),
  // Can add any field without migration:
  preferences: {
    theme: "dark",
    language: "en",
  },
  // Arrays are first-class citizens:
  favoriteProducts: [new ObjectId(), new ObjectId()],
};

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * CREATE (Insert)
 */
async function createUserExamples() {
  // MongoDB: insertOne
  await usersCollection.insertOne({
    username: "john_doe",
    email: "john@example.com",
    createdAt: new Date(),
  });

  // MongoDB: insertMany (bulk insert)
  await usersCollection.insertMany([
    { username: "alice", email: "alice@example.com" },
    { username: "bob", email: "bob@example.com" },
  ]);
}

/**
 * READ (Query)
 */
async function readUserExamples() {
  // MongoDB: findOne (returns single document)
  const user = await usersCollection.findOne({ username: "john_doe" });

  // MongoDB: find (returns cursor for multiple documents)
  const users = await usersCollection.find({ role: "customer" }).toArray();

  // MongoDB: Query operators
  const activeUsers = await usersCollection
    .find({
      createdAt: { $gte: new Date("2024-01-01") }, // Greater than or equal
      status: { $in: ["active", "premium"] }, // IN operator
      age: { $gt: 18, $lt: 65 }, // Greater than AND less than
    })
    .toArray();

  // MongoDB: Projection (select specific fields)
  const usernames = await usersCollection
    .find({}, { projection: { username: 1, email: 1, _id: 0 } })
    .toArray();

  // MongoDB: Sorting and pagination
  const paginatedUsers = await usersCollection
    .find({})
    .sort({ createdAt: -1 }) // -1 = descending, 1 = ascending
    .skip(20)
    .limit(10)
    .toArray();
}

/**
 * UPDATE
 */
async function updateUserExamples() {
  // MongoDB: updateOne (update single document)
  await usersCollection.updateOne(
    { username: "john_doe" }, // Filter
    { $set: { email: "newemail@example.com" } }, // Update operators
  );

  // MongoDB: updateMany (update multiple documents)
  await usersCollection.updateMany(
    { role: "customer" },
    { $set: { verified: true } },
  );

  // MongoDB: Update operators
  await usersCollection.updateOne(
    { username: "john_doe" },
    {
      $set: { email: "new@example.com" }, // Set field value
      $inc: { loginCount: 1 }, // Increment number
      $push: { favoriteProducts: new ObjectId() }, // Add to array
      $unset: { tempField: "" }, // Remove field
    },
  );

  // MongoDB: Upsert (update if exists, insert if not)
  await usersCollection.updateOne(
    { username: "jane_doe" },
    { $set: { email: "jane@example.com", role: "customer" } },
    { upsert: true },
  );
}

/**
 * DELETE
 */
async function deleteUserExamples() {
  // MongoDB: deleteOne (delete single document)
  await usersCollection.deleteOne({ username: "john_doe" });

  // MongoDB: deleteMany (delete multiple documents)
  await usersCollection.deleteMany({ status: "inactive" });
}

// ============================================================================
// RELATIONSHIPS: MongoDB Embedded Documents vs References
// ============================================================================

/**
 * MongoDB Approach 1: Embedded Documents (Denormalized)
 *
 * Store related data directly in the document - NO JOINs needed!
 * Good for: Data that's always accessed together, 1-to-few relationships
 */
async function embeddedDocumentExample() {
  // Order with embedded items (no separate collection needed)
  const orderWithEmbeddedItems = {
    _id: new ObjectId(),
    userId: new ObjectId(),
    username: "john_doe", // Denormalized - copied from users
    total: 299.97,
    status: "completed",
    items: [
      // Embedded array - no separate table!
      {
        productId: new ObjectId(),
        productTitle: "Laptop", // Denormalized
        price: 999.99,
        quantity: 1,
      },
      {
        productId: new ObjectId(),
        productTitle: "Mouse",
        price: 29.99,
        quantity: 2,
      },
    ],
    createdAt: new Date(),
  };

  await ordersCollection.insertOne(orderWithEmbeddedItems);

  // Query is simple - everything in one document!
  const order = await ordersCollection.findOne({ _id: orderWithEmbeddedItems._id });
  // No JOINs needed - all data is right there!
}

/**
 * MongoDB Approach 2: References (Normalized)
 *
 * Store ObjectId references and use $lookup (MongoDB's JOIN equivalent)
 * Good for: Data that changes frequently, many-to-many relationships
 */
async function referencedDocumentExample() {
  // Separate collections with references
  const order = {
    _id: new ObjectId(),
    userId: new ObjectId("507f1f77bcf86cd799439011"), // Reference to user
    total: 999.99,
    status: "pending",
    items: [
      {
        productId: new ObjectId("507f191e810c19729de860ea"), // Reference to product
        quantity: 1,
        priceAtPurchase: 999.99,
      },
    ],
  };

  await ordersCollection.insertOne(order);

  // MongoDB: $lookup (join collections)
  const ordersWithUserData = await ordersCollection
    .aggregate([
      {
        $lookup: {
          from: "users", // Collection to join
          localField: "userId", // Field in orders
          foreignField: "_id", // Field in users
          as: "user", // Output array name
        },
      },
      {
        $unwind: "$user", // Convert array to object
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
    ])
    .toArray();
}

// ============================================================================
// TRANSACTIONS
// ============================================================================

/**
 * MongoDB: Transactions (added in v4.0+, requires replica set)
 *
 * Note: Single-document operations are ALWAYS atomic in MongoDB
 * Transactions are only needed for multi-document operations
 */
async function mongodbTransactionExample() {
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      // All operations in this function are part of the transaction

      // Deduct from sender
      await usersCollection.updateOne(
        { _id: new ObjectId("sender_id") },
        { $inc: { balance: -100 } },
        { session },
      );

      // Add to receiver
      await usersCollection.updateOne(
        { _id: new ObjectId("receiver_id") },
        { $inc: { balance: 100 } },
        { session },
      );

      // If any operation fails, entire transaction rolls back
    });

    console.log("Transaction committed successfully");
  } catch (error) {
    console.log("Transaction aborted due to error");
  } finally {
    await session.endSession();
  }
}

// ============================================================================
// INDEXING
// ============================================================================

/**
 * MongoDB: Create indexes on fields for better query performance
 */
async function mongodbIndexExamples() {
  // Single field index
  await usersCollection.createIndex({ email: 1 }); // 1 = ascending

  // Unique index
  await usersCollection.createIndex({ username: 1 }, { unique: true });

  // Compound index (multiple fields)
  await productsCollection.createIndex({ category: 1, price: -1 });

  // Text index (for full-text search)
  await productsCollection.createIndex({ title: "text", description: "text" });

  // Text search query
  const searchResults = await productsCollection
    .find({ $text: { $search: "laptop gaming" } })
    .toArray();
}

// ============================================================================
// AGGREGATION: Complex Data Processing
// ============================================================================

/**
 * MongoDB: Aggregation Pipeline (powerful data processing framework)
 * Process data through multiple stages to transform and analyze documents
 */
async function mongodbAggregationExample() {
  const categoryStats = await productsCollection
    .aggregate([
      // Stage 1: Filter documents
      { $match: { stock: { $gt: 0 } } },

      // Stage 2: Group by category
      {
        $group: {
          _id: "$category",
          avgPrice: { $avg: "$price" },
          count: { $sum: 1 },
          totalStock: { $sum: "$stock" },
        },
      },

      // Stage 3: Filter groups
      { $match: { avgPrice: { $gt: 100 } } },

      // Stage 4: Sort results
      { $sort: { avgPrice: -1 } },

      // Stage 5: Reshape output
      {
        $project: {
          category: "$_id",
          avgPrice: { $round: ["$avgPrice", 2] },
          count: 1,
          totalStock: 1,
          _id: 0,
        },
      },
    ])
    .toArray();
}

// ============================================================================
// SCHEMA VALIDATION: Optional in MongoDB
// ============================================================================

/**
 * MongoDB: Optional schema validation
 * While MongoDB is schemaless, you can add validation rules if needed
 */
async function createCollectionWithValidation() {
  await db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["username", "email", "role"],
        properties: {
          username: {
            bsonType: "string",
            minLength: 3,
            maxLength: 64,
          },
          email: {
            bsonType: "string",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          },
          role: {
            enum: ["customer", "admin"],
          },
          age: {
            bsonType: "int",
            minimum: 0,
            maximum: 150,
          },
        },
      },
    },
  });
}

// ============================================================================
// KEY TAKEAWAYS: When to use MongoDB
// ============================================================================

/**
 * MongoDB is ideal for:
 * ✅ Schema is flexible or evolving rapidly
 * ✅ You need to store nested/hierarchical data
 * ✅ Read performance is critical
 * ✅ You're building a content management system, catalog, or logging system
 * ✅ You want to avoid complex JOINs (denormalize data instead)
 * ✅ You need horizontal scaling (sharding across multiple servers)
 * ✅ Working with large volumes of unstructured or semi-structured data
 *
 * MongoDB strengths:
 * - Flexible schema allows rapid iteration
 * - Embedded documents reduce need for joins
 * - Horizontal scaling through sharding
 * - Rich query language with aggregation pipeline
 * - Native support for arrays and nested objects
 * - High performance for read-heavy workloads
 *
 * Common use cases:
 * - Content Management Systems (CMS)
 * - Product catalogs with varying attributes
 * - User activity logs and analytics
 * - Real-time analytics dashboards
 * - Mobile app backends
 * - IoT data storage
 */

/**
 * MongoDB Key Features Summary:
 *
 * | Feature              | Description                                    |
 * |----------------------|------------------------------------------------|
 * | Data Model           | Collections with JSON-like documents (BSON)    |
 * | Schema               | Flexible, dynamic (optional validation)        |
 * | Relationships        | Embedded documents or references with $lookup  |
 * | Transactions         | Available (v4.0+), single-doc always atomic    |
 * | Query Language       | MongoDB Query Language (MQL)                   |
 * | Scaling              | Horizontal (sharding across servers)           |
 * | Indexing             | Single, compound, text, geospatial indexes     |
 * | Aggregation          | Powerful pipeline for data transformation      |
 * | Best For             | Flexible, hierarchical, high-volume data       |
 */
