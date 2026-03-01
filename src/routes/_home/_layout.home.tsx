import { createFileRoute } from '@tanstack/react-router';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, FilePlusCorner, Search, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUserStore } from '@/store/user-store';
import { useQuery } from '@tanstack/react-query';
import {
  findProcessByTenant,
  PROCESS_STATUS,
} from '@/api/processes/find-process-by-tenant';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { ProcessDetailsDialog } from '@/components/dialogs/info-process';
import { BadgeStatus } from '@/components/ui/badge-status';
import { CreateProcessDialog } from '@/components/dialogs/create-process';

export type ProcessStatus =
  (typeof PROCESS_STATUS)[keyof typeof PROCESS_STATUS];

type ProcessSchema = {
  id: string;
  name: string;
  status: ProcessStatus;
  createdAt: string;
  participants: {
    id: string;
    type: string;
    person?: {
      id: string;
      name: string;
      cpf: string;
      phone: string;
    };
  }[];
};

export const Route = createFileRoute('/_home/_layout/home')({
  component: RouteComponent,
});

function RouteComponent() {
  function formatStatus(status: string) {
    const formatted = status.toLowerCase().replace(/_/g, ' ');

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProcessStatus | undefined>(undefined);

  const [page, setPage] = useState(1);

  const [selectedProcess, setSelectedProcess] = useState<ProcessSchema | null>(
    null
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user } = useUserStore();

  const { data } = useQuery({
    queryKey: ['processes', user?.tenant.id, search, status, page],
    queryFn: () =>
      findProcessByTenant(user!.tenant.id, {
        name: search || undefined,
        status: status || undefined,
        perPage: 10,
        page,
      }),
    enabled: !!user?.tenant.id,
  });

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row items-center justify-start gap-3 ">
        <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-end sm:justify-start">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-sm"
            placeholder="Pesquisar por dados do processo..."
          />

          <Select
            value={status}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onValueChange={(value) => setStatus(value as any)}
          >
            <SelectTrigger className="w-full sm:max-w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="NOVO">Novo</SelectItem>
                <SelectItem value="EM_ANALISE">Em análise</SelectItem>
                <SelectItem value="DOCUMENTACAO_PENDENTE">
                  Documentação pendente
                </SelectItem>
                <SelectItem value="DOCUMENTACAO_COMPLETA">
                  Documentação completa
                </SelectItem>
                <SelectItem value="CANCELADO">Cancelado</SelectItem>
                <SelectItem value="FINALIZADO">Finalizado</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setSearch('');
                setStatus(undefined);
                setPage(1);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Remover filtros
            </Button>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <FilePlusCorner />
              Criar novo processo
            </Button>
          </DialogTrigger>
          <CreateProcessDialog />
        </Dialog>
      </div>
      <div className="rounded-2xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-muted-foreground text-sm">
            {data &&
              data.processes.map((process: ProcessSchema) => (
                <TableRow key={process.id}>
                  <TableCell>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedProcess(process);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Search />
                    </Button>
                  </TableCell>

                  <TableCell className="font-medium">{process.name}</TableCell>

                  <TableCell>
                    {process.participants?.map((p) => {
                      if (p.type === 'COMPRADOR') {
                        return p.person?.name;
                      }
                    }) ?? '-'}
                  </TableCell>

                  <TableCell>
                    <BadgeStatus status={process.status} />
                  </TableCell>

                  <TableCell>
                    {formatDistanceToNow(new Date(process.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      <ArrowRight />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

            {data && data.processes.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  Nenhum processo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <ProcessDetailsDialog
          process={selectedProcess}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          formatStatus={formatStatus}
        />
      </Dialog>
    </>
  );
}
