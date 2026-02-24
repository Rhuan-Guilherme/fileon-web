import { CreateUserTenantDialog } from '@/components/dialogs/create-user-tenant';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_home/_layout/users')({
  component: RouteComponent,
});

function RouteComponent() {
  const [open, setOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);

  return (
    <div className="bg-muted p-2 rounded-lg">
      <div>
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            if (!value) {
              setDialogKey((prev) => prev + 1);
            }
          }}
        >
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
