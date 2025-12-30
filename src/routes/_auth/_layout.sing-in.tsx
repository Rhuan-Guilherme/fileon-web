import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { ErrorForm } from '@/components/ui/error-form';
import { useMutation } from '@tanstack/react-query';
import { authenticateUser } from '@/api/authenticate-uset';
import { Eye, EyeOff, FileText, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_auth/_layout/sing-in')({
  component: RouteComponent,
});

const singInSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(1, 'Digite sua senha'),
});

type SingInForm = z.infer<typeof singInSchema>;

function RouteComponent() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
      console.log(response.data);
      reset();
      navigate({ to: '..' });
    } catch (error) {
      console.log(error);
    }
  };

  const handleErrors = (errors: FieldErrors<SingInForm>) => {
    console.log(errors);
  };

  return (
    <div className="w-11/12 max-w-md mx-auto shadow p-6 rounded-lg ">
      <div className="flex items-center mb-6">
        <div className="bg-blue-600 p-2 rounded-xl mr-2">
          <FileText className="text-white" size={20} />
        </div>
        <h1 className="text-foreground font-semibold text-2xl">FileOn</h1>
      </div>

      <h1 className="text-foreground/90 text-2xl font-bold">
        Acesse sua conta
      </h1>
      <p className="text-muted-foreground text-sm">
        Organize e solicite documentos de forma simples e segura.
      </p>

      <form
        onSubmit={handleSubmit(handleSingIn, handleErrors)}
        className="flex flex-col gap-4 mt-10"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-muted-foreground">
            Email
          </Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              type="email"
              id="email"
              placeholder="exemplo@exemplo.com"
              {...register('email')}
              className={`pl-9 placeholder:text-muted-foreground/70 ${errors && errors.email?.message ? ' focus-visible:ring-rose-400' : ''}`}
            />
          </div>

          {errors && errors.email?.message && (
            <ErrorForm message={errors.email.message} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-muted-foreground">
            Senha
          </Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register('password')}
              placeholder="••••••••"
              className={`pl-9  placeholder:text-muted-foreground/70 ${errors && errors.password?.message ? ' focus-visible:ring-rose-400' : ''}`}
            />
            {showPassword ? (
              <Eye
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
                size={16}
              />
            ) : (
              <EyeOff
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
                size={16}
              />
            )}
          </div>

          {errors && errors.password?.message && (
            <ErrorForm message={errors.password.message} />
          )}
        </div>

        <div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Entrando...' : 'Entrar na plataforma'}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-zinc-400">ou</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm flex justify-center">
          Ainda não tem acesso?
          <Link
            to="/sing-up"
            className="ml-1 text-blue-500 font-semibold hover:underline"
          >
            Criar uma conta gratuita
          </Link>
        </p>
      </form>
    </div>
  );
}
