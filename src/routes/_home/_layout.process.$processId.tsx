import {
  findProcess,
  type ParticipantInvite,
  type Process,
} from '@/api/processes/find-process';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { BadgeStatus } from '@/components/ui/badge-status';
import { Button } from '@/components/ui/button';
import { InviteParticipant } from '@/api/participant/invite-participant';
import { queryClient } from '@/lib/query-client';
import { toast } from 'sonner';
import { ptBR } from 'date-fns/locale/pt-BR';
import { ShoppingBag, Store } from 'lucide-react';

export const Route = createFileRoute('/_home/_layout/process/$processId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { processId } = Route.useParams();

  const { data, isLoading } = useQuery<Process>({
    queryKey: ['process', processId],
    queryFn: () => findProcess(processId),
  });

  const {
    mutateAsync: inviteParticipantMutate,
    isPending: isInviteParticipantPending,
  } = useMutation({
    mutationFn: (participantId: string) => InviteParticipant(participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process', processId] });
    },
  });

  if (isLoading) {
    return <div className="p-6">Carregando processo...</div>;
  }

  if (!data) {
    return <div className="p-6">Processo não encontrado.</div>;
  }

  return (
    <div className="min-h-dvh bg-linear-to-br from-background via-muted/20 to-background p-4 md:p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="rounded-2xl border border-border/60 bg-background/90 p-4 md:p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Detalhes do processo
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              {data.name}
            </h1>
          </div>

          <div className="flex gap-2">
            <BadgeStatus status={data.status} />
          </div>
        </div>
      </div>

      {/* Card Principal */}
      <Card className="rounded-2xl border-border/70 bg-background/95 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Informações do Processo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <Info
              label="Tipo de imóvel"
              value={
                data.type === 'NOVO'
                  ? 'Imóvel novo'
                  : data.type === 'INDIVIDUAL'
                    ? 'Imóvel usado'
                    : data.type === 'PLANTA'
                      ? 'Imóvel na planta'
                      : '—'
              }
            />
            <Info
              label="VGV"
              value={
                data.vgv
                  ? `R$ ${Number(data.vgv).toLocaleString('pt-BR')}`
                  : 'Não informado'
              }
            />
            <Info
              label="Vendedor"
              value={
                data.participants.find((p) => p.type === 'VENDEDOR')?.person
                  ?.name ?? '—'
              }
            />

            <Info
              label="Comprador"
              value={
                data.participants.find((p) => p.type === 'COMPRADOR')?.person
                  ?.name ?? '—'
              }
            />

            <Info
              label="Criado em"
              value={format(new Date(data.createdAt), 'dd/MM/yyyy HH:mm')}
            />
            <Info label="Criado por" value={data.user.name.split(' ')[0]} />
          </div>
        </CardContent>
      </Card>

      {/* Participantes */}
      <Card className="rounded-2xl border-border/70 bg-background/95 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Participantes</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {data.participants.map((participant) => {
            const isComprador = participant.type === 'COMPRADOR';
            const TypeIcon = isComprador ? ShoppingBag : Store;
            return (
            <div
              key={participant.id}
              className={`rounded-2xl border p-5 space-y-4 shadow-sm relative overflow-hidden ${
                isComprador
                  ? 'border-blue-200/70 dark:border-blue-800/40 bg-linear-to-br from-blue-50/40 via-background to-muted/20 dark:from-blue-950/20'
                  : 'border-emerald-200/70 dark:border-emerald-800/40 bg-linear-to-br from-emerald-50/40 via-background to-muted/20 dark:from-emerald-950/20'
              }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  isComprador ? 'bg-blue-500' : 'bg-emerald-500'
                }`}
              />
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                    isComprador
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                  }`}
                >
                  <TypeIcon className="w-4 h-4" />
                  {isComprador ? 'Comprador' : 'Vendedor'}
                </div>
                <Badge variant="outline">
                  {participant.person ? 'Vinculado' : 'Sem pessoa'}
                </Badge>
              </div>
              <Separator
                className={isComprador ? 'bg-blue-200/60 dark:bg-blue-800/40' : 'bg-emerald-200/60 dark:bg-emerald-800/40'}
              />
              {participant.company && participant.company.companyName ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Info
                    label="Nome da empresa"
                    value={participant.company.companyName ?? '—'}
                  />
                  <Info
                    label="Email"
                    value={participant.company.email ?? '—'}
                  />
                  <Info
                    label="Telefone"
                    value={participant.company.phone ?? '—'}
                  />
                  <Info label="CNPJ" value={participant.company.cnpj ?? '—'} />
                </div>
              ) : null}
              {participant.person && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Info label="Nome" value={participant.person.name ?? '—'} />
                  <Info label="Email" value={participant.person.email ?? '—'} />
                  <Info
                    label="Telefone"
                    value={participant.person.phone ?? '—'}
                  />
                  <Info label="CPF" value={participant.person.cpf ?? '—'} />
                </div>
              )}
              <div className="rounded-xl border border-border/60 bg-background/80 px-4 py-3 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Link para encaminhar dados do processo
                </p>

                {participant.participantInvites.length ? (
                  (() => {
                    const latestInvite = getLatestParticipantInvite(
                      participant.participantInvites
                    );
                    const token = latestInvite?.token;
                    const inviteLink = token
                      ? `https://lvh.me:5173/invite/${token}`
                      : null;

                    async function handleCopy() {
                      if (!inviteLink) return;
                      await navigator.clipboard.writeText(inviteLink);
                      toast.success(
                        'Link copiado para a área de transferência!'
                      );
                    }

                    const expiresAt = latestInvite?.expiresAt;

                    if (!expiresAt)
                      return (
                        <span className="text-sm text-muted-foreground">—</span>
                      );

                    const date = new Date(expiresAt);
                    const expired = isPast(date);

                    return (
                      <div className="flex flex-wrap items-center gap-2">
                        {!expired ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCopy}
                          >
                            Copiar link
                          </Button>
                        ) : (
                          <Button
                            onClick={() =>
                              inviteParticipantMutate(participant.id)
                            }
                            disabled={isInviteParticipantPending}
                          >
                            Gerar link
                          </Button>
                        )}

                        <span
                          className={`text-sm ${
                            expired
                              ? 'text-red-500 font-medium'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {expired
                            ? 'Expirado'
                            : `Expira em ${formatDistanceToNow(date, {
                                addSuffix: false,
                                locale: ptBR,
                              })}`}
                        </span>
                      </div>
                    );
                  })()
                ) : (
                  <Button
                    onClick={() => inviteParticipantMutate(participant.id)}
                    disabled={isInviteParticipantPending}
                  >
                    Gerar link
                  </Button>
                )}
              </div>

              {participant.company && (
                <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                  <p className="text-sm font-medium text-foreground">
                    Representantes vinculados
                  </p>

                  {participant.company.companyRepresentatives.length > 0 ? (
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      {participant.company.companyRepresentatives.map(
                        (representative) => (
                          <li
                            className="rounded-md border border-border/60 bg-background/80 px-3 py-2 space-y-1"
                            key={representative.id}
                          >
                            <p className="font-medium text-foreground">
                              {formatRepresentativeName(representative)}
                            </p>
                            {representative.person?.email && (
                              <p>Email: {representative.person.email}</p>
                            )}
                            {representative.person?.phone && (
                              <p>Telefone: {representative.person.phone}</p>
                            )}
                            {representative.person?.cpf && (
                              <p>CPF: {representative.person.cpf}</p>
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Nenhum representante cadastrado para esta empresa.
                    </p>
                  )}
                </div>
              )}
            </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function getLatestParticipantInvite(invites: ParticipantInvite[]) {
  if (!invites.length) return null;

  return invites.reduce((latestInvite, currentInvite) => {
    return new Date(currentInvite.createdAt) > new Date(latestInvite.createdAt)
      ? currentInvite
      : latestInvite;
  });
}

function formatRepresentativeName(representative: {
  person?: { name: string } | null;
  personId: string;
}) {
  return (
    representative.person?.name || `Representante (${representative.personId})`
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/25 px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-medium text-foreground break-all">{value}</p>
    </div>
  );
}
