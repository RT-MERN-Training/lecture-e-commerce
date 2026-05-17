import axiosClient from '../../lib/axiosClient';
import type { Cart, CartItem } from './types';

interface DummyCartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

interface DummyCart {
  id: number;
  products: DummyCartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

interface DummyCartsResponse {
  carts: DummyCart[];
  total: number;
  skip: number;
  limit: number;
}

const toLocalCart = (dummy: DummyCart): Cart => ({
  id: dummy.id,
  userId: dummy.userId,
  items: dummy.products.map((p) => ({
    productId: p.id,
    quantity: p.quantity,
    priceAtAdd: p.price,
  })),
  totalAmount: dummy.total,
});

export const getCart = async (userId: number): Promise<Cart> => {
  const response = await axiosClient.get<DummyCartsResponse>(`/carts/user/${userId}`);
  const carts = response.data.carts;
  if (carts.length > 0) {
    return toLocalCart(carts[0]);
  }
  // Return empty cart when user has no cart
  return { id: 0, userId, items: [], totalAmount: 0 };
};

export const addToCart = async (userId: number, item: CartItem): Promise<Cart> => {
  const existing = await getCart(userId);

  const existingItemIndex = existing.items.findIndex((i) => i.productId === item.productId);
  let updatedItems: CartItem[];

  if (existingItemIndex >= 0) {
    updatedItems = existing.items.map((i, idx) =>
      idx === existingItemIndex ? { ...i, quantity: i.quantity + item.quantity } : i
    );
  } else {
    updatedItems = [...existing.items, item];
  }

  const totalAmount = updatedItems.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);

  if (existing.id === 0) {
    const response = await axiosClient.post<DummyCart>('/carts/add', {
      userId,
      products: updatedItems.map((i) => ({ id: i.productId, quantity: i.quantity })),
    });
    return toLocalCart(response.data);
  }

  const response = await axiosClient.put<DummyCart>(`/carts/${existing.id}`, {
    merge: true,
    products: [{ id: item.productId, quantity: item.quantity }],
  });
  // DummyJSON may not return the full updated cart — merge locally
  return { ...toLocalCart(response.data), items: updatedItems, totalAmount };
};

export const removeFromCart = async (userId: number, productId: number): Promise<Cart> => {
  const existing = await getCart(userId);
  const updatedItems = existing.items.filter((i) => i.productId !== productId);
  const totalAmount = updatedItems.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);

  if (existing.id !== 0) {
    await axiosClient.put<DummyCart>(`/carts/${existing.id}`, {
      products: updatedItems.map((i) => ({ id: i.productId, quantity: i.quantity })),
    });
  }

  return { ...existing, items: updatedItems, totalAmount };
};

export const clearCart = async (userId: number): Promise<Cart> => {
  const existing = await getCart(userId);

  if (existing.id !== 0) {
    await axiosClient.delete(`/carts/${existing.id}`);
  }

  return { ...existing, items: [], totalAmount: 0 };
};
