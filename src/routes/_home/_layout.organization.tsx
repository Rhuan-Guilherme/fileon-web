import { getOrganizationsUser } from '@/api/oganization/get-organizations-user';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Organization {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  userId: string;
}

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
    <div className="bg-muted/50 rounded-xl p-5 ">
      <Button variant="outline">Criar Organização</Button>
      <Table className="mt-10 overflow-hidden rounded-2xl border">
        <TableHeader>
          <TableRow className="bg-muted/60 hover:bg-muted">
            <TableHead className="w-60 p-4">Organização</TableHead>
            <TableHead className="p-4">Status</TableHead>
            <TableHead className="p-4">Criada em</TableHead>
            <TableHead className="text-right p-4 w-20">Ação</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {organizations?.data.map((org: Organization) => (
            <TableRow
              key={org.id}
              className="transition-colors hover:bg-muted/40"
            >
              {/* Organização */}
              <TableCell className="font-medium flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{org.name}</span>
              </TableCell>

              {/* Status */}
              <TableCell>
                <span
                  className={`
              inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
              ${
                org.status === 'ACTIVE'
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'bg-zinc-500/10 text-zinc-500'
              }
            `}
                >
                  {org.status === 'ACTIVE' ? 'Ativa' : 'Inativa'}
                </span>
              </TableCell>

              {/* Data */}
              <TableCell className="text-muted-foreground">
                {new Date(org.createdAt).toLocaleDateString('pt-BR')}
              </TableCell>

              {/* Plano / Valor */}
              <TableCell className="text-right font-medium p-4">
                <Button variant="secondary">Editar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
