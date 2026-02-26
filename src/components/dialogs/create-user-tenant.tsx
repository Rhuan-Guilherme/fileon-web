import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorForm } from '../ui/error-form';
import { AlertTriangle } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/api/user/register-user';
import { useUserStore } from '@/store/user-store';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { queryClient } from '@/lib/query-client';
import { formatCPF } from '@/lib/format-cnpj';

const userCreateSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.email('Email inválido'),
  cpf: z.string(),
  role: z.enum(['ADMIN', 'GERENTE', 'CORRESPONDENTE', 'CORRETOR']),
});

type UserCreateFormData = z.infer<typeof userCreateSchema>;

export function CreateUserTenantDialog() {
  const { user } = useUserStore();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateSchema),
  });

  const { mutateAsync: registerUserMutate, isPending } = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ['usersTenantKey'] });
      toast.success('Usuário criado com sucesso!');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          toast.error(error.response.data.error);
          return;
        }
      }
    },
  });

  const handleCreateUser = (data: UserCreateFormData) => {
    registerUserMutate({
      name: data.name,
      email: data.email,
      password: data.cpf.slice(-4),
      cpf: data.cpf,
      role: data.role,
      tenantId: user!.tenant.id,
    });
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
        <DialogTitle>Crie um novo usuário:</DialogTitle>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-500 w-5 h-5" />
            <p className="text-lg font-semibold">Atenção:</p>
          </div>

          <ul className="list-disc space-y-2 ml-4 text-sm text-muted-foreground">
            <li>
              O usuário criado terá acesso apenas à sua própria organização.
            </li>
            <li>
              A senha de acesso será os <strong>4 últimos </strong>dígitos do
              CPF (Alterada apos o primeiro acesso).
            </li>
            <li>
              Será encaminhado um e-mail com as credenciais de acesso ao
              usuário.
            </li>
            <li>Apenas administradores e gerentes podem gerenciar usuários.</li>
            <li>
              Certifique-se de fornecer as informações corretas para evitar
              problemas de acesso.
            </li>
          </ul>

          <Separator className="my-3" />
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="name">Nome completo</Label>
            <Input {...register('name')} id="name" name="name" placeholder="" />
            {errors && errors.name?.message && (
              <ErrorForm message={errors.name.message} />
            )}
          </Field>
          <Field>
            <Label htmlFor="email">Email</Label>
            <Input {...register('email')} id="email" name="email" />
            {errors && errors.email?.message && (
              <ErrorForm message={errors.email.message} />
            )}
          </Field>
          <Field>
            <Label htmlFor="cpf">CPF</Label>
            <Controller
              name="cpf"
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <Input
                  id="cpf"
                  name="cpf"
                  value={formatCPF(field.value ?? '')}
                  onChange={(e) => {
                    const digits = e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 11);
                    field.onChange(digits);
                  }}
                />
              )}
            />

            {errors && errors.cpf?.message && (
              <ErrorForm message={errors.cpf.message} />
            )}
          </Field>
          <Field>
            <Label htmlFor="role">Cargo</Label>

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>

                  <SelectContent position="popper">
                    <SelectGroup>
                      <SelectLabel>Cargos</SelectLabel>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                      <SelectItem value="GERENTE">Gerente</SelectItem>
                      <SelectItem value="CORRESPONDENTE">
                        Correspondente
                      </SelectItem>
                      <SelectItem value="CORRETOR">Corretor</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors && errors.role?.message && (
              <ErrorForm message={errors.role.message} />
            )}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            Prosseguir
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
