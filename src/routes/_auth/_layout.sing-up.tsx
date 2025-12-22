import { Button } from '@/components/ui/button';
import { ErrorForm } from '@/components/ui/error-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm, type FieldErrors } from 'react-hook-form';
import z from 'zod';

export const Route = createFileRoute('/_auth/_layout/sing-up')({
  component: RouteComponent,
});

const singInSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  email: z.email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type SingInForm = z.infer<typeof singInSchema>;

function RouteComponent() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(singInSchema),
  });

  const handleSingIn = (data: SingInForm) => {
    console.log(data);
    reset();
  };

  const handleErrors = (errors: FieldErrors<SingInForm>) => {
    console.log(errors);
  };
  return (
    <form
      onSubmit={handleSubmit(handleSingIn, handleErrors)}
      className="w-11/12 max-w-sm mx-auto flex flex-col gap-4 mt-10"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
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
        <Label htmlFor="email">Email</Label>
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
        <Label htmlFor="password">Senha</Label>
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
      <Link to="/sing-in">Login</Link>
    </form>
  );
}
