import { findProcess, type Process } from '@/api/processes/find-process';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { BadgeStatus } from '@/components/ui/badge-status';

export const Route = createFileRoute('/_home/_layout/process/$processId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { processId } = Route.useParams();

  const { data, isLoading } = useQuery<Process>({
    queryKey: ['process', processId],
    queryFn: () => findProcess(processId),
  });

  if (isLoading) {
    return <div className="p-6">Carregando processo...</div>;
  }

  if (!data) {
    return <div className="p-6">Processo não encontrado.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{data.name}</h1>

        <div className="flex gap-2">
          <BadgeStatus status={data.status} />
        </div>
      </div>

      {/* Card Principal */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Informações do Processo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Info
              label="Atualizado em"
              value={format(new Date(data.updatedAt), 'dd/MM/yyyy HH:mm')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Participantes */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Participantes</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {data.participants.map((participant) => (
            <div
              key={participant.id}
              className="p-4 border rounded-xl space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{participant.type}</span>
                <Badge variant="outline">
                  {participant.person ? 'Vinculado' : 'Sem pessoa'}
                </Badge>
              </div>

              <Separator />

              {participant.person ? (
                <div className="text-sm space-y-1">
                  <Info label="Nome" value={participant.person.name} />
                  <Info label="Email" value={participant.person.email ?? '—'} />
                  <Info
                    label="Telefone"
                    value={participant.person.phone ?? '—'}
                  />
                  <Info label="CPF" value={participant.person.cpf ?? '—'} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma pessoa vinculada.
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-medium break-all">{value}</p>
    </div>
  );
}
