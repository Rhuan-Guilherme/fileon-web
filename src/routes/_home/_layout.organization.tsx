import { getOrganizationsUser } from '@/api/oganization/get-organizations-user';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_home/_layout/organization')({
  staticData: {
    breadcrumb: 'Gerenciamento de Organizações',
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: organizations } = useQuery({
    queryKey: ['organizationsUser'],
    queryFn: getOrganizationsUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="bg-muted/50 aspect-video rounded-xl p-5">
      <Button variant="outline">Criar Organização</Button>
    </div>
  );
}
