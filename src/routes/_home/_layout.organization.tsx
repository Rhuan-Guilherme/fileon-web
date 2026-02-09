import { getOrganizationsUser } from '@/api/oganization/get-organizations-user';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Crown, UserLock, Users } from 'lucide-react';
import { useUserStore } from '@/store/user-store';

interface Organization {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  userId: string;
  organizationMembers: {
    role: string;
  }[];
  user: {
    name: string;
    email: string;
  };
  _count: { organizationMembers: number };
}

export const Route = createFileRoute('/_home/_layout/organization')({
  staticData: {
    breadcrumb: 'Gerenciamento de Organizações',
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUserStore();

  const { data: organizations } = useQuery({
    queryKey: ['organizationsUser'],
    queryFn: getOrganizationsUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className=" rounded-xl p-5 ">
      <Button variant="outline">Criar Organização</Button>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {organizations?.data.map((org: Organization) => (
          <Card className="p-5">
            <div className="flex justify-center w-full">
              <div className="flex gap-2.5 w-full">
                <div className="w-12 h-12 bg-accent rounded-md text-center leading-12 font-semibold text-2xl">
                  {org.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <p className="text-foreground font-semibold">{org.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Criada em{' '}
                    {new Date(org.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="w-full flex-1">
                <span className="bg-emerald-500/10 text-emerald-600 py-1.5 px-4 rounded-full font-semibold text-xs">
                  {org.status}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <div className="flex items-center justify-center gap-2">
                  <Crown className="w-4 h-4" />
                  <p>Proprietário</p>
                </div>
                <p>{org.user.email === user?.email ? 'Você' : org.user.name}</p>
              </div>

              <Separator />

              <div className="flex justify-between">
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  <p>Membros</p>
                </div>
                <p>{org._count.organizationMembers}</p>
              </div>

              <Separator />

              <div className="flex justify-between">
                <div className="flex items-center justify-center gap-2">
                  <UserLock className="w-4 h-4" />
                  <p>Seu cargo</p>
                </div>
                <p>{org.organizationMembers[0]?.role}</p>
              </div>
            </div>

            <Button>
              <ArrowRight /> Acessar
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
