"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Timer, ArrowRight, RefreshCcw } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function SessionExpiredPage() {
  const [countdown, setCountdown] = useState(10);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = "/signin";
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const progress = ((10 - countdown) / 10) * 100;

  return (
    <AuthLayout
      spotlight={{
        quote: "Session expiry keeps your work protected even when you step away. Eridock Studio never compromises on security, even for convenience.",
        attribution: "Security Team",
        role: "Orangebase Platform",
      }}
      stats={[
        { label: "Session timeout", value: "2 hrs" },
        { label: "Auto-save freq", value: "30 sec" },
        { label: "Drafts saved", value: "100%" },
      ]}
    >
      <div className="animate-fade-up text-center">
        {/* Icon with spinning ring */}
        <div className="mx-auto mb-6 relative w-fit">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "var(--color-warning-bg)",
              border: "1px solid rgba(217,119,6,0.2)",
            }}
          >
            <Timer size={28} strokeWidth={1.5} style={{ color: "var(--color-warning)" }} />
          </div>
          {/* Countdown badge */}
          <div
            className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: "var(--color-brand)", fontSize: "12px" }}
          >
            {countdown}
          </div>
        </div>

        <h1
          className="mb-2"
          style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.03em" }}
        >
          Session expired
        </h1>
        <p
          className="mb-6"
          style={{ fontSize: "14px", color: "var(--app-text-secondary)", lineHeight: 1.65 }}
        >
          Your session timed out after 2 hours of inactivity. Your work was saved automatically.
          You&apos;ll be redirected to sign in shortly.
        </p>

        {/* Progress bar */}
        <div
          className="rounded-full mb-8 overflow-hidden"
          style={{
            height: "4px",
            background: "var(--color-neutral-200)",
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progress}%`,
              background: "var(--color-brand)",
            }}
          />
        </div>

        <p
          className="mb-8"
          style={{ fontSize: "13px", color: "var(--color-neutral-400)" }}
        >
          Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}…
        </p>

        {/* Saved work notice */}
        <div
          className="rounded-xl p-4 mb-8"
          style={{
            background: "var(--color-success-bg)",
            border: "1px solid rgba(22,163,74,0.15)",
          }}
        >
          <p style={{ fontSize: "13px", color: "var(--color-success)", lineHeight: 1.6 }}>
            ✓ All your unsaved work has been preserved. It will be waiting for you when you sign back in.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/signin"
            className="studio-btn studio-btn-primary w-full"
            style={{ height: "44px", fontSize: "14px", display: "flex" }}
          >
            Sign in again
            <ArrowRight size={15} />
          </Link>
          <button
            onClick={() => setCountdown(10)}
            className="studio-btn studio-btn-ghost w-full"
            style={{ height: "40px", fontSize: "13px" }}
          >
            <RefreshCcw size={13} />
            Cancel redirect
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
