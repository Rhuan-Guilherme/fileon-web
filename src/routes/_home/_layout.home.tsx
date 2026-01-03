import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_home/_layout/home')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>This is home page</div>;
}
