import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Eridock Studio to access your workspace.",
};

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}

/* ─── Client Component ─────────────────────────────────────────────── */

import SignInForm from "./SignInForm";
