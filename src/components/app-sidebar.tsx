"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconCirclePlusFilled,
  IconDashboard,
  IconChartBar,
  IconUsers,
  IconSettings,
  IconQuestionMark,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { CreateQuizModal } from "@/components/dashboard/CreateQuizModal";

const data = {
  user: {
    name: "Usuário",
    email: "usuario@example.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Criação Rápida",
      action: "create-quiz" as const, // Mudado de URL para ação
      icon: IconCirclePlusFilled,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Membros",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Configurações",
      url: "#",
      icon: IconSettings,
    },
  ],
};

type NavItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
} & ({ url: string; action?: never } | { action: "create-quiz"; url?: never });

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);

  const handleItemClick = (item: NavItem) => {
    if (item.action === "create-quiz") {
      setIsCreateQuizModalOpen(true);
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <IconQuestionMark className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Funnel Quiz</span>
                  <span className="text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => {
                const isActive = item.url ? pathname === item.url : false;
                const isCreateQuizAction = item.action === "create-quiz";

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={!!item.url}
                      isActive={isActive}
                      onClick={
                        item.action ? () => handleItemClick(item) : undefined
                      }
                      className={
                        isCreateQuizAction
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-medium"
                          : ""
                      }
                    >
                      {item.url ? (
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />

      {/* Modal de Criação de Quiz */}
      <CreateQuizModal
        open={isCreateQuizModalOpen}
        onOpenChange={setIsCreateQuizModalOpen}
      />
    </Sidebar>
  );
}
