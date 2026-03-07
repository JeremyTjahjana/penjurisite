"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Coding Problems", href: "/problems" },
  { label: "Your IPK", href: "/kalkulator-ipk" },
];

export default function AppSidebar() {
  const { user, isLoaded } = useUser();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <Sidebar collapsible="icon" side={isMobile ? "right" : "left"}>
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
              onClick={() => {
                if (isMobile) {
                  setOpenMobile(false);
                }
              }}
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-zinc-100 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:origin-left after:rounded-full after:bg-zinc-900 after:transition-transform after:duration-300 group-data-[collapsible=icon]:after:hidden ${
                isActive(item.href)
                  ? "text-zinc-900 after:scale-x-100"
                  : "text-zinc-700 hover:text-zinc-900 after:scale-x-0"
              }`}
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
                  userButtonPopoverCard: "z-[9999]",
                  userButtonPopoverActionButton: "hover:bg-zinc-100",
                },
              }}
              afterSignOutUrl="/"
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
