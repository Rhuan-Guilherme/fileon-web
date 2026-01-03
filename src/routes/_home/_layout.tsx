import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_home/_layout')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      This is home page layout
      <Outlet />
    </div>
  );
}
