import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Container, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Spinner } from '../../../components/ui/Spinner';
import getErrorMessage from '../../../utils/getErrorMessage';
import { useAuth } from '../../auth/AuthContext';
import type { User } from '../../auth/types';
import { useUpdateUserProfile, useUserProfile } from '../hooks/useUserProfile';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileForm = ({ profile, userId }: { profile: User; userId: number }) => {
  const updateUserProfileMutation = useUpdateUserProfile(userId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setError,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      username: profile.username || '',
      email: profile.email || '',
      phone: profile.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updated = await updateUserProfileMutation.mutateAsync(data);
      reset({
        firstName: updated.firstName,
        lastName: updated.lastName,
        username: updated.username,
        email: updated.email,
        phone: updated.phone || '',
      });
    } catch (err) {
      setError('root', { message: getErrorMessage(err) });
    }
  };

  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <Title order={3} mb="md">
        Profile
      </Title>

      {errors.root && (
        <Text c="red" mb="md">
          {errors.root.message}
        </Text>
      )}
      {updateUserProfileMutation.isSuccess && !errors.root && (
        <Text c="green" mb="md">
          Profile updated.
        </Text>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Group grow>
            <TextInput
              label="First name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <TextInput
              label="Last name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Username"
              error={errors.username?.message}
              {...register('username')}
            />
            <TextInput
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />
          </Group>
          <TextInput
            label="Phone"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </Stack>

        <Group justify="flex-end" mt="xl">
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Save changes
          </Button>
        </Group>
      </form>
    </Card>
  );
};

const Settings = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useUserProfile(user?.id ?? 0);

  if (!user) {
    return (
      <Container size="md" py="xl">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Text ta="center">Please log in to view your settings.</Text>
        </Card>
      </Container>
    );
  }

  if (isLoading || !profile) {
    return <Spinner />;
  }

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xl">
        Settings
      </Title>
      <ProfileForm key={user.id} profile={profile} userId={user.id} />
    </Container>
  );
};

export default Settings;
