import { Center, Loader } from '@mantine/core';

export const Spinner = () => {
  return (
    <Center style={{ minHeight: '200px' }}>
      <Loader size="lg" />
    </Center>
  );
};
