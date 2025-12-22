import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

export const Route = createFileRoute('/_auth/_layout/sing-in')({
  component: RouteComponent,
});

const singInSchema = z.object({
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
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" {...register('email')} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input type="password" id="password" {...register('password')} />
      </div>
      {errors && errors.email?.message && (
        <p className="text-sm text-rose-400 font-semibold">
          {errors.email.message}
        </p>
      )}
      {errors && errors.password?.message && (
        <p className="text-sm text-rose-400 font-semibold">
          {errors.password.message}
        </p>
      )}
      <div>
        <Button type="submit">Entrar</Button>
      </div>

      <Link to="/sing-up">Register</Link>
    </form>
  );
}
