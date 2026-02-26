import {
  findUsersByTenant,
  type UsersByTenantResponse,
} from '@/api/user/find-users-by-tenant';
import { CreateUserTenantDialog } from '@/components/dialogs/create-user-tenant';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LockKeyhole,
  MoreVertical,
  Trash2,
  UserIcon,
  UserLock,
} from 'lucide-react';
import { useUserStore } from '@/store/user-store';
import { useMutation, useQuery } from '@tanstack/react-query';

import { createFileRoute } from '@tanstack/react-router';
import { UserRoundPlus } from 'lucide-react';
import { invalidateUser } from '@/api/user/inativate-user';
import { queryClient } from '@/lib/query-client';
import { activeUser } from '@/api/user/active-user';

export const Route = createFileRoute('/_home/_layout/users')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user: usersAlt } = useUserStore();

  const { data: response } = useQuery<UsersByTenantResponse>({
    queryKey: ['usersTenantKey'],
    queryFn: () => findUsersByTenant(usersAlt!.tenant.id),
  });

  const { mutateAsync: invalidateUserMutation } = useMutation({
    mutationFn: invalidateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usersTenantKey'] });
    },
  });

  const { mutateAsync: activeUserMutation } = useMutation({
    mutationFn: activeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usersTenantKey'] });
    },
  });

  return (
    <div className="mt-6 p-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center justify-center">
              <UserRoundPlus />
              Criar usuário
            </Button>
          </DialogTrigger>

          <CreateUserTenantDialog />
        </Dialog>
      </div>

      {/* Desktop */}
      <div className="hidden md:block rounded-lg border ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Senha</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="bg-neutral-900">
            {response?.users.map((user) => (
              <TableRow key={user.id}>
                {/* Usuário */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Cargo */}
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>

                {/* Senha */}
                <TableCell>
                  {user.mustChangePassword ? (
                    <Badge variant="link">Expirada</Badge>
                  ) : (
                    <Badge variant="outline">Ativa</Badge>
                  )}
                </TableCell>

                {/* Criado em */}
                <TableCell>
                  {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                </TableCell>

                <TableCell>
                  <Badge
                    className={`font-bold ${user.status ? 'bg-emerald-500 text-emerald-950 border-emerald-600 shadow' : 'bg-red-400 text-red-100 border-red-600 shadow'}`}
                  >
                    {user.status ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>

                {/* Ações */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <UserIcon />
                        Editar usuário
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <LockKeyhole />
                        Alterar cargo e acessos
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-emerald-400 cursor-pointer"
                        onClick={() => {
                          activeUserMutation({
                            tenantId: user.tenantId,
                            tenantOperator: usersAlt!.tenant.id,
                            userId: user.id,
                          });
                        }}
                      >
                        <UserLock className="text-emerald-400" />
                        Ativar usuário
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-rose-400 cursor-pointer"
                        onClick={() => {
                          invalidateUserMutation({
                            tenantId: user.tenantId,
                            tenantOperator: usersAlt!.tenant.id,
                            userId: user.id,
                          });
                        }}
                      >
                        <UserLock className="text-rose-400" />
                        Inativar usuário
                      </DropdownMenuItem>

                      {/* <DropdownMenuSeparator />

                      <DropdownMenuItem variant="destructive">
                        <Trash2 />
                        Excluir usuário
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4">
        {response?.users.map((user) => (
          <div
            key={user.id}
            className="rounded-lg border bg-background p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {user.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Criado em</span>
              <span>{format(new Date(user.createdAt), 'dd/MM/yyyy')}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cargo</span>
              <Badge variant="secondary">{user.role}</Badge>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={user.status ? 'default' : 'destructive'}>
                {user.status ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Senha</span>
              {user.mustChangePassword ? (
                <Badge variant="destructive">Expirada</Badge>
              ) : (
                <Badge variant="outline">OK</Badge>
              )}
            </div>

            <Button size="sm" className="w-full">
              Acessar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
