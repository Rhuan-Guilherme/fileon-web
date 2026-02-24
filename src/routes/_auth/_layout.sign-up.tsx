import { createTenant } from '@/api/tenant/create-tenant';
import { Button } from '@/components/ui/button';
import { ErrorForm } from '@/components/ui/error-form';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formatCNPJ } from '@/lib/format-cnpj';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

export const Route = createFileRoute('/_auth/_layout/sign-up')({
  component: RouteComponent,
});

const singInSchema = z.object({
  name: z.string().min(2, 'Infome o seu nome'),
  cnpj: z.string().min(14, 'Infome um CNPJ válido'),
  adminEmail: z.email('Insira um email válido'),
  adminPassword: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type SingInForm = z.infer<typeof singInSchema>;

function RouteComponent() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [userAlreadyExists, setUserAlreadyExists] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(singInSchema),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const cnpjValue = watch('cnpj');

  const { mutateAsync: registerTenantMutation, isPending } = useMutation({
    mutationFn: createTenant,
  });

  const handleSingIn = async (data: SingInForm) => {
    try {
      await registerTenantMutation({
        cnpj: data.cnpj.replace(/\D/g, ''),
        name: data.name,
        adminEmail: data.adminEmail,
        adminPassword: data.adminPassword,
      });
      setUserAlreadyExists(false);
    } catch (error) {
      setUserAlreadyExists(true);
      console.log(error);
    }
  };

  return (
    <form className="p-6 md:p-8" onSubmit={handleSubmit(handleSingIn)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Crie sua conta!</h1>
          <p className="text-muted-foreground text-balance">
            O cadastro é rápido, facíl e gratuito.
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Nome da empresa</FieldLabel>
          <Input
            {...register('name')}
            id="name"
            placeholder="File On Entreprise"
            type="text"
            required
          />
          {errors && errors.name?.message && (
            <ErrorForm message={errors.name.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="cnpj">CNPJ da empresa</FieldLabel>
          <Input
            {...register('cnpj')}
            id="cnpj"
            placeholder="00.000.000/0000-00"
            type="text"
            required
            value={formatCNPJ(cnpjValue || '')}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, '');
              setValue('cnpj', onlyNumbers);
            }}
          />
          {errors && errors.cnpj?.message && (
            <ErrorForm message={errors.cnpj.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="adminEmail">Email</FieldLabel>
          <Input
            {...register('adminEmail')}
            id="adminEmail"
            placeholder="email@example.com"
            type="email"
            required
          />
          {errors && errors.adminEmail?.message && (
            <ErrorForm message={errors.adminEmail.message} />
          )}
        </Field>
        <Field className="relative">
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Senha</FieldLabel>
          </div>
          <Input
            {...register('adminPassword')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            required
          />
          {errors && errors.adminPassword?.message && (
            <ErrorForm message={errors.adminPassword.message} />
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
            {isPending ? 'Registrando...' : 'Registre-se'}
          </Button>
          {userAlreadyExists && (
            <ErrorForm message="E-mail ja cadastrado, tente novamente." />
          )}
        </Field>

        <FieldDescription className="text-center">
          Já tem uma conta? <Link to="/sign-in">Entre aqui</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
