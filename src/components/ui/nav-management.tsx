import { Building2, UserLock } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';

export function NavManagement() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Gerência</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Gerenciar Usuários">
            <Link to="/users" className="flex gap-2 items-center ">
              <UserLock className="w-4 h-4" />
              <span>Usuários</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Gerenciar Organização">
            <Link to="/organization" className="flex gap-2 items-center">
              <Building2 className="w-4 h-4" />
              <span>Organização</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
