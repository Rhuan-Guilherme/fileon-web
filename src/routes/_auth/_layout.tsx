import { createFileRoute, Outlet } from '@tanstack/react-router';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { FieldDescription } from '@/components/ui/field';
import { requireGuest } from '@/hooks/auth-session-user';

export const Route = createFileRoute('/_auth/_layout')({
  component: RouteComponent,
  beforeLoad: async () => {
    await requireGuest();
  },
});

function RouteComponent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className={cn('flex flex-col gap-6', className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Outlet />
              <div className="bg-muted relative hidden md:block">
                <img
                  src="/scream-light.png"
                  alt="Image"
                  className="absolute inset-0 h-[110%] w-full object-cover block dark:hidden"
                />

                <img
                  src="/scream.png"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover hidden dark:block dark:brightness-[0.9] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            Ao clicar em continuar, você concorda com nossos termos.
            <a href="#">Termos de serviços</a> e{' '}
            <a href="#">Política de Privacidade</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
