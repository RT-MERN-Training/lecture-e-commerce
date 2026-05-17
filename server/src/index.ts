import "dotenv/config";
import express from "express";
import cors from "cors";
import productRoutes from "./modules/products/product.routes";
import cartRoutes from "./modules/carts/cart.routes";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import { errorMiddleware } from "./core/errors";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes — no orders (DummyJSON has no Orders API).
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Lecture E-Commerce API is running", port: PORT });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
