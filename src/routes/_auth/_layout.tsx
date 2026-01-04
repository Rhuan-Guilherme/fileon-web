import { useUserStore } from '@/store/user-store';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_layout')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUserStore();

  if (user) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="grid items-center h-screen p-3">
      <div className="hidden w-full h-full rounded-xl"></div>

      <div className="flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
