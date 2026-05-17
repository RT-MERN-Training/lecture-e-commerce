import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import GlobalErrorPage from "../components/errors/GlobalErrorPage";
import RouteErrorBoundary from "../components/errors/RouteErrorBoundary";
import RootLayout from "../components/layout/RootLayout";
import { Spinner } from "../components/ui/Spinner";
import { ProtectedRoute } from "./ProtectedRoute";

const Home = lazy(() => import("../features/products/pages/Home"));
const Products = lazy(() => import("../features/products/pages/Products"));
const ProductDetail = lazy(
  () => import("../features/products/pages/ProductDetail"),
);
const Cart = lazy(() => import("../features/cart/pages/Cart"));
const Login = lazy(() => import("../features/auth/pages/Login"));
const Signup = lazy(() => import("../features/auth/pages/Signup"));
const Settings = lazy(() => import("../features/settings/pages/Settings"));

const withBoundary = (name: string, children: ReactNode) => (
  <RouteErrorBoundary name={name}>
    <Suspense fallback={<></> || <Spinner />}>{children}</Suspense>
  </RouteErrorBoundary>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <GlobalErrorPage />,
    children: [
      { index: true, element: withBoundary("Home", <Home />) },
      { path: "products", element: withBoundary("Products", <Products />) },
      {
        path: "products/:id",
        element: withBoundary("ProductDetail", <ProductDetail />),
      },
      { path: "login", element: withBoundary("Login", <Login />) },
      { path: "signup", element: withBoundary("Signup", <Signup />) },
      {
        path: "cart",
        element: withBoundary(
          "Cart",
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>,
        ),
      },
      {
        path: "settings",
        element: withBoundary(
          "Settings",
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>,
        ),
      },
    ],
  },
]);
