"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import {
  Shield,
  ShieldCheck,
  LogOut,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Lock,
} from "lucide-react";
import clsx from "clsx";

interface OAuthLoginSectionProps {
  onUserPrefill?: (user: { name?: string; email?: string; image?: string }) => void;
}

export function OAuthLoginSection({ onUserPrefill }: OAuthLoginSectionProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check user role: If admin, redirect to /admin, otherwise keep on /register
  useEffect(() => {
    if (session?.user) {
      const user = session.user as { role?: string; name?: string; email?: string; image?: string };
      
      // Auto pre-fill registration fields for regular users
      if (onUserPrefill) {
        onUserPrefill({
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }

      // If user is admin, redirect to admin dashboard
      if (user.role === "admin") {
        router.push("/admin");
      }
    }
  }, [session, router, onUserPrefill]);

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      setErrorMsg(null);
      setLoadingProvider(provider);

      await signIn.social({
        provider,
        callbackURL: typeof window !== "undefined" ? window.location.href : "/register",
      });
    } catch (err: unknown) {
      console.error("OAuth sign-in error:", err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : `Failed to authenticate with ${provider}. Please verify OAuth credentials in .env.`
      );
      setLoadingProvider(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (isPending) {
    return (
      <div className="border-4 border-black bg-white p-6 shadow-neo mb-8 flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-black" />
        <span className="font-mono text-xs font-black uppercase tracking-wider">
          CHECKING AUTHENTICATION STATUS...
        </span>
      </div>
    );
  }

  // If user is authenticated, return null (Navbar contains profile dropdown and logout)
  if (session?.user) {
    return null;
  }

  // If user is not authenticated: Show Google & GitHub OAuth Buttons
  return (
    <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo mb-8 space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-3 border-black pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-neo-secondary border-2 border-black flex items-center justify-center shadow-neo-sm">
            <Lock className="w-4 h-4 stroke-[3px] text-black" />
          </div>
          <div>
            <span className="font-mono text-[10px] font-black uppercase text-black/60">
              STEP 01 // IDENTITY VERIFICATION
            </span>
            <h3 className="font-black text-lg sm:text-xl text-black uppercase tracking-tight">
              SIGN IN WITH OAUTH (GOOGLE / GITHUB)
            </h3>
          </div>
        </div>
        <div className="font-mono text-[11px] font-bold bg-neo-bg px-2.5 py-1 border-2 border-black">
          AUTONOMOUS ROLE DISPATCH
        </div>
      </div>

      <p className="text-xs sm:text-sm font-bold text-black/80 leading-relaxed">
        Sign in with your Google or GitHub account to authenticate your squad credentials. Otherwise, your details will be pre-filled below for fast squad registration.
      </p>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => handleOAuthSignIn("google")}
          disabled={loadingProvider !== null}
          className={clsx(
            "h-14 px-6 bg-white text-black font-black text-sm uppercase tracking-wider border-3 border-black shadow-neo hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-black",
            loadingProvider === "google" && "opacity-75 cursor-wait"
          )}
        >
          {loadingProvider === "google" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>CONTINUE WITH GOOGLE</span>
        </button>

        {/* GitHub OAuth Button */}
        <button
          type="button"
          onClick={() => handleOAuthSignIn("github")}
          disabled={loadingProvider !== null}
          className={clsx(
            "h-14 px-6 bg-black text-white font-black text-sm uppercase tracking-wider border-3 border-black shadow-neo hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-black",
            loadingProvider === "github" && "opacity-75 cursor-wait"
          )}
        >
          {loadingProvider === "github" ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          )}
          <span>CONTINUE WITH GITHUB</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border-2 border-black text-rose-950 font-bold text-xs flex items-center gap-2">
          <Shield className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
