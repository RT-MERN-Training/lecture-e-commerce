import { Badge, Button, Card, Group, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import type { Product } from '../types';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <ProductImage src={product.thumbnail} alt={product.title} height={160} />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} lineClamp={1} style={{ flex: 1 }}>
          {product.title}
        </Text>
        <Badge color="pink">${product.price}</Badge>
      </Group>

      <Text size="sm" c="dimmed" lineClamp={2}>
        {product.description}
      </Text>

      <Group>
        <Text size="sm" mt="xs">
          Stock: {product.stock}
        </Text>
        <Text size="sm" mt="xs">
          Rating: {product.rating}
        </Text>
      </Group>

      <Button
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        View Details
      </Button>
    </Card>
  );
};
