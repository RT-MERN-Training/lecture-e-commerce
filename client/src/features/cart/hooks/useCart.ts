import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { addToCart, clearCart, getCart, removeFromCart } from '../cartApi';
import type { Cart, CartItem } from '../types';

const cartQueryKey = (userId: number) => ['cart', userId] as const;

export const useCart = (userId: number) => {
  return useQuery({
    queryKey: cartQueryKey(userId),
    queryFn: () => getCart(userId),
    enabled: !!userId,
  });
};

export const useAddCartItem = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: CartItem) => addToCart(userId, item),
    onSuccess: (cart: Cart) => {
      queryClient.setQueryData(cartQueryKey(userId), cart);
    },
  });
};

export const useRemoveCartItem = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => removeFromCart(userId, productId),
    onSuccess: (cart: Cart) => {
      queryClient.setQueryData(cartQueryKey(userId), cart);
    },
  });
};

export const useClearCart = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCart(userId),
    onSuccess: (cart: Cart) => {
      queryClient.setQueryData(cartQueryKey(userId), cart);
    },
  });
};
