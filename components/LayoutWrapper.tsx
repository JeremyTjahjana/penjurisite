"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/Sidebar";
import AppSidebar from "@/components/AppSidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-zinc-50 text-zinc-900">
        {/* Floating Toggle Button */}
        <div className="fixed top-4 right-4 z-40 md:left-4 md:right-auto">
          <SidebarTrigger className="bg-white shadow-md hover:bg-zinc-50 border border-zinc-200" />
        </div>
        <main className="flex min-h-screen flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
