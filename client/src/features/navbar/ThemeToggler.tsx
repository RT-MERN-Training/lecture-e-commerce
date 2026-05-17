import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export const ThemeToggler = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      variant="subtle"
      color={colorScheme === 'dark' ? 'yellow' : 'blue'}
      onClick={() => toggleColorScheme()}
      size="lg"
      radius="md"
      aria-label="Toggle color scheme"
    >
      {colorScheme === 'dark' ? (
        <IconSun size={20} stroke={1.5} />
      ) : (
        <IconMoon size={20} stroke={1.5} />
      )}
    </ActionIcon>
  );
};
