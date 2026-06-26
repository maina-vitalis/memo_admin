"use client";

import {
  BarChart3Icon,
  BellIcon,
  CircleHelpIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  TableIcon,
  UserCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/features/auth/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";
import { SuperAdminAuthGuard } from "@/features/auth/components/super-admin-auth-guard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const PLATFORM_NAME = "NostalQic";

const navItems = [
  { label: "Dashboard", href: "/super-admin", icon: LayoutDashboardIcon },
  { label: "Analytics", href: "/super-admin/analytics", icon: BarChart3Icon },
  { label: "Reports", href: "/super-admin/reports", icon: TableIcon },
  { label: "Settings", href: "/super-admin/settings", icon: SettingsIcon },
  { label: "Help", href: "/super-admin/help", icon: CircleHelpIcon },
] as const;

const authItems = [{ label: "Sign out", icon: LogOutIcon }] as const;

function isNavActive(pathname: string, href: string) {
  if (href === "/super-admin") {
    return (
      pathname === "/super-admin" ||
      pathname.startsWith("/super-admin/institutions")
    );
  }

  return pathname.startsWith(href);
}

export default function SuperAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  function handleSignOut() {
    dispatch(logout());
    router.push("/login");
  }

  return (
    <SuperAdminAuthGuard>
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "240px",
            "--sidebar-width-icon": "3rem",
          } as React.CSSProperties
        }
      >
        <Sidebar collapsible="icon" className="border-r-0">
          <SidebarHeader className="px-4 py-6 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-4">
            <h1 className="text-2xl font-bold leading-none text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              {PLATFORM_NAME}
            </h1>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const active = isNavActive(pathname, item.href);
                    const Icon = item.icon;

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.label}
                          className={cn(
                            "h-11 rounded-none",
                            active &&
                              "border-l-[3px] border-secondary bg-primary-container! text-sidebar-foreground",
                            !active &&
                              "text-sidebar-foreground/70 hover:bg-primary-container/50 hover:text-sidebar-foreground",
                          )}
                        >
                          <Link href={item.href}>
                            <Icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-2">
            <SidebarMenu>
              {authItems.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      type="button"
                      tooltip={item.label}
                      onClick={handleSignOut}
                      className="h-11 rounded-none text-sidebar-foreground/70 hover:bg-primary-container/50 hover:text-sidebar-foreground"
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset className="bg-background">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4 shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4!" />
            <h2 className="text-lg font-semibold text-primary">{PLATFORM_NAME}</h2>

            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-primary"
                aria-label="Notifications"
              >
                <BellIcon />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-primary"
                aria-label="Account"
              >
                <UserCircleIcon />
              </Button>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
    </SuperAdminAuthGuard>
  );
}
