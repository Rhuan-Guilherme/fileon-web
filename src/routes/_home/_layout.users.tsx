import { CreateUserTenantDialog } from '@/components/dialogs/create-user-tenant';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_home/_layout/users')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-muted p-2 rounded-lg">
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Criar um usuário
            </Button>
          </DialogTrigger>
          <CreateUserTenantDialog />
        </Dialog>
      </div>
    </div>
  );
}
