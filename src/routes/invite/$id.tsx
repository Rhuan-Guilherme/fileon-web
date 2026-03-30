import {
  updateCompany,
  type UpdateCompanyData,
} from '@/api/company/update-company';
import { findInvites } from '@/api/participant/find-invites';
import {
  updatePerson,
  type UpdatePersonData,
} from '@/api/participant/update-person';
import { createPersonInParticipant } from '@/api/person/create-person-in-participant';
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
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Lock } from 'lucide-react';

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

function formatRepresentativeName(representative: {
  person?: { name: string } | null;
  personId: string;
}) {
  return (
    representative.person?.name || `Representante (${representative.personId})`
  );
}

function PasswordGate({
  onUnlock,
  inviteId,
}: {
  onUnlock: (password: string) => void;
  inviteId: string;
}) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState('');
  const [saveSession, setSaveSession] = useState(false);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError('');

    if (digit && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 4);
    if (!pasted) return;
    const next = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, 3)]?.focus();
  }

  function handleSubmit() {
    const password = digits.join('');
    if (password.length < 4) {
      setError('Digite os 4 dígitos da senha');
      return;
    }
    if (saveSession) {
      localStorage.setItem(`invite_session_${inviteId}`, password);
    }
    onUnlock(password);
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 bg-linear-to-br from-background via-background to-muted/40">
      <Card className="w-full max-w-sm border-primary/20 shadow-xl">
        <CardHeader className="items-center text-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-xl">Senha de acesso</CardTitle>
            <CardDescription>
              Digite a senha de 4 dígitos para acessar os dados do convite.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <Input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="h-14 w-14 text-center text-2xl font-bold tracking-widest"
              />
            ))}
          </div>
          {error && <ErrorForm message={error} />}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={saveSession}
              onChange={(e) => setSaveSession(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-muted-foreground">
              Manter sessão salva
            </span>
          </label>
          <Button className="w-full" onClick={handleSubmit}>
            Acessar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function RouteComponent() {
  const { id } = Route.useParams();
  const [passwordToken, setPasswordToken] = useState<string | null>(() => {
    return localStorage.getItem(`invite_session_${id}`);
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

  const { data, isPending, isError } = useQuery({
    queryKey: ['invite', id, passwordToken],
    queryFn: () => findInvites(id, passwordToken!),
    enabled: !!passwordToken,
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

  type UpdateCompanyVariables = {
    companyId: string;
    data: UpdateCompanyData;
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

  const { mutateAsync: updateCompanyMutate } = useMutation({
    mutationFn: ({ companyId, data }: UpdateCompanyVariables) =>
      updateCompany(companyId, data),
    onSuccess: () => {
      toast.success('Dados atualizados com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar os dados. Tente novamente.');
      console.log('Erro ao atualizar empresa', { data });
    },
  });

  const { mutateAsync: createPersonInParticipantMutate } = useMutation({
    mutationFn: ({ personId, data }: UpdatePersonVariables) =>
      createPersonInParticipant(personId, data),
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

    if (data.participant.companyId) {
      await updateCompanyMutate({
        companyId: data.participant.companyId!,
        data: {
          companyName: formData.name,
          cnpj: formData.cnpj || null,
          email: formData.email,
          phone: formData.phone,
        },
      });
    }

    if (!data.participant.companyId && !data.participant.personId) {
      await createPersonInParticipantMutate({
        personId: data.participant.id,
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

  if (!passwordToken) {
    return <PasswordGate inviteId={id} onUnlock={setPasswordToken} />;
  }

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
              tente novamente. A senha pode estar incorreta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem(`invite_session_${id}`);
                setPasswordToken(null);
              }}
            >
              Tentar novamente
            </Button>
          </CardContent>
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
  const companyRepresentatives =
    participant.company?.companyRepresentatives ?? [];

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

                {participant.company && (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-sm font-medium text-foreground">
                      Representantes vinculados
                    </p>

                    {companyRepresentatives.length > 0 ? (
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                        {companyRepresentatives.map((representative) => (
                          <li
                            className="rounded-md border border-border/60 bg-background/80 px-3 py-2 space-y-1"
                            key={representative.id}
                          >
                            <p className="font-medium text-foreground">
                              {formatRepresentativeName(representative)}
                            </p>
                            {representative.person?.email && (
                              <p>Email: {representative.person.email}</p>
                            )}
                            {representative.person?.phone && (
                              <p>Telefone: {representative.person.phone}</p>
                            )}
                            {representative.person?.cpf && (
                              <p>CPF: {representative.person.cpf}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Nenhum representante cadastrado para esta empresa.
                      </p>
                    )}
                  </div>
                )}

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
