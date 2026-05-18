import type { Request, Response } from "express";
import { cartService, CartService } from "./cart.service";
import {
  createCartSchema,
  updateCartSchema,
  addCartItemSchema,
  cartIdParamSchema,
  cartQuerySchema,
  userIdParamSchema,
  paginationQuerySchema,
} from "./validator";

export class CartController {
  constructor(private readonly carts: CartService = cartService) {}

  // GET /carts or GET /carts?userId=...
  list = async (req: Request, res: Response) => {
    const { userId } = cartQuerySchema.parse(req.query);
    if (userId) {
      const cart = await this.carts.getCartForUser(userId);
      return res.json(cart);
    }
    const all = await this.carts.listCarts();
    res.json(all);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = cartIdParamSchema.parse(req.params);
    const cart = await this.carts.getCartById(id);
    res.json(cart);
  };

  getCartByUserId = async (req: Request, res: Response) => {
    const { userId } = userIdParamSchema.parse(req.params);
    const { skip, limit } = paginationQuerySchema.parse(req.query);
    const paginatedResponse = await this.carts.getCartByUserIdPaginated(userId, skip, limit);
    res.json(paginatedResponse);
  };

  create = async (req: Request, res: Response) => {
    const { userId } = createCartSchema.parse(req.body);
    const created = await this.carts.createCart(userId);
    res.status(201).json(created);
  };

  update = async (req: Request, res: Response) => {
    const { id } = cartIdParamSchema.parse(req.params);
    const input = updateCartSchema.parse(req.body);
    const updated = await this.carts.updateCart(id, input);
    res.json(updated);
  };

  addItem = async (req: Request, res: Response) => {
    const { id } = cartIdParamSchema.parse(req.params);
    const item = addCartItemSchema.parse(req.body);
    const updated = await this.carts.addItem(id, item);
    res.json(updated);
  };

  remove = async (req: Request, res: Response) => {
    const { id } = cartIdParamSchema.parse(req.params);
    await this.carts.deleteCart(id);
    res.status(204).send();
  };
}

export const cartController = new CartController();
export default cartController;
