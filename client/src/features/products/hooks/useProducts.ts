import { useQuery } from '@tanstack/react-query';

import { getCategories, getProductById, getProducts, searchProducts } from '../productApi';

export const useProducts = (search?: string) => {
  return useQuery({
    queryKey: ['products', search ?? ''],
    queryFn: () => (search ? searchProducts(search) : getProducts()),
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: Infinity,
  });
};
