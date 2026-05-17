import { useMemo } from 'react';
import { Box, Container, Flex, Grid, Group, Select, Text, Title } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';

import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import { Spinner } from '../../../components/ui/Spinner';
import { ProductCard } from '../components/ProductCard';
import { ProductSidebarFilters } from '../components/ProductSidebarFilters';
import { useProductFilters } from '../hooks/useProductFilters';
import { useCategories, useProducts } from '../hooks/useProducts';
import type { Product } from '../types';

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'rating-desc', label: 'Rating (High to Low)' },
  { value: 'title-asc', label: 'Name (A-Z)' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';
  const sortParam = searchParams.get('sort') ?? 'price-asc';

  const {
    pendingFilters,
    appliedFilters,
    updatePendingFilter,
    applyFilters,
    resetFilters,
    hasUnappliedChanges,
  } = useProductFilters();

  const { data: allProducts, isLoading, error } = useProducts(searchQuery || undefined);
  const { data: categories = [] } = useCategories();

  const [sortBy, sortOrder] = sortParam.split('-') as [string, 'asc' | 'desc'];

  const products = useMemo(() => {
    if (!allProducts) return [];

    let filtered = [...allProducts];

    if (appliedFilters.category) {
      filtered = filtered.filter((p) => p.category === appliedFilters.category);
    }

    if (appliedFilters.minPrice > 0) {
      filtered = filtered.filter((p) => p.price >= appliedFilters.minPrice);
    }

    if (appliedFilters.maxPrice < 2000) {
      filtered = filtered.filter((p) => p.price <= appliedFilters.maxPrice);
    }

    if (appliedFilters.minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= appliedFilters.minRating);
    }

    if (appliedFilters.onSale) {
      filtered = filtered.filter((p) => p.discountPercentage > 0);
    }

    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof Product];
      const bVal = b[sortBy as keyof Product];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return filtered;
  }, [allProducts, appliedFilters, sortBy, sortOrder]);

  const handleSortChange = (value: string | null) => {
    if (!value) return;
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Our Products
      </Title>
      <Flex gap="xl" align="flex-start">
        <Box style={{ width: 280, flexShrink: 0 }}>
          <ProductSidebarFilters
            filters={pendingFilters}
            categories={categories}
            onFilterChange={updatePendingFilter}
            hasUnappliedChanges={hasUnappliedChanges}
            onApply={applyFilters}
            onReset={resetFilters}
          />
        </Box>

        <Box style={{ flex: 1 }}>
          <Group justify="space-between" mb="xl">
            <Text size="sm" c="dimmed">
              {!isLoading && `${products?.length || 0} products found`}
            </Text>
            <Select
              placeholder="Sort by"
              data={SORT_OPTIONS}
              value={sortParam}
              onChange={handleSortChange}
              style={{ width: 200 }}
            />
          </Group>
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <ErrorMessage message={error.message || 'Failed to load products'} />
          ) : (
            <Grid>
              {products?.map((product) => (
                <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <ProductCard product={product} />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default Products;
