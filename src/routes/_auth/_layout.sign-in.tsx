import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { ErrorForm } from '@/components/ui/error-form';
import { useMutation } from '@tanstack/react-query';
import { authenticateUser } from '@/api/user/authenticate-uset';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useUserStore } from '@/store/user-store';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

export const Route = createFileRoute('/_auth/_layout/sign-in')({
  component: RouteComponent,
});

const singInSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(1, 'Digite sua senha'),
});

type SingInForm = z.infer<typeof singInSchema>;

function RouteComponent() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(singInSchema),
  });

  const { mutateAsync: authenticateUserMutation, isPending } = useMutation({
    mutationFn: authenticateUser,
  });

  const handleSingIn = async (data: SingInForm) => {
    try {
      const response = await authenticateUserMutation({
        email: data.email,
        password: data.password,
      });
      setUser(response.data);
      reset();
      navigate({ to: '/home' });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.code === 'ERR_NETWORK') {
          toast.error(
            'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
          );
          return;
        }

        if (error.response?.status === 401) {
          toast.error('Credenciais inválidas. Por favor, tente novamente.');
          return;
        }

        if (error.response?.status === 403 || error.response?.status === 400) {
          toast.error(
            'Não foi possível identificar sua empresa pelo domínio utilizado. Verifique se você está acessando a plataforma pelo endereço correto fornecido pela sua empresa.'
          );
          return;
        }

        toast.error(
          'Ocorreu um erro ao tentar entrar. Tente novamente mais tarde.'
        );
        return;
      }
    }
  };

  return (
    <form
      className="p-6 md:p-8 min-h-130 flex items-center justify-center"
      onSubmit={handleSubmit(handleSingIn)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Bem vindo de volta!</h1>
          <p className="text-muted-foreground text-balance">
            Faça o login em sua conta FileOn
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
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-2 hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>
          <Input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            required
          />
          {errors && errors.password?.message && (
            <ErrorForm message={errors.password.message} />
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

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Entrando...' : 'Acessar a plataforma'}
          </Button>
        </Field>
        <FieldDescription className="text-center">
          Não tem uma conta? <Link to="/sign-up">Cadastre sua empresa</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
