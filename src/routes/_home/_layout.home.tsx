import { createFileRoute, Link } from '@tanstack/react-router';

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
import { ArrowRight, Calendar, FilePlusCorner, Search, X } from 'lucide-react';
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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
  user: {
    id: string;
    email: string;
    name: string;
  };
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
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [page, setPage] = useState(1);

  const [selectedProcess, setSelectedProcess] = useState<ProcessSchema | null>(
    null
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user } = useUserStore();

  const { data } = useQuery({
    queryKey: [
      'processes',
      user?.tenant.id,
      search,
      status,
      page,
      dateFrom,
      dateTo,
    ],
    queryFn: () =>
      findProcessByTenant(user!.tenant.id, {
        name: search || undefined,
        status: status || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        perPage: 13,
        page,
      }),
    enabled: !!user?.tenant.id,
  });

  const totalPages = data ? Math.ceil((data.total ?? 0) / 14) : 1;

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row items-center justify-start gap-3 ">
        <div className="flex flex-col gap-3 w-full sm:flex-row sm:flex-wrap sm:items-end sm:justify-start">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:max-w-sm"
            placeholder="Pesquisar por dados do processo..."
          />

          <Select
            value={status}
            onValueChange={(value) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setStatus(value as any);
              setPage(1);
            }}
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

          <div className="flex items-center gap-1.5 w-full sm:w-auto rounded-md border border-input bg-background px-3 h-9">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-sm outline-none w-28 text-foreground scheme-light dark:scheme-dark"
            />
            <span className="text-muted-foreground text-xs font-medium select-none">
              —
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-sm outline-none w-28 text-foreground scheme-light dark:scheme-dark"
            />
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setSearch('');
                setStatus(undefined);
                setDateFrom('');
                setDateTo('');
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
              <TableHead>Nome do processo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Criado por</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-muted-foreground text-sm ">
            {data &&
              data.processes.map((process: ProcessSchema) => (
                <TableRow key={process.id}>
                  <TableCell className="">
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

                  <TableCell>{process.user.name.split(' ')[0]}</TableCell>

                  <TableCell className="text-right">
                    <Link
                      to={`/process/$processId`}
                      params={{ processId: process.id }}
                    >
                      <Button size="sm" variant="outline">
                        <ArrowRight />
                      </Button>
                    </Link>
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

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
          <p className="text-sm text-muted-foreground">
            {data?.total
              ? `Página ${page} de ${totalPages} · ${data.total} processos`
              : `Página ${page} de ${totalPages}`}
          </p>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={
                    page === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
              {getPageNumbers(page, totalPages).map((pageNum, idx) =>
                pageNum === null ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={pageNum === page}
                      onClick={() => setPage(pageNum)}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={
                    page === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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

function getPageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | null)[] = [1];
  if (current > 3) pages.push(null);
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 2) pages.push(null);
  pages.push(total);
  return pages;
}
