import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface ProductFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  onSale: boolean;
}

const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  category: '',
  minPrice: 0,
  maxPrice: 2000,
  minRating: 0,
  onSale: false,
};

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialFilters = (): ProductFilters => ({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 2000,
    minRating: Number(searchParams.get('minRating')) || 0,
    onSale: searchParams.get('onSale') === 'true',
  });

  const [pendingFilters, setPendingFilters] = useState<ProductFilters>(getInitialFilters);
  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>(getInitialFilters);

  const updatePendingFilter = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    setPendingFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (pendingFilters.search) params.set('search', pendingFilters.search);
    if (pendingFilters.category) params.set('category', pendingFilters.category);
    if (pendingFilters.minPrice > 0) params.set('minPrice', String(pendingFilters.minPrice));
    if (pendingFilters.maxPrice < 2000) params.set('maxPrice', String(pendingFilters.maxPrice));
    if (pendingFilters.minRating > 0) params.set('minRating', String(pendingFilters.minRating));
    if (pendingFilters.onSale) params.set('onSale', 'true');

    setSearchParams(params);
    setAppliedFilters(pendingFilters);
  };

  const resetFilters = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setSearchParams(new URLSearchParams());
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const hasUnappliedChanges = JSON.stringify(pendingFilters) !== JSON.stringify(appliedFilters);

  return {
    pendingFilters,
    appliedFilters,
    updatePendingFilter,
    applyFilters,
    resetFilters,
    hasUnappliedChanges,
  };
};
