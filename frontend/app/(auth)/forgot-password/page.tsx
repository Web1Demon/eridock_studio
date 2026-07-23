"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, Loader2, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { AuthHeader, FormField } from "@/components/auth/AuthComponents";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Email address is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address"); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout
      spotlight={{
        quote: "Account security and access control are foundational to how we protect every expert's work inside Eridock Studio.",
        attribution: "Security Team",
        role: "Orangebase Platform",
      }}
      stats={[
        { label: "Uptime SLA", value: "99.9%" },
        { label: "Encrypted files", value: "1.2M+" },
        { label: "Sec reviews/yr", value: "4" },
      ]}
    >
      <div className="animate-fade-up">
        <Link
          href="/signin"
          className="inline-flex items-center gap-2 mb-8 studio-btn studio-btn-ghost px-0"
          style={{ fontSize: "13px", color: "var(--app-text-secondary)" }}
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>

        {!sent ? (
          <>
            <AuthHeader
              title="Forgot your password?"
              subtitle="No worries. Enter your email and we'll send you a secure reset link within minutes."
              badge="Password Reset"
            />

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-5">
                <FormField label="Email address" error={error} required>
                  <div className="relative">
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@organization.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`studio-input pl-10 ${error ? "error" : ""}`}
                      disabled={loading}
                    />
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--color-neutral-400)" }}
                    />
                  </div>
                </FormField>

                <button
                  type="submit"
                  disabled={loading}
                  className="studio-btn studio-btn-primary w-full"
                  style={{ height: "44px", fontSize: "14px" }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Sending reset link…
                    </>
                  ) : (
                    <>
                      Send reset link
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p
              className="mt-6 text-center"
              style={{ fontSize: "12px", color: "var(--color-neutral-400)" }}
            >
              Reset link expires in 15 minutes for security.
            </p>
          </>
        ) : (
          /* ── Success State ── */
          <div className="animate-fade-in text-center">
            <div
              className="mx-auto mb-6 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "var(--color-success-bg)",
                border: "1px solid rgba(22,163,74,0.2)",
              }}
            >
              <CheckCircle2 size={26} style={{ color: "var(--color-success)" }} strokeWidth={1.5} />
            </div>

            <h2
              className="mb-2"
              style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.03em" }}
            >
              Check your email
            </h2>
            <p
              className="mb-8"
              style={{ fontSize: "14px", color: "var(--app-text-secondary)", lineHeight: 1.65 }}
            >
              We sent a password reset link to{" "}
              <span style={{ fontWeight: 600, color: "var(--color-neutral-800)" }}>{email}</span>.
              It expires in 15 minutes.
            </p>

            <div
              className="rounded-xl p-4 mb-6 text-left"
              style={{
                background: "var(--app-border)",
                border: "1px solid var(--color-neutral-200)",
              }}
            >
              <p
                style={{ fontSize: "12px", color: "var(--app-text-secondary)", lineHeight: 1.6 }}
              >
                Didn&apos;t receive the email? Check your spam folder, or{" "}
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  style={{
                    color: "var(--color-brand)",
                    fontWeight: 500,
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: "inherit",
                  }}
                >
                  try a different email address
                </button>
                .
              </p>
            </div>

            <Link
              href="/signin"
              className="studio-btn studio-btn-secondary w-full"
              style={{ height: "44px", fontSize: "14px", display: "flex" }}
            >
              <ArrowLeft size={15} />
              Return to sign in
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
