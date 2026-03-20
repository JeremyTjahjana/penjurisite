"use client";

import { useEffect, useRef, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";

interface AuthRequiredModalProps {
  onClose: () => void;
  feature: "solusi" | "hints";
}

export function AuthRequiredModal({
  onClose,
  feature,
}: AuthRequiredModalProps) {
  const clerk = useClerk();
  const { user, isLoaded } = useUser();
  const [pendingAuthAction, setPendingAuthAction] = useState<"sign-in" | "sign-up" | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingActionRef = useRef<"sign-in" | "sign-up" | null>(null);

  const clearPendingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const setPendingState = (value: "sign-in" | "sign-up" | null) => {
    pendingActionRef.current = value;
    setPendingAuthAction(value);
  };

  const handleSignIn = () => {
    clearPendingTimeout();
    setPendingState("sign-in");
    toast.loading("Signing in...", { id: "auth-action" });
    void clerk.openSignIn();

    timeoutRef.current = setTimeout(() => {
      if (pendingActionRef.current === "sign-in") {
        toast.error("Sign in was not completed", { id: "auth-action" });
        setPendingState(null);
      }
    }, 60000);
  };

  const handleSignUp = () => {
    clearPendingTimeout();
    setPendingState("sign-up");
    toast.loading("Signing up...", { id: "auth-action" });
    void clerk.openSignUp();

    timeoutRef.current = setTimeout(() => {
      if (pendingActionRef.current === "sign-up") {
        toast.error("Sign up was not completed", { id: "auth-action" });
        setPendingState(null);
      }
    }, 60000);
  };

  useEffect(() => {
    if (!isLoaded || !user || !pendingAuthAction) {
      return;
    }

    clearPendingTimeout();
    if (pendingAuthAction === "sign-in") {
      toast.success("Successfully signed in", { id: "auth-action" });
    } else {
      toast.success("Successfully signed up", { id: "auth-action" });
    }
    setPendingState(null);
    onClose();
  }, [isLoaded, onClose, pendingAuthAction, user]);

  useEffect(() => {
    return () => {
      clearPendingTimeout();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl md:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="mb-2 text-lg font-bold text-zinc-900 md:text-xl">
            Login Diperlukan
          </h2>
          <p className="text-sm text-zinc-600 md:text-base">
            Silakan masuk atau buat akun untuk melihat {feature}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSignIn}
            className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 md:text-base"
          >
            Sign In
          </button>
          <button
            onClick={handleSignUp}
            className="w-full rounded-lg border-2 border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 md:text-base"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
