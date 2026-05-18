import {
  Button,
  Card,
  Container,
  Group,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Spinner } from "../../../components/ui/Spinner";
import { useAuth } from "../../auth/AuthContext";
import { useProducts } from "../../products/hooks/useProducts";
import { useCart, useClearCart, useRemoveCartItem } from "../hooks/useCart";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: cart, isLoading, error } = useCart(user?.id ?? 0);
  const removeCartItemMutation = useRemoveCartItem(user?.id ?? 0);
  const clearCartMutation = useClearCart(user?.id ?? 0);
  const { data: products } = useProducts();

  const handleRemove = (productId: number) => {
    if (!user?.id) return;
    removeCartItemMutation.mutate(productId);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Container mt="xl">
        <ErrorMessage message="Failed to load cart" />
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container size="md" py="xl">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Title order={2} mb="md">
            Your Cart is Empty
          </Title>
          <Text mb="xl">Start shopping to add items to your cart!</Text>
          <Button onClick={() => navigate("/products")}>Browse Products</Button>
        </Card>
      </Container>
    );
  }

  const getProductName = (productId: number) => {
    const product = products?.find((p) => p.id === productId);
    return product?.title || `Product #${productId}`;
  };

  const total = cart.items.reduce(
    (sum, item) => sum + item.priceAtAdd * item.quantity,
    0,
  );

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">
        Shopping Cart
      </Title>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Subtotal</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {cart.items.map((item) => (
            <Table.Tr key={item.productId}>
              <Table.Td>{getProductName(item.productId)}</Table.Td>
              <Table.Td>${item.priceAtAdd.toFixed(2)}</Table.Td>
              <Table.Td>{item.quantity}</Table.Td>
              <Table.Td>
                ${(item.priceAtAdd * item.quantity).toFixed(2)}
              </Table.Td>
              <Table.Td>
                <Button
                  color="red"
                  size="xs"
                  onClick={() => handleRemove(item.productId)}
                  loading={removeCartItemMutation.isPending}
                >
                  Remove
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="flex-end" mt="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Total: ${total.toFixed(2)}
          </Title>
          <Group>
            <Button
              variant="outline"
              color="red"
              onClick={() => clearCartMutation.mutate()}
              loading={clearCartMutation.isPending}
            >
              Clear Cart
            </Button>
            <Button size="lg" onClick={() => navigate("/products")}>
              Continue Shopping
            </Button>
          </Group>
        </Card>
      </Group>
    </Container>
  );
};

export default Cart;
