'use client';

import * as React from 'react';
import { Frame, GalleryVerticalEnd, SquareTerminal } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { TeamSwitcher } from './ui/team-switcher';
import { NavMain } from './ui/nav-main';
import { NavProjects } from './ui/nav-project';
import { NavUser } from './ui/nav-user';
import { useUserStore } from '@/store/user-store';
import { useQuery } from '@tanstack/react-query';
import { getOrganizationsUser } from '@/api/oganization/get-organizations-user';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'FileOn Inc.',
      logo: GalleryVerticalEnd,
      plan: '10 membros',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserStore();

  const { data: organizations } = useQuery({
    queryKey: ['organizationsUser'],
    queryFn: getOrganizationsUser,
  });
  console.log(organizations?.data);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {organizations && <TeamSwitcher teams={organizations?.data || []} />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
