"use client";

import { useEffect } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/Sidebar";
import AppSidebar from "@/components/AppSidebar";
import { supabase } from "@/lib/supabase";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Track visitor on page load
    const trackVisitor = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const { ip } = await response.json();

        // Create a simple hash from IP for privacy
        const hash = await hashIp(ip);

        await supabase.from("site_stats").insert([
          {
            visitor_ip: ip,
            visitor_hash: hash,
            page_path: window.location.pathname,
            visited_at: new Date().toISOString(),
            created_date: new Date().toISOString().split("T")[0],
          },
        ]);
      } catch (error) {
        console.error("Error tracking visitor:", error);
      }
    };

    trackVisitor();
  }, []);

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

// Simple hash function for IP privacy
async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
