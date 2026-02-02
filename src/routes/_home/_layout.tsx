import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { authSessionUser } from '@/hooks/auth-session-user';

import {
  createFileRoute,
  Link,
  Outlet,
  useMatches,
} from '@tanstack/react-router';

export const Route = createFileRoute('/_home/_layout')({
  component: RouteComponent,
  beforeLoad: async () => {
    await authSessionUser();
  },
});

function RouteComponent() {
  const matches = useMatches();

  const breadcrumbs = matches
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((match) => (match.staticData as any)?.breadcrumb)
    .map((match) => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      label: (match.staticData as any)?.breadcrumb,
      to: match.pathname,
    }));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <Link to="/home">Dashboard</Link>
                </BreadcrumbItem>
                {breadcrumbs[0] && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {breadcrumbs[breadcrumbs.length - 1]?.label}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
