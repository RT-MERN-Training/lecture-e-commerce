import axiosClient from '../../lib/axiosClient';
import type { Product, ProductsResponse } from './types';

export const getProducts = async (): Promise<Product[]> => {
  const response = await axiosClient.get<ProductsResponse>('/products?limit=100');
  return response.data.products;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await axiosClient.get<Product>(`/products/${id}`);
  return response.data;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await axiosClient.get<ProductsResponse>(
    `/products/search?q=${encodeURIComponent(query)}&limit=100`
  );
  return response.data.products;
};

export const getCategories = async (): Promise<string[]> => {
  const response = await axiosClient.get<{ slug: string; name: string; url: string }[]>(
    '/products/categories'
  );
  return response.data.map((c) => c.slug);
};
