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

const createProcessSchema = z.object({
  typeProperty: z.string().min(1, 'O tipo do imóvel é obrigatório'),
  name: z.string().min(1, 'O nome do empreendimento é obrigatório'),
  clientName: z.string().min(1, 'O nome do cliente é obrigatório'),
  vgv: z.string().min(1, 'O VGV é obrigatório'),
});

type CreateProcessFormData = z.infer<typeof createProcessSchema>;

export function CreateProcessDialog() {
  const {
    register,
    control,
    formState: { errors },
  } = useForm<CreateProcessFormData>({
    resolver: zodResolver(createProcessSchema),
  });

  return (
    <DialogContent>
      <form action="">
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
                      <SelectItem value="ADMIN">Imóvel na planta</SelectItem>
                      <SelectItem value="ADMIN">Imóvel na novo</SelectItem>
                      <SelectItem value="ADMIN">
                        Imóvel na individual
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
        <DialogFooter className='mt-5'>
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
