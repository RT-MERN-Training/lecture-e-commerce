# E-Commerce Backend - Student Tickets

**Timeline**: Day 24, Day 26, Day 27  
**Topics Covered**: Express.js (Day 24), Database & ORM (Day 26), Authentication (Day 27)

---

## 📋 Overview

You will be building a RESTful API backend for the e-commerce application using Express.js, TypeScript, Drizzle ORM, and JWT authentication. The backend follows a layered architecture pattern with Routes → Controllers → Services → Repository layers.

---

## Day 24 (Thursday) - Express.js & API Architecture

### 🎯 Ticket 1: Setup Express Server with TypeScript
**Priority**: P0 (Critical)

**Description**:
Set up the Express.js server with TypeScript configuration, middleware, and basic routing structure.

**Tasks**:
1. Initialize the Express application in `src/index.ts`
   - Import and configure Express
   - Set up CORS middleware with `origin: "*"` and `credentials: true`
   - Add `express.json()` and `express.urlencoded({ extended: true })` middleware
   - Create a root route `GET /` that returns `{ message: "E-Commerce API is running", port: PORT }`
   - Set up server to listen on port from `process.env.PORT` or default to `3001`

2. Create error handling infrastructure in `src/core/errors/`
   - `error-codes.ts`: Define error code constants (NOT_FOUND, BAD_REQUEST, UNAUTHORIZED, etc.)
   - `custom-errors.ts`: Create custom error classes (NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError)
   - `error.middleware.ts`: Create error middleware that catches errors and returns proper HTTP status codes
   - `index.ts`: Export all error utilities

3. Register error middleware as the last middleware in `src/index.ts`

**Acceptance Criteria**:
- ✅ Server starts successfully on port 3001
- ✅ GET / returns welcome message
- ✅ CORS is configured properly
- ✅ Error middleware catches and formats errors correctly
- ✅ TypeScript compiles without errors

**Files to Create**:
- `src/index.ts`
- `src/core/errors/error-codes.ts`
- `src/core/errors/custom-errors.ts`
- `src/core/errors/error.middleware.ts`
- `src/core/errors/index.ts`

**Example Error Middleware**:
```typescript
export default function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  // Handle other error types...
  res.status(500).json({ error: "Internal server error" });
}
```

---

### 🎯 Ticket 2: Implement Products Module (Routes & Controller)
**Priority**: P0 (Critical)

**Description**:
Create the Products API with routes and controller layer using in-memory data storage.

**Tasks**:
1. Create `src/modules/products/product.routes.ts`
   - Define routes:
     - `GET /products/categories` - List all categories
     - `GET /products` - List products with pagination
     - `GET /products/:id` - Get product by ID
     - `POST /products` - Create new product
     - `PATCH /products/:id` - Update product
     - `DELETE /products/:id` - Delete product
   - Export router

2. Create `src/modules/products/product.controller.ts`
   - Implement controller class with methods for each route
   - Parse request params/query/body
   - Call service methods (to be implemented next)
   - Return appropriate responses
   - Use try-catch for error handling

3. Create `src/modules/products/types.ts`
   - Define `Product` interface with fields: id, title, description, price, discountPercentage, rating, stock, brand, category, thumbnail
   - Define `ProductListResponse` interface: `{ products: Product[], total: number, skip: number, limit: number }`

4. Register product routes in `src/index.ts`
   - `app.use("/products", productRoutes)`

**Acceptance Criteria**:
- ✅ All product routes are defined
- ✅ Controller methods are implemented
- ✅ Routes are registered in main app
- ✅ TypeScript types are properly defined

**Files to Create**:
- `src/modules/products/product.routes.ts`
- `src/modules/products/product.controller.ts`
- `src/modules/products/types.ts`

---

### 🎯 Ticket 3: Implement Products Service Layer
**Priority**: P0 (Critical)

**Description**:
Create the service layer for products with business logic and in-memory data storage.

**Tasks**:
1. Create `src/modules/products/product.service.ts`
   - Implement `ProductService` class with methods:
     - `listProducts(params)`: Return paginated products with filtering
     - `getProduct(id)`: Get single product by ID
     - `listCategories()`: Return unique categories
     - `createProduct(data)`: Add new product
     - `updateProduct(id, data)`: Update existing product
     - `deleteProduct(id)`: Remove product
   - Use in-memory array to store products (initialize with 5-10 mock products)
   - Implement pagination logic (skip, limit)
   - Implement filtering by category and search
   - Throw `NotFoundError` when product not found

2. Update controller to use service methods

**Acceptance Criteria**:
- ✅ Service methods implement business logic
- ✅ In-memory data storage works correctly
- ✅ Pagination returns correct results
- ✅ Filtering by category and search works
- ✅ Errors are thrown appropriately

**Files to Create**:
- `src/modules/products/product.service.ts`

**Example Service Method**:
```typescript
async listProducts(params: {
  limit?: number;
  skip?: number;
  category?: string;
  search?: string;
}): Promise<ProductListResponse> {
  let filtered = [...this.products];
  
  if (params.category) {
    filtered = filtered.filter(p => p.category === params.category);
  }
  
  if (params.search) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(params.search!.toLowerCase())
    );
  }
  
  const skip = params.skip ?? 0;
  const limit = params.limit ?? 30;
  const paginated = filtered.slice(skip, skip + limit);
  
  return {
    products: paginated,
    total: filtered.length,
    skip,
    limit
  };
}
```

---

### 🎯 Ticket 4: Implement Carts Module (Complete CRUD)
**Priority**: P1 (High)

**Description**:
Create the Carts API with full CRUD operations following the same layered architecture.

**Tasks**:
1. Create `src/modules/carts/cart.routes.ts`
   - Define routes:
     - `GET /carts` - List all carts
     - `GET /carts/:id` - Get cart by ID
     - `GET /carts/user/:userId` - Get cart by user ID
     - `POST /carts` - Create new cart
     - `PATCH /carts/:id` - Update cart
     - `POST /carts/:id/items` - Add item to cart
     - `DELETE /carts/:id` - Delete cart

2. Create `src/modules/carts/types.ts`
   - Define `CartItem` interface: `{ productId: number, quantity: number, price: number }`
   - Define `Cart` interface: `{ id: number, userId: number, items: CartItem[], total: number }`

3. Create `src/modules/carts/cart.controller.ts`
   - Implement controller methods for all routes
   - Parse and validate request data

4. Create `src/modules/carts/cart.service.ts`
   - Implement service methods with in-memory storage
   - Calculate cart totals automatically
   - Handle cart item operations (add, remove, update quantity)

5. Register cart routes in `src/index.ts`

**Acceptance Criteria**:
- ✅ All cart CRUD operations work
- ✅ Cart totals are calculated correctly
- ✅ Cart items can be added/removed
- ✅ User can have one cart
- ✅ In-memory storage persists during server runtime

**Files to Create**:
- `src/modules/carts/cart.routes.ts`
- `src/modules/carts/cart.controller.ts`
- `src/modules/carts/cart.service.ts`
- `src/modules/carts/types.ts`

---

### 🎯 Ticket 5: Implement Users Module (Basic CRUD)
**Priority**: P1 (High)

**Description**:
Create the Users API for managing user data (without authentication logic for now).

**Tasks**:
1. Create `src/modules/users/user.routes.ts`
   - Define routes:
     - `GET /users` - List users
     - `GET /users/:id` - Get user by ID
     - `POST /users` - Create user
     - `PATCH /users/:id` - Update user
     - `DELETE /users/:id` - Delete user

2. Create `src/modules/users/types.ts`
   - Define `User` interface: `{ id: number, username: string, email: string, password: string, firstName: string, lastName: string, role: string, image?: string, phone?: string }`
   - Define `SafeUser` type (User without password field)

3. Create `src/modules/users/user.controller.ts`
   - Implement controller methods
   - Never return password in responses

4. Create `src/modules/users/user.service.ts`
   - Implement service methods with in-memory storage
   - Add helper method `stripPassword(user)` to remove password from user object
   - Store passwords as plain text for now (will hash in Day 27)
   - Implement `findByUsername(username)` and `findByEmail(email)` methods

5. Register user routes in `src/index.ts`

**Acceptance Criteria**:
- ✅ All user CRUD operations work
- ✅ Password is never returned in responses
- ✅ Users can be found by username or email
- ✅ In-memory storage works correctly

**Files to Create**:
- `src/modules/users/user.routes.ts`
- `src/modules/users/user.controller.ts`
- `src/modules/users/user.service.ts`
- `src/modules/users/types.ts`

---

## Day 26 (Monday) - Database & ORM

### 🎯 Ticket 6: Setup Drizzle ORM and PostgreSQL
**Priority**: P0 (Critical)

**Description**:
Set up Drizzle ORM with PostgreSQL database connection and configuration.

**Tasks**:
1. Install required dependencies:
   ```bash
   npm install drizzle-orm postgres
   npm install -D drizzle-kit
   ```

2. Create `drizzle.config.ts` in project root
   - Configure database connection string from environment variable
   - Set schema path to `./src/db/schema`
   - Set output directory for migrations

3. Create `src/db/index.ts`
   - Import `drizzle` from `drizzle-orm/postgres-js`
   - Create database connection using `postgres` library
   - Export `db` instance

4. Create `.env` file with database connection string
   - `DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce`

5. Add npm scripts to `package.json`:
   - `"db:generate": "drizzle-kit generate"`
   - `"db:migrate": "drizzle-kit migrate"`
   - `"db:studio": "drizzle-kit studio"`

**Acceptance Criteria**:
- ✅ Drizzle ORM is configured correctly
- ✅ Database connection is established
- ✅ Environment variables are loaded
- ✅ Drizzle Kit commands work

**Files to Create**:
- `drizzle.config.ts`
- `src/db/index.ts`
- `.env`

**Example drizzle.config.ts**:
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

### 🎯 Ticket 7: Create Database Schema with Drizzle
**Priority**: P0 (Critical)

**Description**:
Define database tables using Drizzle ORM schema and generate migrations.

**Tasks**:
1. Create `src/db/schema/products.schema.ts`
   - Define `products` table using `pgTable`
   - Fields: id (serial, primary key), title, description, price (doublePrecision), discountPercentage (real), rating (real), stock (integer), brand (nullable), category, thumbnail (text)
   - Export `Product` and `NewProduct` types using `$inferSelect` and `$inferInsert`

2. Create `src/db/schema/users.schema.ts`
   - Define `users` table
   - Fields: id (serial, primary key), username (unique), email (unique), password, firstName, lastName, role (default: "customer"), image, phone, createdAt (timestamp)
   - Add unique constraints on username and email

3. Create `src/db/schema/carts.schema.ts`
   - Define `carts` table
   - Fields: id (serial, primary key), userId (foreign key to users), createdAt, updatedAt
   - Add foreign key constraint to users table

4. Create `src/db/schema/cart_items.schema.ts`
   - Define `cart_items` table
   - Fields: id (serial, primary key), cartId (foreign key to carts), productId (foreign key to products), quantity (integer), price (doublePrecision)
   - Add foreign key constraints

5. Create `src/db/schema/index.ts` to export all schemas

6. Generate migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

**Acceptance Criteria**:
- ✅ All tables are defined with proper types
- ✅ Foreign key relationships are set up
- ✅ Migrations are generated successfully
- ✅ Migrations run without errors
- ✅ Types are properly inferred

**Files to Create**:
- `src/db/schema/products.schema.ts`
- `src/db/schema/users.schema.ts`
- `src/db/schema/carts.schema.ts`
- `src/db/schema/cart_items.schema.ts`
- `src/db/schema/index.ts`

---

### 🎯 Ticket 8: Implement Products Repository with Drizzle
**Priority**: P0 (Critical)

**Description**:
Replace in-memory storage with Drizzle ORM database queries for products.

**Tasks**:
1. Create `src/modules/products/product.repository.ts`
   - Implement `ProductRepository` class with methods:
     - `findAll()`: Select all products
     - `findById(id)`: Select product by ID
     - `findPaginated(limit, skip, category?, search?)`: Paginated query with filters
     - `findAllCategories()`: Get distinct categories
     - `create(data)`: Insert new product
     - `update(id, data)`: Update product
     - `delete(id)`: Delete product
   - Use Drizzle query builder (`db.select()`, `db.insert()`, `db.update()`, `db.delete()`)
   - Use `where()`, `limit()`, `offset()` for filtering and pagination
   - Use `like()` for search functionality

2. Update `src/modules/products/product.service.ts`
   - Replace in-memory array with repository calls
   - Inject repository through constructor
   - Keep business logic in service layer

3. Update `src/modules/products/types.ts` to use schema types
   - Import types from schema: `import type { Product, NewProduct } from './product.schema'`

**Acceptance Criteria**:
- ✅ All repository methods use Drizzle ORM
- ✅ Queries are type-safe
- ✅ Pagination works correctly
- ✅ Filtering and search work
- ✅ Service layer uses repository

**Files to Create/Modify**:
- `src/modules/products/product.repository.ts` (new)
- `src/modules/products/product.service.ts` (modify)
- `src/modules/products/types.ts` (modify)

**Example Repository Method**:
```typescript
async findPaginated(
  limit: number,
  skip: number,
  category?: string,
  search?: string
) {
  let query = db.select().from(products);
  
  if (category) {
    query = query.where(eq(products.category, category));
  }
  
  if (search) {
    query = query.where(like(products.title, `%${search}%`));
  }
  
  const results = await query.limit(limit).offset(skip);
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products);
    
  return { products: results, total: count };
}
```

---

### 🎯 Ticket 9: Add Request Validation with Zod
**Priority**: P1 (High)

**Description**:
Implement request validation using Zod schemas for all API endpoints.

**Tasks**:
1. Install drizzle-zod:
   ```bash
   npm install drizzle-zod
   ```

2. Create `src/modules/products/validator.ts`
   - Use `createInsertSchema` from drizzle-zod to generate base schema from products table
   - Create `createProductSchema`: Refine insert schema with custom validations
   - Create `updateProductSchema`: Make all fields optional, require at least one field
   - Create `productIdParamSchema`: Validate ID param as positive integer
   - Create `listQuerySchema`: Validate query params (limit, skip, category, search)

3. Update `src/modules/products/product.controller.ts`
   - Use `.parse()` to validate request data before calling service
   - Wrap in try-catch to handle validation errors

4. Create `src/modules/carts/validator.ts`
   - Create validation schemas for cart operations
   - Validate cart items (productId, quantity must be positive)

5. Create `src/modules/users/validator.ts`
   - Create validation schemas for user operations
   - Validate email format, password strength (min 6 characters)

**Acceptance Criteria**:
- ✅ All request inputs are validated
- ✅ Validation errors return 400 status with clear messages
- ✅ Zod schemas are type-safe
- ✅ drizzle-zod integration works correctly

**Files to Create**:
- `src/modules/products/validator.ts`
- `src/modules/carts/validator.ts`
- `src/modules/users/validator.ts`

**Example Validator**:
```typescript
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { products } from "../../db/schema/products.schema";

export const createProductSchema = createInsertSchema(products, {
  title: z.string().min(1).max(255),
  price: z.number().positive(),
  stock: z.number().int().min(0),
}).omit({ id: true });

export const updateProductSchema = createProductSchema
  .partial()
  .refine(obj => Object.keys(obj).length > 0, {
    message: "At least one field must be provided"
  });

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
```

---

### 🎯 Ticket 10: Implement Carts and Users Repositories
**Priority**: P1 (High)

**Description**:
Replace in-memory storage with Drizzle ORM for carts and users modules.

**Tasks**:
1. Create `src/modules/carts/cart.repository.ts`
   - Implement repository methods for carts and cart_items
   - Use joins to get cart with items and product details
   - Implement methods: `findById`, `findByUserId`, `create`, `addItem`, `removeItem`, `updateItemQuantity`, `delete`

2. Create `src/modules/users/user.repository.ts`
   - Implement repository methods for users
   - Methods: `findAll`, `findById`, `findByUsername`, `findByEmail`, `create`, `update`, `delete`, `updatePassword`

3. Update respective service files to use repositories

4. Create seed data script in `src/db/seed/seed.ts`
   - Insert sample products, users, and carts
   - Run with `npm run db:seed`

**Acceptance Criteria**:
- ✅ Cart repository handles complex joins
- ✅ User repository implements all CRUD operations
- ✅ Services use repositories correctly
- ✅ Seed script populates database with test data

**Files to Create**:
- `src/modules/carts/cart.repository.ts`
- `src/modules/users/user.repository.ts`
- `src/db/seed/seed.ts`

---

## Day 27 (Tuesday) - Authentication

### 🎯 Ticket 11: Setup JWT and Password Hashing
**Priority**: P0 (Critical)

**Description**:
Set up JWT token generation and bcrypt password hashing for authentication.

**Tasks**:
1. Install required packages:
   ```bash
   npm install jsonwebtoken bcrypt
   npm install -D @types/jsonwebtoken @types/bcrypt
   ```

2. Add environment variables to `.env`:
   ```
   JWT_SECRET=your_secret_key_change_in_production
   JWT_REFRESH_SECRET=your_refresh_secret_change_in_production
   ```

3. Create `src/modules/auth/types.ts`
   - Define `AuthTokens` interface: `{ accessToken: string, refreshToken: string }`
   - Define `AuthResult` interface: extends SafeUser + AuthTokens
   - Define `AccessTokenPayload` interface: `{ userId: string, role: string }`

4. Update `src/modules/users/user.service.ts`
   - Modify `createUser` to hash password with bcrypt before saving
   - Use `bcrypt.hash(password, 10)` for hashing

**Acceptance Criteria**:
- ✅ JWT and bcrypt libraries are installed
- ✅ Environment variables are configured
- ✅ Types are properly defined
- ✅ Passwords are hashed before storage

**Files to Create/Modify**:
- `src/modules/auth/types.ts` (new)
- `src/modules/users/user.service.ts` (modify)
- `.env` (modify)

---

### 🎯 Ticket 12: Implement Authentication Service
**Priority**: P0 (Critical)

**Description**:
Create authentication service with signup, login, and logout functionality.

**Tasks**:
1. Create `src/modules/auth/auth.service.ts`
   - Implement `AuthService` class with methods:
     - `signup(data)`: Create user with hashed password, return tokens
     - `login(username, password)`: Verify credentials, return tokens
     - `logout()`: Return success message (stateless, client discards token)
     - `getMe(userId)`: Get current user info
     - `verifyAccessToken(token)`: Verify and decode JWT token
   - Private helper methods:
     - `signAccessToken(userId, role)`: Generate JWT with 15min expiry
     - `signRefreshToken(userId)`: Generate refresh token with 7d expiry
   - Use bcrypt.compare() to verify passwords
   - Inject UserService through constructor

2. Create `src/modules/auth/validator.ts`
   - `signupSchema`: Validate username, email, password (min 6 chars), firstName, lastName
   - `loginSchema`: Validate username and password
   - Export input types

**Acceptance Criteria**:
- ✅ Signup creates user with hashed password
- ✅ Login verifies credentials and returns tokens
- ✅ JWT tokens are generated correctly
- ✅ Password comparison works with bcrypt
- ✅ Validation schemas enforce requirements

**Files to Create**:
- `src/modules/auth/auth.service.ts`
- `src/modules/auth/validator.ts`

**Example Service Methods**:
```typescript
async signup(data: SignupInput): Promise<AuthResult> {
  const hashed = await bcrypt.hash(data.password, 10);
  const user = await this.users.createUser({
    ...data,
    password: hashed,
    role: "customer",
  });
  
  const safe = this.users.stripPassword(user);
  return {
    ...safe,
    accessToken: this.signAccessToken(user.id, user.role),
    refreshToken: this.signRefreshToken(user.id),
  };
}

async login(data: LoginInput): Promise<AuthResult> {
  const user = await this.users.findByUsername(data.username);
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }
  
  const matches = await bcrypt.compare(data.password, user.password);
  if (!matches) {
    throw new UnauthorizedError("Invalid credentials");
  }
  
  const safe = this.users.stripPassword(user);
  return {
    ...safe,
    accessToken: this.signAccessToken(user.id, user.role),
    refreshToken: this.signRefreshToken(user.id),
  };
}
```

---

### 🎯 Ticket 13: Implement Authentication Middleware
**Priority**: P0 (Critical)

**Description**:
Create middleware to protect routes and verify JWT tokens.

**Tasks**:
1. Create `src/modules/auth/auth.middleware.ts`
   - Extend Express Request type to include `userId` and `userRole` properties
   - Implement `requireAuth` middleware:
     - Extract token from `Authorization: Bearer <token>` header
     - Verify token using authService.verifyAccessToken()
     - Attach userId and userRole to req object
     - Call next() if valid, throw UnauthorizedError if invalid
   - Implement `requireRole(...roles)` middleware:
     - Check if user has required role
     - Throw ForbiddenError if insufficient permissions

2. Create `src/modules/auth/auth.controller.ts`
   - Implement controller methods:
     - `signup`: Call authService.signup()
     - `login`: Call authService.login()
     - `logout`: Call authService.logout()
     - `me`: Get current user (requires auth)
   - Validate requests using validator schemas

3. Create `src/modules/auth/auth.routes.ts`
   - Define routes:
     - `POST /auth/signup` - Public
     - `POST /auth/login` - Public
     - `POST /auth/logout` - Public (stateless)
     - `GET /auth/me` - Protected with requireAuth

4. Register auth routes in `src/index.ts`

**Acceptance Criteria**:
- ✅ requireAuth middleware verifies tokens correctly
- ✅ Protected routes return 401 for invalid/missing tokens
- ✅ req.userId is available in protected routes
- ✅ requireRole middleware enforces role-based access
- ✅ All auth endpoints work correctly

**Files to Create**:
- `src/modules/auth/auth.middleware.ts`
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/auth.routes.ts`

**Example Middleware**:
```typescript
export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Missing authorization header"));
  }
  
  const token = header.slice("Bearer ".length);
  try {
    const { userId, role } = authService.verifyAccessToken(token);
    req.userId = userId;
    req.userRole = role;
    next();
  } catch {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};
```

---

### 🎯 Ticket 14: Protect Cart and User Routes
**Priority**: P1 (High)

**Description**:
Apply authentication middleware to protect cart and user routes.

**Tasks**:
1. Update `src/modules/carts/cart.routes.ts`
   - Apply `requireAuth` middleware to all cart routes
   - Ensure users can only access their own carts
   - Modify controller to use `req.userId` instead of accepting userId in request body

2. Update `src/modules/users/user.routes.ts`
   - Protect user update and delete routes with `requireAuth`
   - Add `requireRole("admin")` to list all users route
   - Allow users to update only their own profile

3. Update controllers to enforce ownership:
   - In cart controller, verify `req.userId` matches cart's userId
   - In user controller, verify `req.userId` matches user being updated (unless admin)

4. Test protected routes:
   - Verify 401 response without token
   - Verify 403 response for insufficient permissions
   - Verify success with valid token

**Acceptance Criteria**:
- ✅ All cart routes require authentication
- ✅ Users can only access their own carts
- ✅ User routes enforce ownership
- ✅ Admin role can access all users
- ✅ Proper error responses for unauthorized access

**Files to Modify**:
- `src/modules/carts/cart.routes.ts`
- `src/modules/carts/cart.controller.ts`
- `src/modules/users/user.routes.ts`
- `src/modules/users/user.controller.ts`

---

### 🎯 Ticket 15: Implement Refresh Token Flow (Bonus)
**Priority**: P2 (Optional)

**Description**:
Add refresh token endpoint to allow clients to get new access tokens without re-login.

**Tasks**:
1. Update `src/modules/auth/auth.service.ts`
   - Add `refresh(refreshToken)` method:
     - Verify refresh token
     - Get user from database
     - Generate new access token
     - Return new access token

2. Update `src/modules/auth/validator.ts`
   - Add `refreshSchema`: Validate refreshToken field

3. Update `src/modules/auth/auth.controller.ts`
   - Add `refresh` method

4. Update `src/modules/auth/auth.routes.ts`
   - Add `POST /auth/refresh` route

**Acceptance Criteria**:
- ✅ Refresh token can be exchanged for new access token
- ✅ Invalid refresh tokens are rejected
- ✅ Expired refresh tokens are rejected

**Files to Modify**:
- `src/modules/auth/auth.service.ts`
- `src/modules/auth/validator.ts`
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/auth.routes.ts`

---

## 📝 Testing Checklist

### Day 24 Testing
- [ ] Server starts without errors
- [ ] All product CRUD operations work
- [ ] All cart CRUD operations work
- [ ] All user CRUD operations work
- [ ] Error handling returns proper status codes
- [ ] Pagination works correctly
- [ ] Filtering and search work

### Day 26 Testing
- [ ] Database connection is established
- [ ] Migrations run successfully
- [ ] All repository queries work
- [ ] Request validation catches invalid data
- [ ] Seed data populates correctly
- [ ] Foreign key relationships work

### Day 27 Testing
- [ ] Signup creates user with hashed password
- [ ] Login returns valid JWT tokens
- [ ] Protected routes require authentication
- [ ] Invalid tokens are rejected
- [ ] Role-based access control works
- [ ] Users can only access their own data
- [ ] Admin can access all resources

---

## 🚀 Submission Guidelines

1. Ensure all P0 and P1 tickets are completed
2. Test all endpoints using Postman or similar tool
3. Verify database schema is correct
4. Ensure no passwords are logged or returned in responses
5. Run TypeScript compilation: `npm run build`
6. Commit code with meaningful messages
7. Push to repository

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Zod Documentation](https://zod.dev/)
- [JWT Documentation](https://jwt.io/)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)

---

## 💡 Tips

1. **Layered Architecture**: Keep routes thin, controllers focused on request/response, services for business logic, repositories for data access
2. **Error Handling**: Always use try-catch and throw custom errors
3. **Type Safety**: Leverage TypeScript and Zod for compile-time and runtime safety
4. **Security**: Never log or return passwords, always hash before storage
5. **Testing**: Test each endpoint with valid and invalid data
6. **Database**: Use transactions for operations that modify multiple tables
7. **JWT**: Keep access tokens short-lived (15min), use refresh tokens for extended sessions

Good luck! 🎉
