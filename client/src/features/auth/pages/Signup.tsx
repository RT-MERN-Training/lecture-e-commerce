import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Anchor,
  Button,
  Card,
  Container,
  Group,
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

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  if (user) {
    navigate('/');
    return null;
  }

  const onSubmit = async (data: SignupFormData) => {
    try {
      // DummyJSON does not have a real signup endpoint that persists users.
      // We simulate it by logging in with a known test account so the UI
      // flow still works end-to-end for demo / lecture purposes.
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
          Create an account
        </Title>

        <Alert color="yellow" mb="md">
          DummyJSON does not support real user registration. Use an existing
          test account on the Login page instead.
        </Alert>

        {errors.root && (
          <Alert color="red" mb="md">
            {errors.root.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Group grow mb="md">
            <TextInput
              label="First name"
              placeholder="Jane"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <TextInput
              label="Last name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </Group>
          <TextInput
            label="Username"
            placeholder="janedoe"
            error={errors.username?.message}
            mb="md"
            {...register('username')}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="jane@example.com"
            error={errors.email?.message}
            mb="md"
            {...register('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="At least 6 characters"
            error={errors.password?.message}
            mb="xl"
            {...register('password')}
          />
          <Button type="submit" fullWidth loading={isSubmitting}>
            Sign up
          </Button>
        </form>

        <Text size="sm" c="dimmed" mt="md" ta="center">
          Already have an account?{' '}
          <Anchor component={Link} to="/login">
            Log in
          </Anchor>
        </Text>
      </Card>
    </Container>
  );
};

export default Signup;
