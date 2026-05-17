import { isAxiosError } from 'axios';

const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data as Record<string, unknown>;
    if (typeof data.message === 'string') {
      return data.message;
    }
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  ) {
    return (error as Record<string, unknown>).message as string;
  }

  return 'An unexpected error occurred';
};

export default getErrorMessage;
