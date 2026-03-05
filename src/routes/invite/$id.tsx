import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/invite/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return <div>{id}</div>;
}
