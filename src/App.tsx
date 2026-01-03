import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { Toaster } from 'sonner';
import { useUserStore } from './store/user-store';
import { useSessionQuery } from './hooks/useSessionQuery';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const user = useUserStore((state) => state.user);
  const { isLoading } = useSessionQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user && user.name}
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}
