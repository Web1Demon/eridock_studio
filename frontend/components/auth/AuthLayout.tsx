"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: React.ReactNode;
  spotlight?: {
    quote: string;
    attribution: string;
    role: string;
  };
  stats?: {
    label: string;
    value: string;
  }[];
}

const DEFAULT_STATS = [
  { value: "12,400+", label: "Lessons" },
  { value: "340",     label: "Experts" },
  { value: "96.4%",   label: "Quality" },
];

export default function AuthLayout({ children, spotlight, stats }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#F9F8F6]">

      {/* ── Left Panel ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[44%] flex-col relative overflow-hidden select-none bg-[#0E0D0C]">

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />

        {/* Ambient brand glow — bottom left */}
        <div
          className="absolute z-0 pointer-events-none"
          style={{
            width: 560,
            height: 560,
            bottom: -140,
            left: -140,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,107,0,0.13) 0%, transparent 70%)",
          }}
        />
        {/* Ambient muted glow — top right */}
        <div
          className="absolute z-0 pointer-events-none"
          style={{
            width: 320,
            height: 320,
            top: -80,
            right: -80,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 70%)",
          }}
        />

        {/* Subtle horizontal rule lines — architectural */}
        <div className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(255,255,255,0.018) 79px, rgba(255,255,255,0.018) 80px)",
          }}
        />

        {/* Illustration ghost — massive, centered, barely visible */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <img
            src="/illustration.svg"
            alt=""
            aria-hidden="true"
            style={{
              width: "90%",
              opacity: 0.025,
              filter: "grayscale(1) contrast(2.5) brightness(2)",
              transform: "scale(1.05)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12 justify-between">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div
                className="w-[6px] h-[6px] rounded-full transition-transform duration-300 group-hover:scale-150"
                style={{ background: "var(--color-brand)" }}
              />
              <span
                className="font-medium tracking-tight"
                style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", letterSpacing: "-0.015em" }}
              >
                Eridock Studio
              </span>
            </Link>
          </motion.div>

          {/* Center editorial block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="max-w-[340px]"
          >
            <p
              className="mb-6 leading-[1.15]"
              style={{
                fontSize: "38px",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.88)",
                lineHeight: 1.15,
              }}
            >
              Knowledge,<br />
              <span style={{ color: "rgba(255,255,255,0.28)" }}>crafted</span>{" "}
              with<br />
              <span style={{ color: "var(--color-brand)", opacity: 0.9 }}>precision.</span>
            </p>

            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.3)",
                lineHeight: 1.7,
                fontWeight: 400,
                letterSpacing: "-0.005em",
              }}
            >
              The professional content creation platform
              for curriculum experts, instructional designers
              and educational teams.
            </p>
          </motion.div>

        </div>
      </div>

      {/* ── Right Panel ────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative overflow-auto bg-[#F9F8F6]">

        {/* Subtle top-right grain on right panel */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />

        {/* Mobile logo */}
        <div className="lg:hidden absolute top-7 left-7 z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-[5px] h-[5px] rounded-full" style={{ background: "var(--color-brand)" }} />
            <span className="font-medium text-sm tracking-tight" style={{ color: "var(--color-neutral-700)" }}>
              Eridock Studio
            </span>
          </Link>
        </div>

        <div className="relative z-10 w-full max-w-[380px]">{children}</div>
      </div>
    </div>
  );
}
