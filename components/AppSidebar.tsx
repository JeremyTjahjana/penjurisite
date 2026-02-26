"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/Sidebar";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Coding Problems C/C++", href: "/problems" },
  { label: "Your IPK", href: "/kalkulator-ipk" },
];

export default function AppSidebar() {
  const { user, isLoaded } = useUser();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-5 py-6">
        <div className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400 group-data-[collapsible=icon]:hidden">
          C/C++
        </div>
        <div className="mt-2 text-2xl font-semibold text-zinc-900 group-data-[collapsible=icon]:hidden">
          Dashboard
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-1 flex-col gap-2 px-3 pb-6">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center"
              title={item.label}
            >
              <span className="group-data-[collapsible=icon]:hidden">
                {item.label}
              </span>
              <span className="hidden group-data-[collapsible=icon]:inline text-xs">
                {item.label.charAt(0)}
              </span>
            </Link>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter className="border-t border-zinc-200 px-5 py-4">
        {isLoaded && user ? (
          <div className="flex items-center gap-3 text-sm group-data-[collapsible=icon]:justify-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="font-medium text-zinc-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <SignInButton mode="modal">
              <button className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 group-data-[collapsible=icon]:px-2">
                <span className="group-data-[collapsible=icon]:hidden">
                  Sign In
                </span>
                <span className="hidden group-data-[collapsible=icon]:inline text-xs">
                  In
                </span>
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="w-full rounded-lg bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300 group-data-[collapsible=icon]:px-2">
                <span className="group-data-[collapsible=icon]:hidden">
                  Sign Up
                </span>
                <span className="hidden group-data-[collapsible=icon]:inline text-xs">
                  Up
                </span>
              </button>
            </SignUpButton>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
