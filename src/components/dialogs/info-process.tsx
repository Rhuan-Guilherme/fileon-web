import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  data?: Record<string, unknown>;
  createdAt: string;
};

type ProcessDetailsDialogProps = {
  process: ProcessSchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formatStatus: (status: string) => string;
};

export function ProcessDetailsDialog({
  process,
  open,
  onOpenChange,
  formatStatus,
}: ProcessDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes do processo</DialogTitle>
          <DialogDescription>
            Informações completas do processo selecionado.
          </DialogDescription>
        </DialogHeader>

        {process && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">Nome</p>
              <p className="font-medium">{process.name}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Descrição</p>
              <p>{process.description ?? 'Sem descrição'}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium">{formatStatus(process.status)}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Criado em</p>
              <p>
                {formatDistanceToNow(new Date(process.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>

            {process.data && (
              <div className="space-y-3 pt-4 border-t">
                <p className="text-sm font-semibold">Dados do processo</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(process.data).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm font-medium">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
