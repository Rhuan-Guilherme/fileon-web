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
import { findProcessByTenant } from '@/api/processes/find-process-by-tenant';
import { Dialog } from '@/components/ui/dialog';
import { useState } from 'react';
import { ProcessDetailsDialog } from '@/components/dialogs/info-process';

type ProcessSchema = {
  id: string;
  name: string;
  description?: string;
  status:
    | 'NOVO'
    | 'EM_ANDAMENTO'
    | 'FINALIZADO'
    | 'CANCELADO'
    | 'DOCUMENTACAO_PENDENTE'
    | 'DOCUMENTACAO_COMPLETA'
    | 'EM_ANALISE';

  createdAt: string;
  data?: Record<string, unknown>;
};

export const Route = createFileRoute('/_home/_layout/home')({
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<
    | 'NOVO'
    | 'EM_ANDAMENTO'
    | 'FINALIZADO'
    | 'CANCELADO'
    | 'DOCUMENTACAO_PENDENTE'
    | 'DOCUMENTACAO_COMPLETA'
    | 'EM_ANALISE'
    | undefined
  >(undefined);

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

  function formatStatus(status: string) {
    const formatted = status.toLowerCase().replace(/_/g, ' ');

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  function getStatusStyles(status: string) {
    switch (status) {
      case 'NOVO':
        return `
        bg-blue-50 text-blue-700 border-blue-200
        dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20
      `;

      case 'DOCUMENTACAO_PENDENTE':
        return `
        bg-amber-50 text-amber-700 border-amber-200
        dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20
      `;

      case 'DOCUMENTACAO_COMPLETA':
        return `
        bg-emerald-50 text-emerald-700 border-emerald-200
        dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20
      `;

      case 'EM_ANALISE':
        return `
        bg-purple-50 text-purple-700 border-purple-200
        dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20
      `;

      case 'FINALIZADO':
        return `
        bg-green-50 text-green-700 border-green-200
        dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20
      `;

      case 'CANCELADO':
        return `
        bg-red-50 text-red-700 border-red-200
        dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20
      `;

      default:
        return `
        bg-muted text-muted-foreground border-border
      `;
    }
  }

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

        <Button className="w-full md:w-auto">
          <FilePlusCorner />
          Criar novo processo
        </Button>
      </div>
      <div className="rounded-2xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
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

                  <TableCell>{process.description ?? '-'}</TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyles(
                        process.status
                      )}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {formatStatus(process.status)}
                    </span>
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
