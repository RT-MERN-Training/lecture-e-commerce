import { MantineProvider } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { AuthProvider } from './features/auth/AuthContext';
import { queryClient } from './lib/queryClient';
import { router } from './router';

import '@mantine/core/styles.css';

function App() {
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
