import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_layout/sing-up')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/_auth-layout/sing-up"!</div>;
}
