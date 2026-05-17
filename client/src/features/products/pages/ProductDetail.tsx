import { Badge, Button, Container, Grid, Group, Text, Title } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import { Spinner } from '../../../components/ui/Spinner';
import { useAuth } from '../../auth/AuthContext';
import { useAddCartItem } from '../../cart/hooks/useCart';
import { ProductImage } from '../components/ProductImage';
import { useProduct } from '../hooks/useProducts';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: product, isLoading, error } = useProduct(Number(id));
  const addCartItemMutation = useAddCartItem(user?.id ?? 0);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (product) {
      addCartItemMutation.mutate({
        productId: product.id,
        quantity: 1,
        priceAtAdd: product.price,
      });
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !product) {
    return (
      <Container mt="xl">
        <ErrorMessage message="Product not found" />
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <ProductImage src={product.thumbnail} alt={product.title} height={400} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={1} mb="md">
            {product.title}
          </Title>
          <Group mb="md">
            <Badge size="lg" color="pink">
              ${product.price}
            </Badge>
            <Badge size="lg" color="blue">
              {product.category}
            </Badge>
            {product.discountPercentage > 0 && (
              <Badge size="lg" color="red">
                -{Math.round(product.discountPercentage)}% OFF
              </Badge>
            )}
          </Group>
          <Text size="lg" mb="md">
            {product.description}
          </Text>
          {product.brand && (
            <Text size="md" mb="sm" c="dimmed">
              Brand: {product.brand}
            </Text>
          )}
          <Text size="md" mb="xl" c="dimmed">
            Stock: {product.stock} units available
          </Text>
          <Group>
            <Button
              size="lg"
              onClick={handleAddToCart}
              loading={addCartItemMutation.isPending}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/products')}>
              Back to Products
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
