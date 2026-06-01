# E-Commerce App - Frontend Tickets

**Timeline**: Day 18 (Wednesday) - Day 23 (Wednesday)  
**Working Days**: 5 days (Wed, Thu, Fri, Mon, Tue)  
**Topics Covered**: React Query (Day 18), State Management (Day 19), React Router (Day 21), Frontend MISC (Day 22)

---

## 📋 Overview

You will be building a full-featured e-commerce application by implementing React Query for server state management, authentication context, protected routes, and advanced filtering/sorting features. The starter code provides the basic UI structure, and you'll add all the data fetching, state management, and business logic.

---

## Day 18 (Wednesday) - React Query Basics

### 🎯 Ticket 1: Setup React Query Infrastructure
**Priority**: P0 (Critical)

**Description**:
Set up the React Query infrastructure to manage server state throughout the application.

**Tasks**:
1. Create `src/lib/queryClient.ts`
   - Import `QueryClient` from `@tanstack/react-query`
   - Create and export a `queryClient` instance with default options:
     - `refetchOnWindowFocus: false`
     - `retry: 1`

2. Create `src/lib/axiosClient.ts`
   - Create an axios instance with `baseURL: "https://dummyjson.com"`
   - Add a request interceptor that:
     - Retrieves the token from `localStorage.getItem("token")`
     - Adds `Authorization: Bearer ${token}` header if token exists
     - Adds a 500ms delay using `await wait(500)` for demo purposes

3. Update `src/App.tsx`
   - Import `QueryClientProvider` and `queryClient`
   - Wrap the app with `QueryClientProvider` (inside `MantineProvider`, outside `RouterProvider`)

**Acceptance Criteria**:
- ✅ QueryClient is configured with proper default options
- ✅ Axios client automatically attaches auth token to requests
- ✅ App is wrapped with QueryClientProvider

**Files to Create/Modify**:
- `src/lib/queryClient.ts` (new)
- `src/lib/axiosClient.ts` (new)
- `src/App.tsx` (modify)

---

### 🎯 Ticket 2: Implement Products API and Hooks
**Priority**: P0 (Critical)

**Description**:
Create the API layer and React Query hooks for fetching products data.

**Tasks**:
1. Create `src/features/products/types.ts`
   - Define `Product` interface with fields: `id`, `title`, `description`, `price`, `discountPercentage`, `rating`, `stock`, `brand`, `category`, `thumbnail`, `images`

2. Create `src/features/products/productApi.ts`
   - Implement `getProducts()`: GET `/products?limit=100`
   - Implement `searchProducts(query: string)`: GET `/products/search?q=${query}&limit=100`
   - Implement `getProductById(id: number)`: GET `/products/${id}`
   - Implement `getCategories()`: GET `/products/categories`
   - All functions should use `axiosClient` and return properly typed data

3. Create `src/features/products/hooks/useProducts.ts`
   - Implement `useProducts(search?: string)` hook
     - Query key: `['products', search ?? '']`
     - Use `searchProducts` if search exists, otherwise `getProducts`
   - Implement `useProduct(id: number)` hook
     - Query key: `['product', id]`
     - Enable only if `id` exists
   - Implement `useCategories()` hook
     - Query key: `['categories']`
     - Set `staleTime: Infinity` (categories rarely change)

4. Update `src/features/products/pages/Products.tsx`
   - Import and use `useProducts()` and `useCategories()` hooks
   - Display loading state with `<Spinner />` component
   - Display error state with `<ErrorMessage />` component
   - Render products in a grid using `ProductCard` component
   - Show product count: `{products?.length || 0} products found`

**Acceptance Criteria**:
- ✅ Products are fetched and displayed on the Products page
- ✅ Loading and error states are handled properly
- ✅ Categories are fetched for the filter sidebar
- ✅ Search functionality works (when implemented in filters)

**Files to Create/Modify**:
- `src/features/products/types.ts` (new)
- `src/features/products/productApi.ts` (new)
- `src/features/products/hooks/useProducts.ts` (new)
- `src/features/products/pages/Products.tsx` (modify)

---

### 🎯 Ticket 3: Implement Product Card Component
**Priority**: P1 (High)

**Description**:
Enhance the ProductCard component to display product information and handle navigation.

**Tasks**:
1. Update `src/features/products/components/ProductCard.tsx`
   - Accept `product: Product` as prop
   - Display product image, title, price, rating, and discount
   - Add "View Details" button that navigates to `/products/${product.id}`
   - Show discounted price if `discountPercentage > 0`
   - Use Mantine components: `Card`, `Image`, `Text`, `Badge`, `Button`, `Group`

2. Create `src/features/products/components/ProductImage.tsx` (optional helper)
   - Component to handle product image display with fallback
   - Accept `src`, `alt`, and optional `height` props

**Acceptance Criteria**:
- ✅ Product cards display all relevant information
- ✅ Clicking "View Details" navigates to product detail page
- ✅ Discounted prices are highlighted
- ✅ Images load with proper fallback handling

**Files to Create/Modify**:
- `src/features/products/components/ProductCard.tsx` (modify)
- `src/features/products/components/ProductImage.tsx` (new, optional)

---

## Day 19 (Thursday) - State Management & Authentication

### 🎯 Ticket 4: Implement Authentication Context
**Priority**: P0 (Critical)

**Description**:
Create a Context-based authentication system to manage user login state across the application.

**Tasks**:
1. Create `src/features/auth/types.ts`
   - Define `User` interface: `id`, `username`, `email`, `firstName`, `lastName`, `image`
   - Define `LoginResponse` interface: extends User + `accessToken`

2. Create `src/features/auth/authApi.ts`
   - Implement `login({ username, password })`: POST `/auth/login`
   - Implement `getMe()`: GET `/auth/me` (to verify token and get current user)

3. Create `src/features/auth/AuthContext.tsx`
   - Create `AuthContext` with type:
     ```typescript
     interface AuthContextType {
       user: User | null;
       token: string | null;
       login: (username: string, password: string) => Promise<void>;
       logout: () => void;
     }
     ```
   - Implement `AuthProvider` component:
     - Initialize `token` from `localStorage.getItem('token')`
     - On mount, if token exists, call `getMe()` to restore user
     - `login()`: call API, save token to localStorage, set user state
     - `logout()`: clear token from localStorage, clear user state
   - Export `useAuth()` hook that throws error if used outside provider

4. Update `src/App.tsx`
   - Wrap app with `AuthProvider` (inside QueryClientProvider, outside RouterProvider)

**Acceptance Criteria**:
- ✅ Users can log in and token is persisted in localStorage
- ✅ User state is restored on page refresh if valid token exists
- ✅ Logout clears all authentication state
- ✅ `useAuth()` hook is available throughout the app

**Files to Create/Modify**:
- `src/features/auth/types.ts` (new)
- `src/features/auth/authApi.ts` (new)
- `src/features/auth/AuthContext.tsx` (new)
- `src/App.tsx` (modify)

**Test Credentials** (DummyJSON):
- Username: `emilys`
- Password: `emilyspass`

---

### 🎯 Ticket 5: Implement Cart with React Query Mutations
**Priority**: P0 (Critical)

**Description**:
Implement shopping cart functionality using React Query for server state management.

**Tasks**:
1. Create `src/features/cart/types.ts`
   - Define `CartItem` interface: `productId`, `quantity`, `priceAtAdd`
   - Define `Cart` interface: `userId`, `items: CartItem[]`, `total`

2. Create `src/features/cart/cartApi.ts`
   - Implement `getCart(userId: number)`: GET `/carts/user/${userId}`
   - Implement `addToCart(userId: number, item: CartItem)`: POST `/carts/add`
   - Implement `removeFromCart(userId: number, productId: number)`: DELETE `/carts/${userId}/product/${productId}`
   - Implement `clearCart(userId: number)`: DELETE `/carts/${userId}`

3. Create `src/features/cart/hooks/useCart.ts`
   - Implement `useCart(userId: number)` query hook
     - Query key: `['cart', userId]`
     - Enable only if `userId` exists
   - Implement `useAddCartItem(userId: number)` mutation hook
     - On success, update cache using `queryClient.setQueryData()`
   - Implement `useRemoveCartItem(userId: number)` mutation hook
     - On success, update cache
   - Implement `useClearCart(userId: number)` mutation hook
     - On success, update cache

4. Update `src/features/cart/pages/Cart.tsx`
   - Use `useAuth()` to get current user
   - Use `useCart(user?.id)` to fetch cart data
   - Display cart items in a table with product name, price, quantity, subtotal
   - Add "Remove" button for each item (uses `useRemoveCartItem`)
   - Show total price
   - Add "Clear Cart" button (uses `useClearCart`)
   - Show empty state if no items
   - Handle loading and error states

**Acceptance Criteria**:
- ✅ Cart data is fetched and displayed for logged-in users
- ✅ Users can remove individual items from cart
- ✅ Users can clear entire cart
- ✅ Cart updates are reflected immediately (optimistic updates via cache)
- ✅ Empty cart shows appropriate message

**Files to Create/Modify**:
- `src/features/cart/types.ts` (new)
- `src/features/cart/cartApi.ts` (new)
- `src/features/cart/hooks/useCart.ts` (new)
- `src/features/cart/pages/Cart.tsx` (modify)

---

### 🎯 Ticket 6: Implement User Profile Settings
**Priority**: P1 (High)

**Description**:
Create a settings page where users can view and update their profile information.

**Tasks**:
1. Create `src/features/settings/userApi.ts`
   - Implement `getUserProfile(userId: number)`: GET `/users/${userId}`
   - Implement `updateUserProfile(userId: number, data)`: PUT `/users/${userId}`

2. Create `src/features/settings/hooks/useUserProfile.ts`
   - Implement `useUserProfile(userId: number)` query hook
     - Query key: `['user', userId]`
     - Enable only if userId exists
   - Implement `useUpdateUserProfile(userId: number)` mutation hook
     - On success, update cache and return updated user

3. Create `src/utils/getErrorMessage.ts` helper
   - Function to extract error message from various error types

4. Update `src/features/settings/pages/Settings.tsx`
   - Create `ProfileForm` component with react-hook-form and zod validation
   - Fields: firstName, lastName, username, email, phone
   - Use `useUserProfile()` to fetch current profile
   - Use `useUpdateUserProfile()` mutation to save changes
   - Show success/error messages
   - Disable submit button if form is not dirty

**Acceptance Criteria**:
- ✅ User profile data is fetched and displayed
- ✅ Form validation works (using zod schema)
- ✅ Users can update their profile
- ✅ Success/error messages are displayed
- ✅ Form resets after successful update

**Files to Create/Modify**:
- `src/features/settings/userApi.ts` (new)
- `src/features/settings/hooks/useUserProfile.ts` (new)
- `src/utils/getErrorMessage.ts` (new)
- `src/features/settings/pages/Settings.tsx` (modify)

---

## Day 21 (Monday) - React Router Advanced

### 🎯 Ticket 7: Implement Protected Routes
**Priority**: P0 (Critical)

**Description**:
Create a ProtectedRoute component to restrict access to authenticated users only.

**Tasks**:
1. Create `src/router/ProtectedRoute.tsx`
   - Accept `children` as prop
   - Use `useAuth()` to check if user is authenticated (has token)
   - If not authenticated, redirect to `/login` using `<Navigate to="/login" replace />`
   - If authenticated, render children

2. Update `src/router/index.tsx`
   - Wrap `/cart` and `/settings` routes with `<ProtectedRoute>`
   - Keep other routes public

**Acceptance Criteria**:
- ✅ Unauthenticated users are redirected to login when accessing cart/settings
- ✅ Authenticated users can access protected routes
- ✅ Redirect preserves the intended destination (optional enhancement)

**Files to Create/Modify**:
- `src/router/ProtectedRoute.tsx` (new)
- `src/router/index.tsx` (modify)

---

### 🎯 Ticket 8: Implement Lazy Loading and Route Error Boundaries
**Priority**: P1 (High)

**Description**:
Optimize the application by implementing code-splitting with lazy loading and adding error boundaries for routes.

**Tasks**:
1. Update `src/router/index.tsx`
   - Convert all page imports to lazy imports using `React.lazy()`
   - Create `withBoundary` helper function that wraps routes with:
     - `<RouteErrorBoundary>` for error handling
     - `<Suspense>` for lazy loading with `<Spinner />` fallback
   - Apply `withBoundary` to all route elements
   - Change from `createBrowserRouter` to `createHashRouter` for GitHub Pages compatibility

2. Verify `src/components/errors/RouteErrorBoundary.tsx` exists
   - Should catch route-level errors and display error message
   - Should have a "Go Home" button

**Acceptance Criteria**:
- ✅ All pages are lazy-loaded (check Network tab for code splitting)
- ✅ Loading spinner shows while pages are loading
- ✅ Route errors are caught and displayed gracefully
- ✅ Hash router works correctly

**Files to Modify**:
- `src/router/index.tsx`

---

### 🎯 Ticket 9: Implement Product Filters with URL State
**Priority**: P1 (High)

**Description**:
Create an advanced filtering system that syncs with URL search parameters.

**Tasks**:
1. Create `src/features/products/hooks/useProductFilters.ts`
   - Define `ProductFilters` interface: `search`, `category`, `minPrice`, `maxPrice`, `minRating`, `onSale`
   - Use `useSearchParams` to sync filters with URL
   - Maintain two filter states:
     - `pendingFilters`: user's current selections (not yet applied)
     - `appliedFilters`: filters actually applied to products
   - Implement functions:
     - `updatePendingFilter(key, value)`: update pending filter
     - `applyFilters()`: sync pending to applied and update URL
     - `resetFilters()`: clear all filters
     - `hasUnappliedChanges`: boolean computed value

2. Update `src/features/products/components/ProductSidebarFilters.tsx`
   - Accept props: `filters`, `categories`, `onFilterChange`, `hasUnappliedChanges`, `onApply`, `onReset`
   - Show "Apply" and "Reset" buttons only when `hasUnappliedChanges` is true
   - Implement all filter controls:
     - Category dropdown (searchable, clearable)
     - Price range slider with min/max number inputs
     - Rating checkboxes (4+, 3+, 2+, 1+)
     - On Sale toggle switch

3. Update `src/features/products/pages/Products.tsx`
   - Use `useProductFilters()` hook
   - Implement client-side filtering logic in `useMemo`:
     - Filter by category
     - Filter by price range
     - Filter by minimum rating
     - Filter by discount (onSale)
   - Implement sorting functionality:
     - Add sort dropdown with options: price-asc, price-desc, rating-desc, title-asc
     - Sync sort with URL params
     - Apply sorting after filtering

**Acceptance Criteria**:
- ✅ All filters work correctly
- ✅ Filters sync with URL (can share filtered URLs)
- ✅ "Apply" button appears only when filters change
- ✅ Sorting works with all filter combinations
- ✅ Filter state persists on page refresh

**Files to Create/Modify**:
- `src/features/products/hooks/useProductFilters.ts` (new)
- `src/features/products/components/ProductSidebarFilters.tsx` (modify)
- `src/features/products/pages/Products.tsx` (modify)

---

## Day 22 (Tuesday) - Frontend MISC & Polish

### 🎯 Ticket 10: Implement Product Detail Page
**Priority**: P1 (High)

**Description**:
Create a detailed product view page with add to cart functionality.

**Tasks**:
1. Update `src/features/products/pages/ProductDetail.tsx`
   - Use `useParams()` to get product ID from URL
   - Use `useProduct(id)` hook to fetch product data
   - Display product information:
     - Image gallery (main image + thumbnails)
     - Title, brand, category
     - Price (with discount if applicable)
     - Rating and stock status
     - Full description
   - Add "Add to Cart" button
     - Use `useAddCartItem()` mutation
     - Disable if user not logged in (show "Login to Add to Cart")
     - Show loading state during mutation
   - Add "Back to Products" button

**Acceptance Criteria**:
- ✅ Product details are displayed correctly
- ✅ Users can add products to cart (if logged in)
- ✅ Loading and error states are handled
- ✅ Navigation works properly

**Files to Modify**:
- `src/features/products/pages/ProductDetail.tsx`

---

### 🎯 Ticket 11: Enhance Navbar with Cart Badge
**Priority**: P2 (Medium)

**Description**:
Update the navbar to show cart item count and user information.

**Tasks**:
1. Update `src/features/navbar/components/Navbar.tsx`
   - Use `useAuth()` to get current user
   - If user is logged in:
     - Use `useCart(user.id)` to get cart data
     - Display cart item count as a badge on the cart icon
     - Show user's name or username
     - Add logout button
   - If not logged in:
     - Show "Login" and "Sign Up" links

**Acceptance Criteria**:
- ✅ Cart badge shows correct item count
- ✅ User information is displayed when logged in
- ✅ Logout button works correctly
- ✅ Login/Signup links show when not authenticated

**Files to Modify**:
- `src/features/navbar/components/Navbar.tsx`

---

### 🎯 Ticket 12: Implement Home Page
**Priority**: P2 (Medium)

**Description**:
Create an engaging home page with featured products and categories.

**Tasks**:
1. Update `src/features/products/pages/Home.tsx`
   - Use `useProducts()` to fetch all products
   - Use `useCategories()` to fetch categories
   - Display sections:
     - Hero section with app title and CTA button
     - Featured products (first 8 products)
     - Category cards (clickable, navigate to products page with category filter)
   - Use Mantine Grid for responsive layout

**Acceptance Criteria**:
- ✅ Home page displays featured products
- ✅ Category cards are clickable and filter products
- ✅ Page is responsive and visually appealing
- ✅ CTA button navigates to products page

**Files to Modify**:
- `src/features/products/pages/Home.tsx`

---

### 🎯 Ticket 13: Polish Login and Signup Pages
**Priority**: P2 (Medium)

**Description**:
Enhance the authentication pages with proper form handling and validation.

**Tasks**:
1. Update `src/features/auth/pages/Login.tsx`
   - Use react-hook-form with zod validation
   - Implement login form with username and password fields
   - Use `useAuth()` login function
   - Handle errors and display error messages
   - Redirect to home page on successful login
   - Add link to signup page

2. Update `src/features/auth/pages/Signup.tsx`
   - Add informational message that signup is not available (DummyJSON limitation)
   - Show test credentials for demo
   - Add link back to login page

**Acceptance Criteria**:
- ✅ Login form has proper validation
- ✅ Error messages are displayed clearly
- ✅ Successful login redirects to home
- ✅ Signup page explains the limitation

**Files to Modify**:
- `src/features/auth/pages/Login.tsx`
- `src/features/auth/pages/Signup.tsx`

---

## 🎁 Bonus Tickets (Optional)

### 🎯 Bonus 1: Add Search Functionality to Navbar
**Priority**: P3 (Nice to have)

**Description**:
Add a search bar to the navbar that filters products.

**Tasks**:
- Add search input to navbar
- On submit, navigate to `/products?search=query`
- Products page should use the search param to filter products

---

### 🎯 Bonus 2: Implement Optimistic Updates for Cart
**Priority**: P3 (Nice to have)

**Description**:
Improve UX by implementing optimistic updates for cart mutations.

**Tasks**:
- Update cart mutation hooks to use `onMutate` for optimistic updates
- Implement rollback on error using `onError`
- Show instant feedback when adding/removing items

---

### 🎯 Bonus 3: Add Product Reviews Section
**Priority**: P3 (Nice to have)

**Description**:
Display product reviews on the product detail page.

**Tasks**:
- Fetch reviews from DummyJSON API
- Display reviews with rating, comment, and reviewer name
- Add pagination or "Load More" functionality

---

## 📝 Testing Checklist

Before submitting, ensure:

- [ ] All pages load without errors
- [ ] Login/logout flow works correctly
- [ ] Protected routes redirect unauthenticated users
- [ ] Cart operations work (add, remove, clear)
- [ ] Product filters and sorting work
- [ ] URL state syncs with filters
- [ ] Form validations work on all forms
- [ ] Loading states show appropriately
- [ ] Error states are handled gracefully
- [ ] Application is responsive on mobile/tablet/desktop
- [ ] No console errors or warnings

---

## 🚀 Submission Guidelines

1. Ensure all tickets P0 and P1 are completed
2. Test all functionality thoroughly
3. Run `npm run build` to ensure production build works
4. Commit your code with meaningful commit messages
5. Push to your repository
6. Deploy to GitHub Pages (optional)

---

## 📚 Resources

- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [React Router Documentation](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Mantine UI](https://mantine.dev/)
- [DummyJSON API](https://dummyjson.com/)

---

## 💡 Tips

1. **Start with infrastructure**: Complete Tickets 1-2 first to establish the foundation
2. **Test incrementally**: Don't wait until the end to test features
3. **Use TypeScript**: Leverage type safety to catch errors early
4. **Read the docs**: React Query and React Router have excellent documentation
5. **Ask for help**: Don't spend more than 30 minutes stuck on one issue
6. **Commit often**: Make small, focused commits with clear messages
7. **Code organization**: Keep related code together in feature folders
8. **Reuse components**: Look for opportunities to create reusable components

Good luck! 🎉
