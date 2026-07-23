"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, CheckCircle2, UserPlus, Building2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { AuthHeader, FormField, PasswordStrength } from "@/components/auth/AuthComponents";

// Mock invitation data — in production, fetched via token from URL
const INVITE = {
  inviterName: "Dr. Kofi Mensah",
  inviterRole: "Head of Curriculum",
  workspaceName: "Eridock Studio",
  role: "Curriculum Expert",
  email: "amara.osei@university.edu.gh",
  expiresAt: "July 20, 2025",
};

export default function InvitePage() {
  const [step, setStep] = useState<"accept" | "setup" | "done">("accept");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!lastName.trim()) errs.lastName = "Last name is required";
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";
    return errs;
  };

  const handleAccept = () => setStep("setup");

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setStep("done");
  };

  return (
    <AuthLayout
      spotlight={{
        quote: "Being invited to Eridock Studio means you're joining a team of Africa's finest curriculum minds. We're glad you're here.",
        attribution: "Dr. Kofi Mensah",
        role: "Head of Curriculum Design",
      }}
      stats={[
        { label: "Team members", value: "340+" },
        { label: "Avg tenure", value: "2.4 yrs" },
        { label: "Satisfaction", value: "97%" },
      ]}
    >
      <div className="animate-fade-up">
        {step === "accept" && (
          <>
            {/* Invite card */}
            <div
              className="rounded-2xl p-5 mb-8"
              style={{
                background: "var(--color-neutral-0)",
                border: "1px solid var(--color-neutral-200)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-white flex-shrink-0"
                  style={{ background: "var(--color-brand)", fontSize: "14px" }}
                >
                  {INVITE.inviterName.split(" ").filter(w => !["Dr.", "Mr.", "Ms.", "Prof."].includes(w)).slice(0, 2).map(w => w[0]).join("")}
                </div>
                <div>
                  <p
                    className="font-semibold"
                    style={{ fontSize: "14px", color: "var(--app-text-primary)" }}
                  >
                    {INVITE.inviterName}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--app-text-secondary)" }}>
                    {INVITE.inviterRole}
                  </p>
                </div>
              </div>

              <div
                className="rounded-xl px-4 py-3"
                style={{ background: "var(--color-neutral-50)", border: "1px solid var(--color-neutral-200)" }}
              >
                <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", lineHeight: 1.6 }}>
                  You&apos;ve been invited to join{" "}
                  <span className="font-semibold" style={{ color: "var(--app-text-primary)" }}>
                    {INVITE.workspaceName}
                  </span>{" "}
                  as a{" "}
                  <span
                    className="font-medium px-1.5 py-0.5 rounded"
                    style={{
                      background: "var(--color-brand-muted)",
                      color: "var(--color-brand-dark)",
                      fontSize: "12px",
                    }}
                  >
                    {INVITE.role}
                  </span>
                  .
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Building2 size={12} style={{ color: "var(--color-neutral-400)" }} />
                <p style={{ fontSize: "12px", color: "var(--color-neutral-400)" }}>
                  {INVITE.email} · Expires {INVITE.expiresAt}
                </p>
              </div>
            </div>

            <AuthHeader
              title="You're invited!"
              subtitle="Accept this invitation to join your team and start creating exceptional educational content."
            />

            <button
              onClick={handleAccept}
              className="studio-btn studio-btn-primary w-full"
              style={{ height: "44px", fontSize: "14px" }}
            >
              <UserPlus size={15} />
              Accept Invitation
            </button>

            <button
              className="studio-btn studio-btn-ghost w-full mt-3"
              style={{ height: "40px", fontSize: "13px" }}
            >
              Decline invitation
            </button>
          </>
        )}

        {step === "setup" && (
          <>
            <AuthHeader
              title="Set up your account"
              subtitle="Complete your profile to get started in Eridock Studio."
              badge="Almost there"
            />

            <form onSubmit={handleSetup} noValidate>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="First name" error={errors.firstName} required>
                    <input
                      id="invite-first"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Amara"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`studio-input ${errors.firstName ? "error" : ""}`}
                      disabled={loading}
                    />
                  </FormField>
                  <FormField label="Last name" error={errors.lastName} required>
                    <input
                      id="invite-last"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Osei"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`studio-input ${errors.lastName ? "error" : ""}`}
                      disabled={loading}
                    />
                  </FormField>
                </div>

                <div>
                  <label className="studio-label">Email address</label>
                  <input
                    type="email"
                    value={INVITE.email}
                    disabled
                    className="studio-input"
                  />
                </div>

                <FormField label="Create a password" error={errors.password} required>
                  <input
                    id="invite-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`studio-input ${errors.password ? "error" : ""}`}
                    disabled={loading}
                  />
                  <PasswordStrength password={password} />
                </FormField>

                <button
                  type="submit"
                  disabled={loading}
                  className="studio-btn studio-btn-primary w-full mt-2"
                  style={{ height: "44px", fontSize: "14px" }}
                >
                  {loading ? (
                    <><Loader2 size={15} className="animate-spin" /> Creating account…</>
                  ) : (
                    <>Create my account <ArrowRight size={15} /></>
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="animate-fade-in text-center">
            <div
              className="mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "var(--color-success-bg)",
                border: "1px solid rgba(22,163,74,0.2)",
              }}
            >
              <CheckCircle2 size={30} style={{ color: "var(--color-success)" }} strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.03em" }} className="mb-2">
              Welcome to the team!
            </h2>
            <p
              style={{ fontSize: "14px", color: "var(--app-text-secondary)", lineHeight: 1.65 }}
              className="mb-8"
            >
              Your account is ready. You&apos;ve joined Eridock Studio as a{" "}
              <span className="font-semibold" style={{ color: "var(--color-neutral-800)" }}>
                {INVITE.role}
              </span>
              . Let&apos;s create something exceptional.
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
