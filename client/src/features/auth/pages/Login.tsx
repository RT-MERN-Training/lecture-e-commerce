import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Anchor,
  Button,
  Card,
  Container,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import getErrorMessage from '../../../utils/getErrorMessage';
import { useAuth } from '../AuthContext';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  if (user) {
    navigate('/');
    return null;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
      navigate('/');
    } catch (err) {
      setError('root', { message: getErrorMessage(err) });
    }
  };

  return (
    <Container size="xs" py="xl">
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Title order={2} mb="md" ta="center">
          Login
        </Title>

        {errors.root && (
          <Alert color="red" mb="md">
            {errors.root.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Username"
            placeholder="emilys"
            error={errors.username?.message}
            mb="md"
            {...register('username')}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter password"
            error={errors.password?.message}
            mb="xl"
            {...register('password')}
          />
          <Button type="submit" fullWidth loading={isSubmitting}>
            Login
          </Button>
        </form>

        <Text size="sm" c="dimmed" mt="md" ta="center">
          Try: <strong>emilys</strong> / <strong>emilyspass</strong>
        </Text>
        <Text size="sm" c="dimmed" mt="xs" ta="center">
          Don&apos;t have an account?{' '}
          <Anchor component={Link} to="/signup">
            Sign up
          </Anchor>
        </Text>
      </Card>
    </Container>
  );
};

export default Login;
