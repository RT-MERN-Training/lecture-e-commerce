import { Container, Group, Text } from '@mantine/core';

export const Footer = () => {
  return (
    <Container
      fluid
      p="md"
      style={{
        borderTop: '1px solid #e9ecef',
        marginTop: 'auto',
      }}
    >
      <Group justify="center">
        <Text size="sm" c="dimmed">
          © 2024 E-Commerce Store. All rights reserved.
        </Text>
      </Group>
    </Container>
  );
};
