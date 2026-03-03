import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '../ui/dialog';
import { ErrorForm } from '../ui/error-form';
import { Field, FieldGroup } from '../ui/field';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createProcess } from '@/api/processes/create-process';
import { useUserStore } from '@/store/user-store';
import { toast } from 'sonner';
import { queryClient } from '@/lib/query-client';

const createProcessSchema = z.object({
  typeProperty: z.enum(['PLANTA', 'NOVO', 'INDIVIDUAL']),
  name: z.string().min(1, 'O nome do empreendimento é obrigatório'),
  clientName: z.string().min(1, 'O nome do cliente é obrigatório'),
  vgv: z.string().min(1, 'O VGV é obrigatório'),
});

type CreateProcessFormData = z.infer<typeof createProcessSchema>;

export function CreateProcessDialog() {
  const { user } = useUserStore();

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateProcessFormData>({
    resolver: zodResolver(createProcessSchema),
  });

  const { mutateAsync: createProcessMutate } = useMutation({
    mutationFn: createProcess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      toast.success('Processo criado com sucesso!');
      reset();
    },
  });

  const handleCreateProcess = async (data: CreateProcessFormData) => {
    const response = await createProcessMutate({
      name: data.name,
      clientName: data.clientName,
      processType: data.typeProperty,
      tenantId: user!.tenant.id,
    });

    console.log(response);
  };

  return (
    <DialogContent>
      <form action="" onSubmit={handleSubmit(handleCreateProcess)}>
        <DialogTitle>Novo processo:</DialogTitle>
        <FieldGroup className="mt-10">
          <Field>
            <Label htmlFor="typeProperty">Tipo do imóvel:</Label>

            <Controller
              name="typeProperty"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>

                  <SelectContent position="popper">
                    <SelectGroup>
                      <SelectLabel>Tipo do imóvel:</SelectLabel>
                      <SelectItem value="PLANTA">Imóvel na planta</SelectItem>
                      <SelectItem value="NOVO">Imóvel novo</SelectItem>
                      <SelectItem value="INDIVIDUAL">
                        Imóvel individual
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors && errors.typeProperty?.message && (
              <ErrorForm message={errors.typeProperty.message} />
            )}
          </Field>
          <Field>
            <Label htmlFor="name">Nome do empreendimento:</Label>

            <Input {...register('name')} id="name" name="name" placeholder="" />

            {errors && errors.name?.message && (
              <ErrorForm message={errors.name.message} />
            )}
          </Field>
          <Field>
            <Label htmlFor="clientName">Nome do cliente:</Label>
            <Input
              {...register('clientName')}
              id="clientName"
              name="clientName"
            />
            {errors && errors.clientName?.message && (
              <ErrorForm message={errors.clientName.message} />
            )}
          </Field>
          <Field>
            <Label htmlFor="vgv">
              VGV:{' '}
              <span className="text-xs text-muted-foreground">(opicional)</span>
            </Label>
            <Input {...register('vgv')} id="vgv" name="vgv" />

            {errors && errors.vgv?.message && (
              <ErrorForm message={errors.vgv.message} />
            )}
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-5">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" disabled={false}>
            Criar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
