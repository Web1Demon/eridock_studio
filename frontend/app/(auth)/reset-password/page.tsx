"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { AuthHeader, FormField, PasswordStrength } from "@/components/auth/AuthComponents";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!password) errs.password = "New password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (!confirm) errs.confirm = "Please confirm your password";
    else if (confirm !== password) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <AuthLayout
      spotlight={{
        quote: "Security is not a feature — it's a foundation. We build every layer of Eridock with your team's trust as the primary directive.",
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
        {!success ? (
          <>
            <AuthHeader
              title="Set a new password"
              subtitle="Choose a strong password you haven't used before. Your account security matters."
              badge="Password Reset"
            />

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-5">
                {/* New Password */}
                <FormField label="New password" error={errors.password} required>
                  <div className="relative">
                    <input
                      id="reset-password"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`studio-input pr-11 ${errors.password ? "error" : ""}`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--color-neutral-400)" }}
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </FormField>

                {/* Confirm Password */}
                <FormField label="Confirm new password" error={errors.confirm} required>
                  <div className="relative">
                    <input
                      id="reset-confirm"
                      type={showCf ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className={`studio-input pr-11 ${errors.confirm ? "error" : ""}`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCf(!showCf)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--color-neutral-400)" }}
                    >
                      {showCf ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </FormField>

                {/* Password requirements */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--app-border)",
                    border: "1px solid var(--color-neutral-200)",
                  }}
                >
                  <p
                    className="mb-2 font-medium"
                    style={{ fontSize: "12px", color: "var(--color-neutral-700)" }}
                  >
                    Password requirements:
                  </p>
                  {[
                    { label: "At least 8 characters", met: password.length >= 8 },
                    { label: "At least one uppercase letter", met: /[A-Z]/.test(password) },
                    { label: "At least one number", met: /[0-9]/.test(password) },
                    { label: "At least one special character", met: /[^A-Za-z0-9]/.test(password) },
                  ].map((req) => (
                    <div key={req.label} className="flex items-center gap-2 mt-1.5">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: req.met ? "var(--color-success-bg)" : "var(--color-neutral-200)",
                          border: `1px solid ${req.met ? "rgba(22,163,74,0.3)" : "var(--color-neutral-300)"}`,
                        }}
                      >
                        {req.met && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L3 5L7 1" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          color: req.met ? "var(--color-success)" : "var(--app-text-secondary)",
                        }}
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="studio-btn studio-btn-primary w-full mt-1"
                  style={{ height: "44px", fontSize: "14px" }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Updating password…
                    </>
                  ) : (
                    <>
                      Reset password
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* ── Success ── */
          <div className="animate-fade-in text-center">
            <div
              className="mx-auto mb-6 w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse-brand"
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
              Password updated!
            </h2>
            <p
              className="mb-8"
              style={{ fontSize: "14px", color: "var(--app-text-secondary)", lineHeight: 1.65 }}
            >
              Your password has been reset successfully. You can now sign in with your new credentials.
            </p>
            <Link
              href="/signin"
              className="studio-btn studio-btn-primary w-full"
              style={{ height: "44px", fontSize: "14px", display: "flex" }}
            >
              Continue to Sign In
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
