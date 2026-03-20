"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useClerk,
  useUser,
} from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
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
  const clerk = useClerk();
  const { user, isLoaded } = useUser();
  const isMobile = useIsMobile();
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<"sign-in" | "sign-up" | null>(null);
  const [pendingProfileChange, setPendingProfileChange] = useState<string | null>(null);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);
  const authTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAuthActionRef = useRef<"sign-in" | "sign-up" | null>(null);
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();

  const handleSignOut = async (closeDesktopMenu = false) => {
    if (closeDesktopMenu) {
      setDesktopMenuOpen(false);
    }

    const toastId = toast.loading("Signing out...", { id: "auth-action" });

    try {
      await clerk.signOut();
      toast.success("Successfully signed out", { id: toastId });
    } catch {
      toast.error("Failed to sign out", { id: toastId });
    }
  };

  const clearAuthTimeout = () => {
    if (authTimeoutRef.current) {
      clearTimeout(authTimeoutRef.current);
      authTimeoutRef.current = null;
    }
  };

  const clearProfileTimeout = () => {
    if (profileTimeoutRef.current) {
      clearTimeout(profileTimeoutRef.current);
      profileTimeoutRef.current = null;
    }
  };

  const setPendingAuthState = (value: "sign-in" | "sign-up" | null) => {
    pendingAuthActionRef.current = value;
    setPendingAuthAction(value);
  };

  const setPendingProfileState = (value: string | null) => {
    setPendingProfileChange(value);
  };

  const getProfileFingerprint = () => {
    return [
      user?.firstName ?? "",
      user?.lastName ?? "",
      user?.username ?? "",
      user?.imageUrl ?? "",
      user?.primaryEmailAddress?.emailAddress ?? "",
    ].join("|");
  };

  const handleSignIn = () => {
    clearAuthTimeout();
    setPendingAuthState("sign-in");
    toast.loading("Signing in...", { id: "auth-action" });
    void clerk.openSignIn();

    authTimeoutRef.current = setTimeout(() => {
      if (pendingAuthActionRef.current === "sign-in") {
        toast.error("Sign in was not completed", { id: "auth-action" });
        setPendingAuthState(null);
      }
    }, 60000);
  };

  const handleSignUp = () => {
    clearAuthTimeout();
    setPendingAuthState("sign-up");
    toast.loading("Signing up...", { id: "auth-action" });
    void clerk.openSignUp();

    authTimeoutRef.current = setTimeout(() => {
      if (pendingAuthActionRef.current === "sign-up") {
        toast.error("Sign up was not completed", { id: "auth-action" });
        setPendingAuthState(null);
      }
    }, 60000);
  };

  const handleOpenUserProfile = (closeDesktopMenu = false) => {
    if (closeDesktopMenu) {
      setDesktopMenuOpen(false);
    }

    clearProfileTimeout();
    setPendingProfileState(getProfileFingerprint());
    toast.loading("Updating profile...", { id: "profile-action" });
    void clerk.openUserProfile();

    profileTimeoutRef.current = setTimeout(() => {
      toast.error("Profile update was not completed", { id: "profile-action" });
      setPendingProfileState(null);
    }, 120000);
  };

  useEffect(() => {
    if (!isLoaded || !pendingAuthAction || !user) {
      return;
    }

    clearAuthTimeout();
    if (pendingAuthAction === "sign-in") {
      toast.success("Successfully signed in", { id: "auth-action" });
    } else {
      toast.success("Successfully signed up", { id: "auth-action" });
    }
    setPendingAuthState(null);
  }, [isLoaded, pendingAuthAction, user]);

  useEffect(() => {
    if (!isLoaded || !user || !pendingProfileChange) {
      return;
    }

    const currentFingerprint = getProfileFingerprint();
    if (currentFingerprint !== pendingProfileChange) {
      clearProfileTimeout();
      toast.success("Successfully updated profile", { id: "profile-action" });
      setPendingProfileState(null);
    }
  }, [
    isLoaded,
    pendingProfileChange,
    user,
    user?.firstName,
    user?.lastName,
    user?.username,
    user?.imageUrl,
    user?.primaryEmailAddress?.emailAddress,
  ]);

  useEffect(() => {
    return () => {
      clearAuthTimeout();
      clearProfileTimeout();
    };
  }, []);

  useEffect(() => {
    if (!desktopMenuOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target as Node)
      ) {
        setDesktopMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [desktopMenuOpen]);

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
          <div className="text-sm group-data-[collapsible=icon]:justify-center">
            {isMobile ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profile picture"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700">
                      {user.firstName?.charAt(0) || user.username?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full rounded-lg bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300"
                  onClick={() => {
                    handleOpenUserProfile();
                  }}
                >
                  Manage Account
                </button>

                <button
                  type="button"
                  className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                  onClick={() => {
                    void handleSignOut();
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div ref={desktopMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setDesktopMenuOpen((value) => !value)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition hover:bg-zinc-100 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                >
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profile picture"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700">
                      {user.firstName?.charAt(0) || user.username?.charAt(0) || "U"}
                    </div>
                  )}

                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="font-medium text-zinc-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 text-zinc-500 transition-transform group-data-[collapsible=icon]:hidden ${
                      desktopMenuOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {desktopMenuOpen && (
                  <div className="absolute bottom-full left-0 z-30 mb-2 w-full rounded-lg border border-zinc-200 bg-white p-2 shadow-lg group-data-[collapsible=icon]:w-52">
                    <button
                      type="button"
                      className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-900 transition hover:bg-zinc-100"
                      onClick={() => {
                        handleOpenUserProfile(true);
                      }}
                    >
                      Manage Account
                    </button>

                    <button
                      type="button"
                      className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm text-zinc-900 transition hover:bg-zinc-100"
                      onClick={() => {
                        void handleSignOut(true);
                      }}
                    >
                      Sign Out
                    </button>
                </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 group-data-[collapsible=icon]:px-2"
              onClick={handleSignIn}
            >
              <span className="group-data-[collapsible=icon]:hidden">
                Sign In
              </span>
              <span className="hidden group-data-[collapsible=icon]:inline text-xs">
                In
              </span>
            </button>
            <button
              className="w-full rounded-lg bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300 group-data-[collapsible=icon]:px-2"
              onClick={handleSignUp}
            >
              <span className="group-data-[collapsible=icon]:hidden">
                Sign Up
              </span>
              <span className="hidden group-data-[collapsible=icon]:inline text-xs">
                Up
              </span>
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
