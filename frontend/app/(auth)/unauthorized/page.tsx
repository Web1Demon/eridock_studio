"use client";

import Link from "next/link";
import { ShieldOff, ArrowLeft, Mail, Home } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function UnauthorizedPage() {
  return (
    <AuthLayout
      spotlight={{
        quote: "Role-based access control ensures that every piece of content in Eridock Studio is handled by the right person at the right stage of the workflow.",
        attribution: "Platform Architecture",
        role: "Orangebase Engineering",
      }}
      stats={[
        { label: "Permission layers", value: "6" },
        { label: "Audit events/day", value: "10K+" },
        { label: "RBAC coverage", value: "100%" },
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
          <ShieldOff size={28} strokeWidth={1.5} style={{ color: "var(--color-error)" }} />
        </div>

        {/* Error code */}
        <p
          className="mb-1 font-mono font-bold"
          style={{ fontSize: "11px", color: "var(--color-brand)", letterSpacing: "0.1em" }}
        >
          ERROR 403
        </p>

        <h1
          className="mb-2"
          style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.03em" }}
        >
          Access restricted
        </h1>
        <p
          className="mb-8"
          style={{ fontSize: "14px", color: "var(--app-text-secondary)", lineHeight: 1.65 }}
        >
          You don&apos;t have permission to access this resource. This area requires a different role or elevated privileges.
        </p>

        {/* Permission info */}
        <div
          className="rounded-xl p-5 mb-8 text-left"
          style={{
            background: "var(--color-neutral-0)",
            border: "1px solid var(--color-neutral-200)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p
            className="mb-3 font-semibold"
            style={{ fontSize: "13px", color: "var(--color-neutral-800)" }}
          >
            Why am I seeing this?
          </p>
          <div className="flex flex-col gap-2.5">
            {[
              "You may not have the required role for this section",
              "Your permission level may have changed recently",
              "You might be accessing a link that's no longer valid",
              "The resource may be restricted to administrators",
            ].map((reason, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: "var(--color-neutral-400)" }}
                />
                <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", lineHeight: 1.5 }}>
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="studio-btn studio-btn-primary w-full"
            style={{ height: "44px", fontSize: "14px", display: "flex" }}
          >
            <Home size={15} />
            Go to Dashboard
          </Link>
          <a
            href="mailto:admin@eridock.com"
            className="studio-btn studio-btn-secondary w-full"
            style={{ height: "44px", fontSize: "14px", display: "flex" }}
          >
            <Mail size={15} />
            Request access from admin
          </a>
          <button
            onClick={() => window.history.back()}
            className="studio-btn studio-btn-ghost w-full"
            style={{ height: "40px", fontSize: "13px" }}
          >
            <ArrowLeft size={13} />
            Go back
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
