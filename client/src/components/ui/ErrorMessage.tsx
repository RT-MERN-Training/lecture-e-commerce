import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
      {message}
    </Alert>
  );
};
