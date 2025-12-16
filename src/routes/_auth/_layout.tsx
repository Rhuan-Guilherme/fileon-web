import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_layout')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-2 items-center h-screen p-3">
      <div className="w-full h-full bg-blue-600 rounded-xl"></div>

      <div className="flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
