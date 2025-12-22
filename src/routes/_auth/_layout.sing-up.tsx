import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_layout/sing-up')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <form className="w-11/12 max-w-sm mx-auto flex flex-col gap-4 mt-10">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input type="text" id="name" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input type="password" id="password" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input type="password" id="password" />
      </div>
      <div>
        <Button type="submit">Registrar</Button>
      </div>
      <Link to="/sing-in">Login</Link>
    </form>
  );
}
