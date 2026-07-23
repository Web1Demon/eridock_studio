"use client";

import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function AccountLockedPage() {
  const lockReason = "Too many failed sign-in attempts";
  const lockedUntil = "15 minutes";
  const attemptCount = 5;

  return (
    <AuthLayout
      spotlight={{
        quote: "Account lockout policies are in place to protect our experts' work. If this was a mistake, support will restore your access quickly.",
        attribution: "Security Team",
        role: "Orangebase Platform",
      }}
      stats={[
        { label: "Threats blocked", value: "99.8%" },
        { label: "Avg unlock time", value: "< 5 min" },
        { label: "Support SLA", value: "1 hr" },
      ]}
    >
      <div className="animate-fade-up text-center">
        {/* Icon */}
        <div
          className="mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: "var(--color-error-bg)",
            border: "1px solid rgba(220,38,38,0.15)",
          }}
        >
          <Lock size={28} strokeWidth={1.5} style={{ color: "var(--color-error)" }} />
        </div>

        <h1
          className="mb-2"
          style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.03em" }}
        >
          Account locked
        </h1>
        <p
          className="mb-8"
          style={{ fontSize: "14px", color: "var(--app-text-secondary)", lineHeight: 1.65 }}
        >
          Your account has been temporarily locked for security reasons. Please wait or contact support to restore access.
        </p>

        {/* Details card */}
        <div
          className="rounded-xl p-5 mb-8 text-left"
          style={{
            background: "var(--color-neutral-0)",
            border: "1px solid var(--color-neutral-200)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex flex-col gap-3">
            <div
              className="flex items-start gap-3 pb-3"
              style={{ borderBottom: "1px solid var(--app-border)" }}
            >
              <ShieldAlert
                size={14}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "var(--color-error)" }}
              />
              <div>
                <p className="font-medium" style={{ fontSize: "13px", color: "var(--color-neutral-800)" }}>
                  Reason
                </p>
                <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", marginTop: "2px" }}>
                  {lockReason} ({attemptCount} attempts)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock
                size={14}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "var(--color-neutral-400)" }}
              />
              <div>
                <p className="font-medium" style={{ fontSize: "13px", color: "var(--color-neutral-800)" }}>
                  Locked for
                </p>
                <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", marginTop: "2px" }}>
                  {lockedUntil} from the time of lockout
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/forgot-password"
            className="studio-btn studio-btn-primary w-full"
            style={{ height: "44px", fontSize: "14px", display: "flex" }}
          >
            Reset my password
            <ArrowRight size={15} />
          </Link>
          <a
            href="mailto:support@eridock.com"
            className="studio-btn studio-btn-secondary w-full"
            style={{ height: "44px", fontSize: "14px", display: "flex" }}
          >
            <Mail size={15} />
            Contact support
          </a>
          <Link
            href="/signin"
            className="studio-btn studio-btn-ghost w-full"
            style={{ height: "40px", fontSize: "13px" }}
          >
            Try signing in again
          </Link>
        </div>

        <p
          className="mt-6"
          style={{ fontSize: "12px", color: "var(--color-neutral-400)", lineHeight: 1.6 }}
        >
          If this wasn&apos;t you, please{" "}
          <a
            href="mailto:security@eridock.com"
            style={{ color: "var(--color-brand)", fontWeight: 500 }}
          >
            report suspicious activity
          </a>{" "}
          immediately.
        </p>
      </div>
    </AuthLayout>
  );
}
