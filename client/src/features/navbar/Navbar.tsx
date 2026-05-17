import { Avatar, Button, Group, Indicator, Menu, Text } from '@mantine/core';
import {
  IconChevronDown,
  IconLogin,
  IconLogout,
  IconSettings,
  IconShoppingCart,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../features/auth/AuthContext';
import { useCart } from '../../features/cart/hooks/useCart';
import { SearchBar } from './SearchBar';
import { ThemeToggler } from './ThemeToggler';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: cart } = useCart(user?.id ?? 0);
  const totalItemsCount = cart?.items.reduce((count: number, item: { quantity: number }) => count + item.quantity, 0) ?? 0;

  return (
    <Group justify="space-between" p="md" style={{ borderBottom: '1px solid #e9ecef' }}>
      <Text size="xl" fw={700} style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        E-Commerce Store
      </Text>

      <SearchBar />

      <Group>
        <ThemeToggler />
        <Indicator label={totalItemsCount} size={16} color="red" position="middle-start">
          <Button
            variant="subtle"
            leftSection={<IconShoppingCart size={18} />}
            onClick={() => navigate('/cart')}
          >
            Cart
          </Button>
        </Indicator>

        {user ? (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle" rightSection={<IconChevronDown size={16} />}>
                <Group gap="xs">
                  <Avatar src={user.image} alt={user.username} size="sm" />
                  <Text size="sm">{user.username}</Text>
                </Group>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item
                leftSection={<IconSettings size={16} />}
                onClick={() => navigate('/settings')}
              >
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconLogout size={16} />} color="red" onClick={logout}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Button
            variant="filled"
            leftSection={<IconLogin size={18} />}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </Group>
    </Group>
  );
};
