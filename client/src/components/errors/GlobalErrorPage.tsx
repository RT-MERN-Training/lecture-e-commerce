import { Button, Code, Container, Stack, Text, Title } from '@mantine/core';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

const GlobalErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred. Please try again.';
  let details: string | undefined;

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data?.message ?? message;
  } else if (error instanceof Error) {
    details = `${error.name}: ${error.message}`;
  }

  console.error('GlobalErrorPage caught:', error);

  return (
    <Container size="sm" py="xl">
      <Stack gap="md" align="center" ta="center">
        <Title order={1}>{title}</Title>
        <Text c="dimmed">{message}</Text>
        {details && (
          <Code block style={{ textAlign: 'left', width: '100%' }}>
            {details}
          </Code>
        )}
        <Stack gap="xs">
          <Button onClick={() => navigate('/')}>Go Home</Button>
          <Button variant="subtle" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default GlobalErrorPage;
