import { findInvites } from '@/api/participant/find-invites';
import {
  updatePerson,
  type UpdatePersonData,
} from '@/api/participant/update-person';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ErrorForm } from '@/components/ui/error-form';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

export const Route = createFileRoute('/invite/$id')({
  component: RouteComponent,
});

const inviteFormSchema = z
  .object({
    participantKind: z.enum(['person', 'company']),
    name: z.string().min(2, 'Informe o nome'),
    cpf: z.string().trim().optional(),
    cnpj: z.string().trim().optional(),
    email: z.email('Informe um email válido'),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9]{10,11}$/, 'Informe um telefone com DDD'),
  })
  .superRefine((value, ctx) => {
    if (value.participantKind === 'person') {
      if (!value.cpf || !/^[0-9]{11}$/.test(value.cpf)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cpf'],
          message: 'Informe um CPF com 11 dígitos',
        });
      }
    }

    if (value.participantKind === 'company') {
      if (!value.cnpj || !/^[0-9]{14}$/.test(value.cnpj)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cnpj'],
          message: 'Informe um CNPJ com 14 dígitos',
        });
      }
    }
  });

type InviteFormData = z.infer<typeof inviteFormSchema>;

function formatCPF(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function RouteComponent() {
  const { id } = Route.useParams();

  const { data, isPending, isError } = useQuery({
    queryKey: ['invite', id],
    queryFn: () => findInvites(id),
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      participantKind: 'person',
      name: '',
      cpf: '',
      cnpj: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (!data?.participant) {
      return;
    }

    const isCompanyParticipant = Boolean(data.participant.company);

    reset({
      participantKind: isCompanyParticipant ? 'company' : 'person',
      name:
        data.participant.person?.name ??
        data.participant.company?.companyName ??
        '',
      cpf: data.participant.person?.cpf?.replace(/\D/g, '') ?? '',
      cnpj: data.participant.company?.cnpj?.replace(/\D/g, '') ?? '',
      email:
        data.participant.person?.email ?? data.participant.company?.email ?? '',
      phone:
        data.participant.person?.phone?.replace(/\D/g, '') ??
        data.participant.company?.phone?.replace(/\D/g, '') ??
        '',
    });
  }, [data, reset]);

  type UpdatePersonVariables = {
    personId: string;
    data: UpdatePersonData;
  };

  const { mutateAsync: updatePersonMutate } = useMutation({
    mutationFn: ({ data, personId }: UpdatePersonVariables) =>
      updatePerson(personId, data),
    onSuccess: () => {
      toast.success('Dados atualizados com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar os dados. Tente novamente.');
    },
  });

  const handleCompleteInvite = async (formData: InviteFormData) => {
    if (!data?.participant) {
      toast.error('Dados do convite não estão disponíveis');
      return;
    }

    if (data.participant.personId) {
      await updatePersonMutate({
        personId: data.participant.personId!,
        data: {
          name: formData.name,
          cpf: formData.cpf || null,
          email: formData.email,
          phone: formData.phone,
        },
      });
    }
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const participantKind = watch('participantKind');

  if (isPending) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6 bg-muted/30">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Carregando convite...</CardTitle>
            <CardDescription>
              Estamos preparando sua experiência.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isError || !data?.participant) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6 bg-muted/30">
        <Card className="w-full max-w-xl border-destructive/40">
          <CardHeader>
            <CardTitle>Convite inválido</CardTitle>
            <CardDescription>
              Não foi possível carregar os dados do convite. Verifique o link e
              tente novamente.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const participant = data.participant;
  const participantName =
    participant.person?.name ||
    participant.company?.companyName ||
    'Convidado(a)';
  const participantType = participant.type.toLowerCase();
  const isCompanyParticipant = participantKind === 'company';

  return (
    <main className="min-h-dvh bg-linear-to-br from-background via-background to-muted/40 px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center">
        <Card className="w-full border-primary/20 shadow-xl">
          <CardHeader className="gap-4">
            <Badge variant="secondary" className="w-fit rounded-md px-3 py-1">
              Convite recebido
            </Badge>
            <div className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl">
                Boas-vindas, {participantName}!
              </CardTitle>
              <CardDescription className="text-base md:text-md leading-relaxed">
                Você foi convidado(a) para participar deste processo como{' '}
                <span className="font-semibold text-foreground">
                  {participantType}
                </span>
                . Para continuar, precisamos de mais alguns dados.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form
              className="space-y-6"
              onSubmit={handleSubmit(handleCompleteInvite)}
            >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">
                    {isCompanyParticipant
                      ? 'Nome da empresa (revise e atualize se necessário)'
                      : 'Nome completo (revise e atualize se necessário)'}
                  </FieldLabel>
                  <Input
                    {...register('name')}
                    id="name"
                    placeholder={
                      isCompanyParticipant
                        ? 'Nome da empresa'
                        : 'Seu nome completo'
                    }
                    type="text"
                    required
                  />
                  {errors.name?.message && (
                    <ErrorForm message={errors.name.message} />
                  )}
                </Field>

                {!isCompanyParticipant && (
                  <Field>
                    <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                    <Controller
                      control={control}
                      name="cpf"
                      render={({ field }) => (
                        <Input
                          id="cpf"
                          placeholder="000.000.000-00"
                          type="text"
                          required
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={formatCPF(field.value || '')}
                          onChange={(e) => {
                            field.onChange(
                              e.target.value.replace(/\D/g, '').slice(0, 11)
                            );
                          }}
                        />
                      )}
                    />
                    {errors.cpf?.message && (
                      <ErrorForm message={errors.cpf.message} />
                    )}
                  </Field>
                )}

                {isCompanyParticipant && (
                  <Field>
                    <FieldLabel htmlFor="cnpj">CNPJ</FieldLabel>
                    <Input
                      {...register('cnpj')}
                      id="cnpj"
                      placeholder="Apenas números"
                      type="text"
                      required
                    />
                    {errors.cnpj?.message && (
                      <ErrorForm message={errors.cnpj.message} />
                    )}
                  </Field>
                )}

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...register('email')}
                    id="email"
                    placeholder="email@exemplo.com"
                    type="email"
                    required
                  />
                  {errors.email?.message && (
                    <ErrorForm message={errors.email.message} />
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Telefone</FieldLabel>
                  <Input
                    {...register('phone')}
                    id="phone"
                    placeholder="Apenas números com DDD"
                    type="text"
                    required
                  />
                  {errors.phone?.message && (
                    <ErrorForm message={errors.phone.message} />
                  )}
                </Field>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
