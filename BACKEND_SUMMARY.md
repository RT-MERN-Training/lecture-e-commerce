# Backend Development - Quick Summary

## 📊 Overview

**Total Tickets**: 15 (11 core + 1 bonus)  
**Timeline**: 3 days (Day 24, Day 26, Day 27)  
**Estimated Total Time**: 18-22 hours

---

## 🗓️ Daily Breakdown

### Day 24 (Monday) - Express.js & API Architecture
**Focus**: Building RESTful API with layered architecture  
**Estimated Time**: 6-8 hours

| Ticket | Title | Priority | Estimated Time |
|--------|-------|----------|----------------|
| 1 | Setup Express Server with TypeScript | P0 | 1-1.5 hrs |
| 2 | Implement Products Module (Routes & Controller) | P0 | 1.5 hrs |
| 3 | Implement Products Service Layer | P0 | 1.5 hrs |
| 4 | Implement Carts Module (Complete CRUD) | P1 | 2 hrs |
| 5 | Implement Users Module (Basic CRUD) | P1 | 1.5 hrs |

**Key Deliverables**:
- Express server with CORS and error handling
- Products API with full CRUD
- Carts API with item management
- Users API with basic operations
- In-memory data storage
- Layered architecture (Routes → Controllers → Services)

---

### Day 26 (Wednesday) - Database & ORM
**Focus**: Integrating Drizzle ORM and PostgreSQL  
**Estimated Time**: 6-8 hours

| Ticket | Title | Priority | Estimated Time |
|--------|-------|----------|----------------|
| 6 | Setup Drizzle ORM and PostgreSQL | P0 | 1 hr |
| 7 | Create Database Schema with Drizzle | P0 | 1.5 hrs |
| 8 | Implement Products Repository with Drizzle | P0 | 1.5 hrs |
| 9 | Add Request Validation with Zod | P1 | 1.5 hrs |
| 10 | Implement Carts and Users Repositories | P1 | 2 hrs |

**Key Deliverables**:
- Drizzle ORM configuration
- Database schema (products, users, carts, cart_items)
- Migrations and seed data
- Repository layer with type-safe queries
- Request validation with Zod and drizzle-zod
- Replace in-memory storage with database

---

### Day 27 (Friday) - Authentication
**Focus**: JWT authentication and protected routes  
**Estimated Time**: 6-8 hours

| Ticket | Title | Priority | Estimated Time |
|--------|-------|----------|----------------|
| 11 | Setup JWT and Password Hashing | P0 | 1 hr |
| 12 | Implement Authentication Service | P0 | 2 hrs |
| 13 | Implement Authentication Middleware | P0 | 1.5 hrs |
| 14 | Protect Cart and User Routes | P1 | 1.5 hrs |
| 15 | Implement Refresh Token Flow (Bonus) | P2 | 1 hr |

**Key Deliverables**:
- JWT token generation and verification
- Password hashing with bcrypt
- Signup and login endpoints
- Authentication middleware
- Protected routes
- Role-based access control
- Refresh token flow (optional)

---

## 🎯 Priority Breakdown

### P0 - Critical (Must Complete)
**Total**: 8 tickets | ~12-15 hours

1. Setup Express Server with TypeScript
2. Implement Products Module (Routes & Controller)
3. Implement Products Service Layer
4. Setup Drizzle ORM and PostgreSQL
5. Create Database Schema with Drizzle
6. Implement Products Repository with Drizzle
7. Setup JWT and Password Hashing
8. Implement Authentication Service
9. Implement Authentication Middleware

### P1 - High (Should Complete)
**Total**: 6 tickets | ~10-12 hours

4. Implement Carts Module (Complete CRUD)
5. Implement Users Module (Basic CRUD)
9. Add Request Validation with Zod
10. Implement Carts and Users Repositories
14. Protect Cart and User Routes

### P2 - Optional (Nice to Have)
**Total**: 1 ticket | ~1 hour

15. Implement Refresh Token Flow (Bonus)

---

## 📈 Recommended Workflow

### Day 24 (Monday) - Express Fundamentals
**Morning (3-4 hours)**
1. ✅ Complete Ticket 1: Express setup
2. ✅ Complete Ticket 2: Products routes & controller
3. ✅ Start Ticket 3: Products service
4. 🎯 **Goal**: Products API working with in-memory storage

**Afternoon (3-4 hours)**
1. ✅ Finish Ticket 3: Products service
2. ✅ Complete Ticket 4: Carts module
3. ✅ Complete Ticket 5: Users module
4. 🎯 **Goal**: All three modules working, test with Postman

---

### Day 26 (Wednesday) - Database Integration
**Morning (3-4 hours)**
1. ✅ Complete Ticket 6: Drizzle setup
2. ✅ Complete Ticket 7: Database schema
3. ✅ Start Ticket 8: Products repository
4. 🎯 **Goal**: Database connected, schema migrated

**Afternoon (3-4 hours)**
1. ✅ Finish Ticket 8: Products repository
2. ✅ Complete Ticket 9: Zod validation
3. ✅ Complete Ticket 10: Carts & Users repositories
4. 🎯 **Goal**: All modules using database, validation working

---

### Day 27 (Friday) - Authentication
**Morning (3-4 hours)**
1. ✅ Complete Ticket 11: JWT & bcrypt setup
2. ✅ Complete Ticket 12: Auth service
3. ✅ Start Ticket 13: Auth middleware
4. 🎯 **Goal**: Signup and login working

**Afternoon (3-4 hours)**
1. ✅ Finish Ticket 13: Auth middleware
2. ✅ Complete Ticket 14: Protect routes
3. ✅ (Optional) Ticket 15: Refresh tokens
4. 🧪 Final testing
5. 🎯 **Goal**: Fully functional authenticated API

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Express Server                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Middleware Stack                     │  │
│  │  - CORS                                           │  │
│  │  - express.json()                                 │  │
│  │  - express.urlencoded()                           │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↓                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │                   Routes                          │  │
│  │  /products → productRoutes                        │  │
│  │  /carts → cartRoutes                              │  │
│  │  /users → userRoutes                              │  │
│  │  /auth → authRoutes                               │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↓                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │            Auth Middleware (optional)             │  │
│  │  - requireAuth                                    │  │
│  │  - requireRole                                    │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↓                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Controllers                          │  │
│  │  - Parse & validate requests (Zod)               │  │
│  │  - Call service methods                           │  │
│  │  - Return responses                               │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↓                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │               Services                            │  │
│  │  - Business logic                                 │  │
│  │  - Data transformation                            │  │
│  │  - Error handling                                 │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↓                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │             Repositories                          │  │
│  │  - Database queries (Drizzle ORM)                 │  │
│  │  - CRUD operations                                │  │
│  │  - Data access layer                              │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↓                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                  │  │
│  │  - products                                       │  │
│  │  - users                                          │  │
│  │  - carts                                          │  │
│  │  - cart_items                                     │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↓                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │            Error Middleware                       │  │
│  │  - Catch all errors                               │  │
│  │  - Format error responses                         │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Concepts by Day

### Day 24 Concepts
- **Express.js**: Server setup, middleware, routing
- **RESTful API**: HTTP methods, status codes, request/response
- **Layered Architecture**: Separation of concerns
- **Error Handling**: Custom errors, error middleware
- **TypeScript**: Type safety, interfaces

### Day 26 Concepts
- **ORM**: Object-Relational Mapping with Drizzle
- **Database Schema**: Tables, columns, relationships
- **Migrations**: Version control for database
- **Query Builder**: Type-safe database queries
- **Validation**: Runtime type checking with Zod
- **drizzle-zod**: Schema-based validation

### Day 27 Concepts
- **Authentication**: Signup, login, logout
- **JWT**: Token generation, verification, expiration
- **Password Hashing**: bcrypt for secure storage
- **Middleware**: Request interception, authorization
- **RBAC**: Role-based access control
- **Security**: Never expose passwords, use HTTPS in production

---

## 🎓 Learning Objectives

By completing these tickets, students will learn:

1. **Backend Architecture**
   - Layered architecture pattern
   - Separation of concerns
   - Dependency injection

2. **Express.js**
   - Server setup and configuration
   - Middleware pipeline
   - Routing and controllers
   - Error handling

3. **Database & ORM**
   - PostgreSQL database
   - Drizzle ORM queries
   - Schema design and migrations
   - Foreign key relationships

4. **Validation**
   - Zod schema validation
   - drizzle-zod integration
   - Request/response validation

5. **Authentication & Security**
   - JWT token-based auth
   - Password hashing with bcrypt
   - Protected routes
   - Role-based access control

6. **TypeScript**
   - Type-safe API development
   - Interface design
   - Type inference

---

## 🚨 Common Pitfalls to Avoid

1. **Mixing Concerns**: Keep business logic in services, not controllers
2. **Exposing Passwords**: Never return password field in responses
3. **Weak Validation**: Always validate user input
4. **SQL Injection**: Use ORM query builders, not raw SQL
5. **Hardcoded Secrets**: Use environment variables for JWT secrets
6. **Missing Error Handling**: Always use try-catch in async functions
7. **Ignoring Types**: Leverage TypeScript for compile-time safety
8. **Skipping Migrations**: Always generate and run migrations for schema changes

---

## 📞 Getting Help

If you're stuck:

1. **Read the error message** - Most errors are self-explanatory
2. **Check the documentation** - Links provided in BACKEND_TICKETS.md
3. **Review the lecture code** - Reference implementation in lecture-e-commerce/server
4. **Test with Postman** - Verify API responses manually
5. **Ask for help** - Don't stay stuck for more than 30 minutes

---

## ✅ Definition of Done

A ticket is complete when:

- [ ] All tasks are implemented
- [ ] Code compiles without TypeScript errors
- [ ] Feature works as described
- [ ] Tested with Postman or similar tool
- [ ] No console errors
- [ ] Error handling is in place
- [ ] Code is committed with meaningful message

---

## 🏆 Success Metrics

**Minimum Viable Product (MVP)**:
- All P0 tickets completed
- Basic CRUD operations work
- Database integration works
- Authentication works

**Target Goal**:
- All P0 and P1 tickets completed
- Proper error handling
- Request validation
- Protected routes

**Stretch Goal**:
- All tickets including P2 completed
- Refresh token flow implemented
- Comprehensive testing

---

## 🔗 API Endpoints Reference

### Products
- `GET /products` - List products (pagination, filters)
- `GET /products/categories` - List categories
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Carts
- `GET /carts` - List all carts
- `GET /carts/:id` - Get cart by ID
- `GET /carts/user/:userId` - Get cart by user ID
- `POST /carts` - Create cart
- `PATCH /carts/:id` - Update cart
- `POST /carts/:id/items` - Add item to cart
- `DELETE /carts/:id` - Delete cart

### Users
- `GET /users` - List users (admin only)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Auth
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user (protected)
- `POST /auth/refresh` - Refresh access token (bonus)

---

**Last Updated**: Week 6  
**Version**: 1.0

Good luck with your backend development! 🚀
