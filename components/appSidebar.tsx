"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  BookOpenCheck,
  Boxes,
  CircleUserRound,
  LayoutDashboard,
  RotateCcwClock,
  UserRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LogoutButton from "./logoutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "cn";

type SidebarProps = {
  userName: string;
  userEmail: string;
};

const navigationItems = [
  { href: "/bookstore", label: "Dashboard", icon: LayoutDashboard },
  { href: "/suppliers", label: "Suppliers", icon: UserRound },
  { href: "/customers", label: "Customers", icon: UserRound },
  { href: "/sale", label: "Sale ", icon: BookOpenCheck },
  { href: "/purchase", label: "Purchase ", icon: Boxes },
  {
    href: "/history",
    label: "Transaction History ",
    icon: RotateCcwClock,
  },
];

export function AppSidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-green-700" />
          <span className="text-lg font-bold tracking-tight">Book Store</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-1 px-2 py-2 ">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                      />
                    }
                    isActive={isActive}
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-3 text-md transition-colors",
                      isActive
                        ? "bg-gray-200! text-gray-950 font-semibold shadow-sm"
                        : "text-gray-700 hover:bg-gray-200",
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton className="cursor-pointer h-auto w-full justify-start gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-green-800 dark:text-green-300" />
            }
          >
            <CircleUserRound className="h-5 w-5 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-left">
              {userName}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setProfileOpen(true)}>
              <CircleUserRound className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Profile</DialogTitle>
              <DialogDescription>Your account details.</DialogDescription>
            </DialogHeader>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-medium text-muted-foreground">Name</dt>
                <dd>{userName}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Email</dt>
                <dd>{userEmail}</dd>
              </div>
            </dl>
            <DialogFooter>
              <LogoutButton />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
