"use client";

import {
  BellIcon,
  Building2Icon,
  LayoutDashboardIcon,
  LogOutIcon,
  MailIcon,
  ShieldIcon,
  UserCircleIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/features/auth/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";
import { TenantAdminAuthGuard } from "@/features/auth/components/tenant-admin-auth-guard";
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

const PLATFORM_NAME = "TVET MEMO";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboardIcon },
  { label: "Directory", href: "/admin/directory", icon: UsersIcon },
  { label: "Departments", href: "/admin/departments", icon: Building2Icon },
  { label: "Roles", href: "/admin/roles", icon: ShieldIcon },
  { label: "Memos", href: "/admin/memos", icon: MailIcon },
] as const;

const authItems = [{ label: "Sign out", icon: LogOutIcon }] as const;

function isNavActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname.startsWith(href);
}

export default function TenantAdminLayout({
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
    <TenantAdminAuthGuard>
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
            <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
              <img
                src="/logo/icon.png"
                alt="TVET MEMO"
                className="size-8 shrink-0"
              />
              <div className="group-data-[collapsible=icon]:hidden">
                <h1 className="text-2xl font-bold leading-none text-sidebar-foreground">
                  {PLATFORM_NAME}
                </h1>
                <p className="mt-1 text-xs text-secondary">
                  Institution Admin
                </p>
              </div>
            </div>
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
            <div className="flex items-center gap-2">
              <img src="/logo/icon.png" alt="" className="size-6" />
              <h2 className="text-lg font-semibold text-primary">{PLATFORM_NAME}</h2>
            </div>

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
    </TenantAdminAuthGuard>
  );
}
