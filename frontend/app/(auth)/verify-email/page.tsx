"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, CheckCircle2, RefreshCcw } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [verified, setVerified] = useState(false);
  // Simulate: in real app, token comes from URL params
  const email = "amara.osei@organization.com";

  const handleResend = async () => {
    setResending(true);
    await new Promise((r) => setTimeout(r, 1400));
    setResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  };

  // Demo: simulate verification click
  const handleVerify = () => setVerified(true);

  return (
    <AuthLayout
      spotlight={{
        quote: "Every verified account in Eridock Studio means one more trusted voice helping shape quality educational content for learners across Africa.",
        attribution: "Eridock Platform",
        role: "Orangebase",
      }}
      stats={[
        { label: "Verified experts", value: "340+" },
        { label: "Avg verify time", value: "< 2 min" },
        { label: "Trust score", value: "A+" },
      ]}
    >
      <div className="animate-fade-up text-center">
        {!verified ? (
          <>
            {/* Icon */}
            <div
              className="mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "var(--color-brand-muted)",
                border: "1px solid rgba(255,107,0,0.15)",
              }}
            >
              <Mail size={28} strokeWidth={1.5} style={{ color: "var(--color-brand)" }} />
            </div>

            <h1
              className="mb-2"
              style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.03em" }}
            >
              Verify your email
            </h1>
            <p
              className="mb-2"
              style={{ fontSize: "14px", color: "var(--app-text-secondary)", lineHeight: 1.65 }}
            >
              We sent a verification link to
            </p>
            <p
              className="mb-8 font-semibold"
              style={{ fontSize: "14px", color: "var(--color-neutral-800)" }}
            >
              {email}
            </p>

            {/* Email preview card */}
            <div
              className="rounded-xl p-5 mb-8 text-left"
              style={{
                background: "var(--color-neutral-0)",
                border: "1px solid var(--color-neutral-200)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="flex items-center gap-3 pb-3 mb-3"
                style={{ borderBottom: "1px solid var(--app-border)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--color-brand)", opacity: 0.9 }}
                >
                  <Mail size={14} color="white" />
                </div>
                <div className="text-left">
                  <p
                    className="font-medium"
                    style={{ fontSize: "13px", color: "var(--color-neutral-800)" }}
                  >
                    Eridock Studio
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--color-neutral-400)" }}>
                    noreply@eridock.com
                  </p>
                </div>
              </div>
              <p
                className="mb-3 font-medium"
                style={{ fontSize: "13px", color: "var(--color-neutral-800)" }}
              >
                Confirm your Eridock Studio account
              </p>
              <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", lineHeight: 1.6 }}>
                Click the button below to verify your email address and activate your account.
              </p>
              <button
                onClick={handleVerify}
                className="studio-btn studio-btn-primary mt-4 w-full"
                style={{ height: "38px", fontSize: "13px" }}
              >
                Verify Email Address
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Resend */}
            <p style={{ fontSize: "13px", color: "var(--app-text-secondary)" }}>
              Didn&apos;t receive it?{" "}
              <button
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-1"
                style={{
                  color: "var(--color-brand)",
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "inherit",
                  padding: 0,
                }}
              >
                {resending ? (
                  <><Loader2 size={12} className="animate-spin" /> Resending…</>
                ) : resent ? (
                  <span style={{ color: "var(--color-success)" }}>✓ Resent!</span>
                ) : (
                  <><RefreshCcw size={12} /> Resend email</>
                )}
              </button>
            </p>

            <p
              className="mt-4"
              style={{ fontSize: "12px", color: "var(--color-neutral-400)" }}
            >
              Wrong email?{" "}
              <Link href="/signin" style={{ color: "var(--color-brand)", fontWeight: 500 }}>
                Sign in with a different account
              </Link>
            </p>
          </>
        ) : (
          /* ── Verified ── */
          <div className="animate-fade-in">
            <div
              className="mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "var(--color-success-bg)",
                border: "1px solid rgba(22,163,74,0.2)",
              }}
            >
              <CheckCircle2 size={30} style={{ color: "var(--color-success)" }} strokeWidth={1.5} />
            </div>
            <h2
              className="mb-2"
              style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.03em" }}
            >
              Email verified!
            </h2>
            <p
              className="mb-8"
              style={{ fontSize: "14px", color: "var(--app-text-secondary)", lineHeight: 1.65 }}
            >
              Your account is now active. Welcome to Eridock Studio — let&apos;s build something exceptional.
            </p>
            <Link
              href="/dashboard"
              className="studio-btn studio-btn-primary w-full"
              style={{ height: "44px", fontSize: "14px", display: "flex" }}
            >
              Enter Eridock Studio
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
