import { registerUser } from '@/api/register-user';
import { Button } from '@/components/ui/button';
import { ErrorForm } from '@/components/ui/error-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/store/user-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, Navigate } from '@tanstack/react-router';
import { Eye, EyeOff, FileText } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  const { user } = useUserStore();
  const [showPassword, setShowPassword] = useState<boolean>(false);

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

  if (user) {
    return <Navigate to=".." />;
  }

  return (
    <div className="w-11/12 max-w-md mx-auto shadow p-6 rounded-lg">
      <div className="flex items-center mb-6">
        <div className="bg-blue-600 p-2 rounded-xl mr-2">
          <FileText className="text-white" size={20} />
        </div>
        <h1 className="text-foreground font-semibold text-2xl">FileOn</h1>
      </div>

      <h1 className="text-foreground/90 text-2xl font-bold">Crie sua conta</h1>
      <p className="text-muted-foreground text-sm">
        O melhor software para gerenciamento de arquivos.
      </p>

      <form
        onSubmit={handleSubmit(handleSingIn)}
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
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register('password')}
              className={`${errors && errors.password?.message ? ' focus-visible:ring-rose-400' : ''}`}
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
          <Button type="submit" className="w-full">
            Registe-se na plataforma
          </Button>
        </div>
        {userAlreadyExists && (
          <ErrorForm message="Usuário já existe. Tente novamente com outro email." />
        )}
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-zinc-400">ou</span>
        </div>
      </div>

      <p className="mt-4 text-muted-foreground text-sm flex justify-center">
        Já possui uma conta?
        <Link
          to="/sing-in"
          className="ml-1 text-blue-500 font-semibold hover:underline"
        >
          Entre aqui.
        </Link>
      </p>
    </div>
  );
}
