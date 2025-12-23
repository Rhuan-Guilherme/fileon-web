import { registerUser } from '@/api/register-user';
import { Button } from '@/components/ui/button';
import { ErrorForm } from '@/components/ui/error-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import z from 'zod';

export const Route = createFileRoute('/_auth/_layout/sing-up')({
  component: RouteComponent,
});

const singInSchema = z.object({
  name: z.string().min(2, 'Infome o seu nome'),
  email: z.email('Insira um email válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type SingInForm = z.infer<typeof singInSchema>;

function RouteComponent() {
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(singInSchema),
  });

  const { mutateAsync: registerUserMutation } = useMutation({
    mutationFn: registerUser,
  });

  const handleSingIn = async (data: SingInForm) => {
    try {
      await registerUserMutation({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      reset();
    } catch (error) {
      setUserAlreadyExists(true);
      console.log(error);
    }
  };

  const handleErrors = (errors: FieldErrors<SingInForm>) => {
    console.log(errors);
  };
  return (
    <div className="w-11/12 max-w-sm mx-auto shadow p-6 rounded-lg border-foreground/10 border">
      <h1 className="text-foreground/90 text-2xl font-bold">Crie sua conta</h1>

      <form
        onSubmit={handleSubmit(handleSingIn, handleErrors)}
        className="flex flex-col gap-4 mt-10"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-muted-foreground">
            Nome
          </Label>
          <Input
            type="text"
            id="name"
            {...register('name')}
            className={`${errors && errors.name?.message ? ' focus-visible:ring-rose-400' : ''}`}
          />
          {errors && errors.name?.message && (
            <ErrorForm message={errors.name.message} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-muted-foreground">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            {...register('email')}
            className={`${errors && errors.email?.message ? ' focus-visible:ring-rose-400' : ''}`}
          />
          {errors && errors.email?.message && (
            <ErrorForm message={errors.email.message} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-muted-foreground">
            Senha
          </Label>
          <Input
            type="password"
            id="password"
            {...register('password')}
            className={`${errors && errors.password?.message ? ' focus-visible:ring-rose-400' : ''}`}
          />
          {errors && errors.password?.message && (
            <ErrorForm message={errors.password.message} />
          )}
        </div>
        <div>
          <Button type="submit">Registrar</Button>
        </div>
        {userAlreadyExists && (
          <ErrorForm message="Usuário já existe. Tente novamente com outro email." />
        )}
      </form>

      <p className="mt-4 text-muted-foreground font-semibold">
        Já possui uma conta?
        <Link
          to="/sing-in"
          className="ml-1 text-blue-400 font-semibold hover:underline"
        >
          Entre aqui.
        </Link>
      </p>
    </div>
  );
}
