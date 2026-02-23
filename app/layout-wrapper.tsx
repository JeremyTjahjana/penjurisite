"use client";

import { SidebarProvider } from "@/components/ui/Sidebar";
import AppSidebar from "@/components/AppSidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
        <AppSidebar />
        <main className="flex min-h-screen flex-1 flex-col">{children}</main>
      </div>
    </SidebarProvider>
  );
}
