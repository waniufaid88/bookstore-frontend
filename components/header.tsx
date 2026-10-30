"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

type HeaderProps = {
  userName: string;
};

export default function Header({ userName }: HeaderProps) {
  return (
    <header className="flex h-14 items-center gap-3 border-b px-4">
      <SidebarTrigger />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-semibold text-green-800">Book Store</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm">
            Welcome,{" "}
            <em className="text-green-700 font-semibold text-lg">
              {userName}
            </em>{" "}
          </span>
        </div>
      </div>
    </header>
  );
}
