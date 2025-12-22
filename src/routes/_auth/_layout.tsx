import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_layout')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid items-center h-screen p-3">
      <div className="hidden w-full h-full rounded-xl"></div>

      <div className="flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
