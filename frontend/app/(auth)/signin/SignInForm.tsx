"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Floating Label Input ─────────────────────────────────────────── */
interface FloatInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  suffix?: React.ReactNode;
}

function FloatInput({
  id, label, type = "text", value, onChange, error, disabled, autoComplete, suffix,
}: FloatInputProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      <div
        className="relative rounded-[12px] transition-all duration-200"
        style={{
          background: "var(--app-card)",
          border: `1.5px solid ${error ? "var(--color-error)" : focused ? "var(--color-brand)" : "rgba(0,0,0,0.09)"}`,
          boxShadow: error
            ? "0 0 0 3px rgba(220,38,38,0.08)"
            : focused
            ? "0 0 0 3px rgba(255,107,0,0.1), 0 1px 2px rgba(0,0,0,0.04)"
            : "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {/* Floating label */}
        <motion.label
          htmlFor={id}
          animate={{
            top: lifted ? "8px" : "50%",
            y: lifted ? 0 : "-50%",
            fontSize: lifted ? "10px" : "13.5px",
            color: error
              ? "var(--color-error)"
              : focused
              ? "var(--color-brand)"
              : lifted
              ? "rgba(0,0,0,0.38)"
              : "rgba(0,0,0,0.38)",
          }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="absolute left-[14px] pointer-events-none font-medium z-10 select-none"
          style={{ letterSpacing: "-0.01em", lineHeight: 1 }}
        >
          {label}
        </motion.label>

        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            paddingTop: lifted ? "24px" : "12px",
            paddingBottom: lifted ? "8px" : "12px",
            paddingLeft: "14px",
            paddingRight: suffix ? "48px" : "14px",
            fontSize: "14px",
            color: "var(--app-text-primary)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            transition: "padding 0.18s ease",
          }}
        />

        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            {suffix}
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ fontSize: "11.5px", color: "var(--color-error)", marginTop: "5px", paddingLeft: "2px" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Google SVG Icon ──────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.24 8.695c0-.583-.052-1.143-.149-1.682H8.5v3.182h4.343a3.712 3.712 0 0 1-1.61 2.436v2.025h2.607C15.333 13.22 16.24 11.12 16.24 8.695Z" fill="#4285F4"/>
      <path d="M8.5 16.5c2.178 0 4.003-.722 5.34-1.953l-2.607-2.025c-.722.484-1.645.77-2.733.77-2.103 0-3.883-1.42-4.52-3.327H1.29v2.09A8 8 0 0 0 8.5 16.5Z" fill="#34A853"/>
      <path d="M3.98 9.965A4.813 4.813 0 0 1 3.73 8.5c0-.51.088-1.005.25-1.465V4.945H1.29A8.003 8.003 0 0 0 .5 8.5c0 1.292.31 2.515.79 3.555l2.69-2.09Z" fill="#FBBC05"/>
      <path d="M8.5 3.708c1.186 0 2.25.408 3.087 1.209l2.315-2.315C12.497 1.264 10.672.5 8.5.5A8 8 0 0 0 1.29 4.945l2.69 2.09C4.617 5.128 6.397 3.708 8.5 3.708Z" fill="#EA4335"/>
    </svg>
  );
}

/* ─── Animated Submit Button ───────────────────────────────────────── */
function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileTap={loading ? {} : { scale: 0.985 }}
      whileHover={loading ? {} : { scale: 1.005 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        width: "100%",
        height: "46px",
        borderRadius: "12px",
        background: loading
          ? "linear-gradient(135deg, #cc5500 0%, #e06000 100%)"
          : "linear-gradient(135deg, #FF6B00 0%, #FF8C33 100%)",
        border: "none",
        color: "white",
        fontSize: "14px",
        fontWeight: 600,
        letterSpacing: "-0.02em",
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        boxShadow: loading
          ? "none"
          : "0 2px 8px rgba(255,107,0,0.3), 0 1px 2px rgba(255,107,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
        transition: "box-shadow 0.2s ease, background 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shimmer sweep on idle */}
      {!loading && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
        />
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <motion.span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                display: "inline-block",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            Signing in…
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            Continue
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Google Button ────────────────────────────────────────────────── */
function GoogleButton({ disabled }: { disabled: boolean }) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => {}}
      whileTap={{ scale: 0.985 }}
      whileHover={{ scale: 1.005, boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        width: "100%",
        height: "46px",
        borderRadius: "12px",
        background: "var(--app-card)",
        border: "1.5px solid rgba(0,0,0,0.09)",
        color: "rgba(0,0,0,0.72)",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: "-0.01em",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "9px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <GoogleIcon />
      Continue with Google
    </motion.button>
  );
}

/* ─── Custom Checkbox ──────────────────────────────────────────────── */
function Checkbox({
  checked,
  onChange,
  id,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  label: string;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer select-none group">
      <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <motion.div
        animate={{
          backgroundColor: checked ? "var(--color-brand)" : "var(--app-card)",
          borderColor: checked ? "var(--color-brand)" : "rgba(0,0,0,0.18)",
          scale: checked ? [1, 0.88, 1.04, 1] : 1,
        }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        style={{
          width: 16,
          height: 16,
          borderRadius: 5,
          border: "1.5px solid",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: checked ? "0 1px 3px rgba(255,107,0,0.3)" : "inset 0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              width="9" height="7" viewBox="0 0 9 7" fill="none"
            >
              <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
      <span style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)", fontWeight: 450 }}>
        {label}
      </span>
    </label>
  );
}

/* ─── Divider ──────────────────────────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.07)" }} />
      <span style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.3)", fontWeight: 500, letterSpacing: "0.02em" }}>
        OR
      </span>
      <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.07)" }} />
    </div>
  );
}

/* ─── Main Form ────────────────────────────────────────────────────── */
export default function SignInForm() {
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPwd, setShowPwd]         = useState(false);
  const [remember, setRemember]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [shake, setShake]             = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "At least 6 characters";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
  };

  /* Stagger children */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{ width: "100%" }}
    >
      {/* Header */}
      <motion.div variants={item} style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#0E0D0C",
            marginBottom: "6px",
            lineHeight: 1.15,
          }}
        >
          Sign in
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.4)", lineHeight: 1.55, fontWeight: 400 }}>
          Access your Eridock Studio workspace.
        </p>
      </motion.div>

      {/* Google first — Apple-style: social on top */}
      <motion.div variants={item}>
        <GoogleButton disabled={loading} />
      </motion.div>

      <motion.div variants={item}>
        <Divider />
      </motion.div>

      {/* Form */}
      <motion.form
        variants={item}
        onSubmit={handleSubmit}
        noValidate
        animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={shake ? { duration: 0.45, ease: "easeInOut" } : {}}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          <FloatInput
            id="signin-email"
            label="Email address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(v) => { setEmail(v); if (errors.email) setErrors((p) => ({ ...p, email: "" })); }}
            error={errors.email}
            disabled={loading}
          />

          <FloatInput
            id="signin-password"
            label="Password"
            type={showPwd ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(v) => { setPassword(v); if (errors.password) setErrors((p) => ({ ...p, password: "" })); }}
            error={errors.password}
            disabled={loading}
            suffix={
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0 2px",
                  fontSize: "11.5px",
                  fontWeight: 550,
                  color: "rgba(0,0,0,0.32)",
                  letterSpacing: "0.01em",
                }}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            }
          />

          {/* Row: remember + forgot */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Checkbox
              id="remember-me"
              checked={remember}
              onChange={setRemember}
              label="Remember me"
            />
            <Link
              href="/forgot-password"
              style={{
                fontSize: "12.5px",
                fontWeight: 500,
                color: "rgba(0,0,0,0.4)",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0E0D0C")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.4)")}
            >
              Forgot password?
            </Link>
          </div>

          <div style={{ marginTop: "4px" }}>
            <SubmitButton loading={loading} />
          </div>
        </div>
      </motion.form>

      {/* Footer */}
      <motion.div
        variants={item}
        style={{ marginTop: "28px", textAlign: "center" }}
      >
        <p style={{ fontSize: "12.5px", color: "rgba(0,0,0,0.35)", fontWeight: 450 }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/invite"
            style={{ color: "var(--color-brand)", fontWeight: 550, textDecoration: "none" }}
          >
            Request access →
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
