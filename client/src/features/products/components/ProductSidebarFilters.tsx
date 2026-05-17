import {
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  NumberInput,
  RangeSlider,
  Select,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { IconStar, IconStarFilled } from '@tabler/icons-react';

import type { ProductFilters } from '../hooks/useProductFilters';

interface ProductSidebarFiltersProps {
  filters: ProductFilters;
  categories: string[];
  onFilterChange: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
  hasUnappliedChanges: boolean;
  onApply: () => void;
  onReset: () => void;
}

const RATINGS = [4, 3, 2, 1];

export const ProductSidebarFilters = ({
  filters,
  categories,
  onFilterChange,
  hasUnappliedChanges,
  onApply,
  onReset,
}: ProductSidebarFiltersProps) => {
  const categoryData = [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({ value: c, label: c.replace(/-/g, ' ') })),
  ];

  return (
    <Stack gap="md">
      <Box p="md" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <Stack gap="xl">
          <Stack gap="sm">
            <Group gap="sm" wrap="nowrap">
              <Title order={3}>Filters</Title>
              {hasUnappliedChanges && (
                <>
                  <Button size="xs" onClick={onApply}>
                    Apply
                  </Button>
                  <Button size="xs" variant="outline" onClick={onReset}>
                    Reset
                  </Button>
                </>
              )}
            </Group>
          </Stack>

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Category
            </Text>
            <Select
              data={categoryData}
              value={filters.category}
              onChange={(val) => onFilterChange('category', val ?? '')}
              placeholder="All Categories"
              searchable
              clearable
            />
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Price Range
            </Text>
            <RangeSlider
              min={0}
              max={2000}
              step={50}
              value={[filters.minPrice, filters.maxPrice]}
              onChange={(value) => {
                const [min, max] = value;
                onFilterChange('minPrice', min);
                onFilterChange('maxPrice', max);
              }}
              marks={[
                { value: 0, label: '$0' },
                { value: 2000, label: '$2000' },
              ]}
              mb="md"
            />
            <Group grow>
              <NumberInput
                label="Min"
                value={filters.minPrice}
                onChange={(val) => onFilterChange('minPrice', Number(val) || 0)}
                min={0}
                max={filters.maxPrice}
                prefix="$"
              />
              <NumberInput
                label="Max"
                value={filters.maxPrice}
                onChange={(val) => onFilterChange('maxPrice', Number(val) || 2000)}
                min={filters.minPrice}
                max={2000}
                prefix="$"
              />
            </Group>
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Rating
            </Text>
            <Stack gap="xs">
              {RATINGS.map((rating) => (
                <Group
                  key={rating}
                  gap="xs"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onFilterChange('minRating', rating)}
                >
                  <Checkbox
                    checked={filters.minRating === rating}
                    onChange={() => onFilterChange('minRating', rating)}
                  />
                  <Group gap={2}>
                    {[...Array(rating)].map((_, i) => (
                      <IconStarFilled key={i} size={16} color="#ffd43b" />
                    ))}
                    {[...Array(5 - rating)].map((_, i) => (
                      <IconStar key={i} size={16} color="#868e96" />
                    ))}
                  </Group>
                  <Text size="sm">& up</Text>
                </Group>
              ))}
            </Stack>
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Deals
            </Text>
            <Switch
              label="On Sale / Discounted"
              checked={filters.onSale}
              onChange={(e) => onFilterChange('onSale', e.currentTarget.checked)}
            />
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};
