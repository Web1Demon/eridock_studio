"use client";

import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";

interface OTPInputProps {
  length?: number;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function OTPInput({ length = 6, onChange, disabled }: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...values];
    next[index] = val.slice(-1);
    setValues(next);
    onChange?.(next.join(""));
    if (val && index < length - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!values[index] && index > 0) {
        const next = [...values];
        next[index - 1] = "";
        setValues(next);
        onChange?.(next.join(""));
        inputs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1) inputs.current[index + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    const next = [...values];
    pasted.split("").forEach((char, i) => { next[i] = char; });
    setValues(next);
    onChange?.(next.join(""));
    const focusIndex = Math.min(pasted.length, length - 1);
    inputs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={values[i]}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="otp-input"
          placeholder="·"
          aria-label={`Digit ${i + 1} of ${length}`}
        />
      ))}
    </div>
  );
}

/* ─── Password Strength ─────────────────────────────── */

interface PasswordStrengthProps {
  password: string;
}

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Too weak", color: "var(--color-error)" };
  if (score === 2) return { score, label: "Weak", color: "#F59E0B" };
  if (score === 3) return { score, label: "Fair", color: "#EAB308" };
  if (score === 4) return { score, label: "Good", color: "#22C55E" };
  return { score, label: "Strong", color: "var(--color-success)" };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;
  const { score, label, color } = getStrength(password);

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="strength-bar"
            style={{
              background: i < score ? color : "var(--color-neutral-200)",
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: "12px", color }}>
        {label} password
      </p>
    </div>
  );
}

/* ─── Form Field ────────────────────────────────────── */

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, hint, required, children }: FormFieldProps) {
  return (
    <div>
      <label className="studio-label">
        {label}
        {required && (
          <span style={{ color: "var(--color-brand)", marginLeft: "3px" }}>*</span>
        )}
      </label>
      {children}
      {error && (
        <p
          className="mt-1.5 flex items-center gap-1.5"
          style={{ fontSize: "12px", color: "var(--color-error)" }}
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5" style={{ fontSize: "12px", color: "var(--color-neutral-400)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

/* ─── Auth Header ───────────────────────────────────── */

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export function AuthHeader({ title, subtitle, badge }: AuthHeaderProps) {
  return (
    <div className="mb-8 animate-fade-in">
      {badge && (
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
          style={{
            background: "var(--color-brand-muted)",
            border: "1px solid rgba(255,107,0,0.15)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--color-brand)" }}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--color-brand-dark)",
              letterSpacing: "0.02em",
            }}
          >
            {badge}
          </span>
        </div>
      )}
      <h1
        className="mb-2"
        style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.03em" }}
      >
        {title}
      </h1>
      <p style={{ fontSize: "14px", color: "var(--app-text-secondary)", lineHeight: 1.6 }}>
        {subtitle}
      </p>
    </div>
  );
}

/* ─── Divider ───────────────────────────────────────── */

export function Divider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1" style={{ height: "1px", background: "var(--color-neutral-200)" }} />
      <span style={{ fontSize: "12px", color: "var(--color-neutral-400)", fontWeight: 500 }}>
        {label}
      </span>
      <div className="flex-1" style={{ height: "1px", background: "var(--color-neutral-200)" }} />
    </div>
  );
}

/* ─── Alert Box ─────────────────────────────────────── */

type AlertType = "info" | "success" | "warning" | "error";

interface AlertBoxProps {
  type: AlertType;
  message: string;
}

const alertConfig: Record<AlertType, { bg: string; border: string; text: string }> = {
  info:    { bg: "var(--color-info-bg)",    border: "rgba(37,99,235,0.2)",   text: "var(--color-info)" },
  success: { bg: "var(--color-success-bg)", border: "rgba(22,163,74,0.2)",   text: "var(--color-success)" },
  warning: { bg: "var(--color-warning-bg)", border: "rgba(217,119,6,0.2)",   text: "var(--color-warning)" },
  error:   { bg: "var(--color-error-bg)",   border: "rgba(220,38,38,0.2)",   text: "var(--color-error)" },
};

export function AlertBox({ type, message }: AlertBoxProps) {
  const cfg = alertConfig[type];
  return (
    <div
      className="px-4 py-3 rounded-xl mb-6 text-sm"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.text,
        fontSize: "13px",
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );
}
