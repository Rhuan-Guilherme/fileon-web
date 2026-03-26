import { alterPassword } from '@/api/user/alter-password';
import { Button } from '@/components/ui/button';
import { ErrorForm } from '@/components/ui/error-form';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

export const Route = createFileRoute('/_auth/_layout/alter-password')({
  component: RouteComponent,
  validateSearch: z.object({
    email: z.email().optional(),
    currentPassword: z.string().min(1).optional(),
  }),
});

const alterPasswordSchema = z
  .object({
    email: z.email('Email inválido'),
    currentPassword: z.string().min(1, 'Digite sua senha atual'),
    newPassword: z
      .string()
      .min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
    confirmNewPassword: z.string().min(6, 'Confirme a nova senha'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmNewPassword'],
  });

type AlterPasswordForm = z.infer<typeof alterPasswordSchema>;

function RouteComponent() {
  const navitate = useNavigate();
  const search = Route.useSearch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AlterPasswordForm>({
    resolver: zodResolver(alterPasswordSchema),
    defaultValues: {
      email: search.email ?? '',
      currentPassword: search.currentPassword ?? '',
    },
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordReset, setShowPasswordReset] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const { mutateAsync: alterPasswordMutate, isPending } = useMutation({
    mutationFn: alterPassword,
    onSuccess: () => {
      navitate({
        to: '/sign-in',
      });
      toast.success(
        'Senha alterada com sucesso! Faça login para acessar a plataforma.'
      );
    },
  });

  const handleAlterPassword = async (data: AlterPasswordForm) => {
    await alterPasswordMutate({
      email: data.email,
      password: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleAlterPassword)}
      className="p-6 md:p-8 min-h-130 flex items-center justify-center"
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Troque sua senha</h1>
          <p className="text-muted-foreground text-balance">
            Insira sua nova senha para acessar sua conta FileOn
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            {...register('email')}
            id="email"
            placeholder="email@example.com"
            type="email"
            required
          />
          {errors && errors.email?.message && (
            <ErrorForm message={errors.email.message} />
          )}
        </Field>
        <Field className="relative">
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Senha atual</FieldLabel>
          </div>
          <Input
            {...register('currentPassword')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            required
          />
          {errors && errors.currentPassword?.message && (
            <ErrorForm message={errors.currentPassword.message} />
          )}
          <div>
            <button
              type="button"
              className="absolute top-1/2 right-2 w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye className="w-4 h-4 " />
              ) : (
                <EyeOff className="w-4 h-4 " />
              )}
            </button>
          </div>
        </Field>

        <Field className="relative">
          <div className="flex items-center">
            <FieldLabel htmlFor="new-password">Nova senha</FieldLabel>
          </div>
          <Input
            {...register('newPassword')}
            id="new-password"
            type={showPasswordReset ? 'text' : 'password'}
            placeholder="••••••••"
            required
          />
          {errors && errors.newPassword?.message && (
            <ErrorForm message={errors.newPassword.message} />
          )}
          <div>
            <button
              type="button"
              className="absolute top-1/2 right-2 w-5 h-5 cursor-pointer"
              onClick={() => setShowPasswordReset(!showPasswordReset)}
            >
              {showPasswordReset ? (
                <Eye className="w-4 h-4 " />
              ) : (
                <EyeOff className="w-4 h-4 " />
              )}
            </button>
          </div>
        </Field>

        <Field className="relative">
          <div className="flex items-center">
            <FieldLabel htmlFor="confirm-password">
              Confirme a nova senha
            </FieldLabel>
          </div>
          <Input
            {...register('confirmNewPassword')}
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            required
          />
          {errors && errors.confirmNewPassword?.message && (
            <ErrorForm message={errors.confirmNewPassword.message} />
          )}
          <div>
            <button
              type="button"
              className="absolute top-1/2 right-2 w-5 h-5 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <Eye className="w-4 h-4 " />
              ) : (
                <EyeOff className="w-4 h-4 " />
              )}
            </button>
          </div>
        </Field>
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Alterando...' : 'Alterar senha e acessar'}
          </Button>
        </Field>
        <FieldDescription className="text-center">
          Já alterou sua senha? <Link to="/sign-in">Faça login</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
