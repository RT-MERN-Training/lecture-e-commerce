import { useMemo } from "react";
import {
  Badge,
  Box,
  Card,
  Container,
  Grid,
  Group,
  Image,
  Loader,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

import HomeInfoSection from "../../../components/home/HomeInfoSection";
import { Spinner } from "../../../components/ui/Spinner";
import { useProducts } from "../hooks/useProducts";

const Home = () => {
  return (
    <Container size="xl" py="xl">
      <Box mb="xl" ta="center">
        <Title order={1} mb="md">
          Welcome to E-Commerce Store
        </Title>
        <Text size="lg" c="dimmed">
          Discover amazing products across all categories
        </Text>
      </Box>

      <Recommendations />

      <HomeInfoSection />
    </Container>
  );
};

const Recommendations = () => {
  const navigate = useNavigate();
  const { data: allProducts, isLoading, error } = useProducts();

  const recommendedProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.slice(0, 4);
  }, [allProducts]);

  console.log("loading", isLoading);

  if (isLoading) {
    return (
      <Box mb="xl">
        <Title order={2} mb="md">
          ✨ Recommended for You
        </Title>
        <Grid>
          {[1, 2, 3, 4].map((i) => (
            <Grid.Col key={i} span={{ base: 12, sm: 6, md: 3 }}>
              <Skeleton height={200} mb="md" />
              <Skeleton height={20} width="70%" mb="sm" />
              <Skeleton height={16} width="40%" />
            </Grid.Col>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error || !recommendedProducts || recommendedProducts.length === 0) {
    return null;
  }

  return (
    <Box mb="xl">
      <Title order={2} mb="md">
        ✨ Recommended for You
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        {recommendedProducts.map((product) => (
          <Card
            key={product.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ cursor: "pointer", height: "100%" }}
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <Card.Section>
              <Image src={product.thumbnail} height={160} alt={product.title} />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500} lineClamp={1}>
                {product.title}
              </Text>
            </Group>

            <Group justify="space-between">
              <Text size="xl" fw={700} c="blue">
                ${product.price}
              </Text>
              {product.discountPercentage > 0 && (
                <Badge color="red" variant="filled">
                  -{Math.round(product.discountPercentage)}%
                </Badge>
              )}
            </Group>

            <Group gap={4} mt="xs">
              <Text size="sm" c="dimmed">
                ⭐ {product.rating}
              </Text>
              <Text size="sm" c="dimmed">
                • {product.stock} in stock
              </Text>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Home;
