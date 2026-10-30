import { Suspense, type ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import "../globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appSidebar";
import Header from "@/components/header";
import { baseUrl } from "@/lib/utils";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mb-6"></div>
        </div>
      }
    >
      <Layout>{children}</Layout>
    </Suspense>
  );
}

async function Layout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();

  const response = await fetch(`${baseUrl}/auth/getuser`, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`Could not load user: ${response.status}`);
  }

  const data = await response.json();
  const currentUser = data.user;

  return (
    <SidebarProvider>
      <AppSidebar
        userName={currentUser?.name ?? "User"}
        userEmail={currentUser?.email ?? "Not provided"}
      />
      <SidebarInset>
        <Header userName={currentUser?.name ?? "User"} />

        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
