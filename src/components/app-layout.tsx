
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LayoutDashboard, History, BarChart2, Settings, LogIn } from 'lucide-react';
import { Bike } from './icons/bike';
import { buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import { GlobalTimer } from './logging/global-timer';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/log', label: 'Log Hours', icon: History },
  { href: '/stats', label: 'Statistics', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function AuthButton() {
    return (
        <a 
            href="https://www.notion.so/"
            className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start")}
        >
            <LogIn />
            <span>Open your notion</span>
        </a>
    );
}


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-4">
            <Bike className="text-sidebar-foreground" />
            <span className="text-lg font-semibold">Dhanric Deadline</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="px-4">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 flex flex-col gap-2">
            <GlobalTimer />
            <AuthButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            {/* The SidebarTrigger has been removed from here */}
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
