"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Trash2, CheckCircle2, ArrowRight, XCircle, Users } from "lucide-react";

/* ──────────────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────────────── */

const PIPELINE = [
  { id: 1, title: "Introduction to Quadratic Equations",   subject: "Mathematics", status: "review",    edited: "Kwame A." },
  { id: 2, title: "Photosynthesis & Cellular Respiration",  subject: "Biology",     status: "review",    edited: "Nadia O." },
  { id: 3, title: "The Scramble for Africa",               subject: "History",      status: "published", edited: "James T." },
  { id: 4, title: "Forces and Motion — Newton's Laws",     subject: "Physics",      status: "draft",     edited: "Sara M."  },
  { id: 5, title: "Reading Comprehension: Fiction",        subject: "English",      status: "review",    edited: "Nadia O." },
];

const NEEDS_APPROVAL = [
  {
    num: "01",
    title: "Chemical Bonding requires final approval.",
    sub: "Kwame addressed the 3 misconceptions flagged yesterday.",
    color: "#16A34A",
    icon: CheckCircle2,
  },
  {
    num: "02",
    title: "Essay Structure draft was flagged by AI.",
    sub: "Missing 2 critical learning objectives for 8th grade.",
    color: "#D97706",
    icon: Sparkles,
  },
  {
    num: "03",
    title: "Forces and Motion contains a physics error.",
    sub: "Velocity and acceleration are conflated in section 2.",
    color: "#DC2626",
    icon: XCircle,
  },
];

const ACTIVITY = [
  { initials: "KA", name: "Kwame A.",  action: "addressed feedback in", target: "Chemical Bonding",  ago: "30 min",    color: "#16A34A" },
  { initials: "NO", name: "Nadia O.",  action: "submitted for review:", target: "Algebra Ch. 2",     ago: "1 hour",    color: "#FF6B00" },
  { initials: "SM", name: "Sara M.",   action: "needs help with",       target: "Essay Structure",   ago: "3 hours",   color: "#D97706" },
  { initials: "JT", name: "James T.",  action: "published",             target: "French Revolution", ago: "Yesterday", color: "#2563EB" },
];

const NUGGETS = [
  "Education should ignite a lifelong passion for discovery, not just fill a mind with facts.",
  "The best teachers don't just give answers; they guide students to ask better questions.",
  "True learning happens when students feel safe enough to make mistakes.",
  "Education must empower individuals to adapt to a rapidly changing world.",
  "Empathy in the classroom is just as critical as academic rigor.",
  "A successful education system cultivates critical thinking over rote memorization.",
  "Teaching is the art of assisting discovery.",
  "Students should learn how to think, not what to think.",
  "Every child deserves a champion: an adult who will never give up on them.",
  "The goal of education is the advancement of knowledge and the dissemination of truth.",
  "Good teaching is more a giving of right questions than a giving of right answers.",
  "Education is not preparation for life; education is life itself.",
  "Personalized learning recognizes that every student learns at their own pace.",
  "An effective educator connects the curriculum to the student's real-world experiences.",
  "Fostering curiosity is the foundation of all meaningful learning.",
  "Education should build character alongside intellect.",
  "The most impactful lessons often happen outside the syllabus.",
  "To teach is to learn twice over.",
  "Collaborative learning teaches students how to work together and value diverse perspectives.",
  "True education equips students with the tools to build a better future.",
  "Feedback should be a compass for growth, not just a measure of failure.",
  "An inclusive classroom ensures every voice is heard and valued.",
  "Cultivating emotional intelligence is essential for holistic student development.",
  "Education should break down barriers, not build walls.",
  "The best classroom management strategy is an engaging, relevant lesson.",
  "Technology is a tool, but the teacher is the catalyst for learning.",
  "Great teachers inspire hope, ignite the imagination, and instill a love of learning.",
  "We should measure success not just by test scores, but by students' enthusiasm to learn.",
  "Education should teach students to embrace challenges and persist through difficulties.",
  "The ultimate goal of education is to replace an empty mind with an open one."
];

/* ──────────────────────────────────────────────────────────────────
   SUBJECT STYLES
────────────────────────────────────────────────────────────────── */

const SUBJECT_STYLES: Record<string, { bg: string; accent: string }> = {
  Mathematics: { bg: "linear-gradient(145deg,#FFF4ED 0%,#FFE0C0 100%)", accent: "#FF6B00" },
  Biology:     { bg: "linear-gradient(145deg,#F0FDF4 0%,#ABEFC6 100%)", accent: "#16A34A" },
  History:     { bg: "linear-gradient(145deg,#FAF7F2 0%,#E8D9BA 100%)", accent: "#92400E" },
  Physics:     { bg: "linear-gradient(145deg,#EFF6FF 0%,#BFDBFE 100%)", accent: "#2563EB" },
  English:     { bg: "linear-gradient(145deg,#FDF4FF 0%,#E9D5FF 100%)", accent: "#9333EA" },
};

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  draft:     { label: "Draft",     color: "var(--app-text-secondary)" },
  review:    { label: "In Review", color: "#D97706"            },
  published: { label: "Published", color: "#16A34A"            },
};

/* ──────────────────────────────────────────────────────────────────
   ABSTRACT CANVAS ART (per subject)
────────────────────────────────────────────────────────────────── */

function MathCanvas({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 270 135" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      {Array.from({ length: 15 }, (_, i) => (
        <circle key={i} cx={26 + (i % 5) * 54} cy={25 + Math.floor(i / 5) * 44}
          r={9} fill={`${accent}1E`} stroke={`${accent}55`} strokeWidth={1} />
      ))}
      <text x={10} y={145} fill={`${accent}28`} fontSize={105} fontWeight={900} letterSpacing={-4}
        style={{ fontVariantNumeric: "tabular-nums" } as React.CSSProperties}>π</text>
    </svg>
  );
}

function BioCanvas({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 270 135" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <ellipse cx={135} cy={67} rx={76} ry={46} fill={`${accent}18`} stroke={`${accent}42`} strokeWidth={1.5} />
      <ellipse cx={135} cy={67} rx={48} ry={26} fill={`${accent}12`} stroke={`${accent}30`} strokeWidth={1} />
      <line x1={59} y1={67} x2={211} y2={67} stroke={`${accent}48`} strokeWidth={1} strokeDasharray="5 4" />
      <line x1={135} y1={21} x2={135} y2={113} stroke={`${accent}48`} strokeWidth={1} strokeDasharray="5 4" />
      <circle cx={135} cy={67} r={12} fill={`${accent}55`} />
      <circle cx={135} cy={67} r={5.5} fill={accent} />
    </svg>
  );
}

function HistCanvas({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 270 135" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={-18 + i * 42} y1={0} x2={i * 42 - 76} y2={180}
          stroke={`${accent}22`} strokeWidth={20} />
      ))}
      <text x={12} y={136} fill={`${accent}32`} fontSize={84} fontWeight={900} letterSpacing={-2}>AD</text>
    </svg>
  );
}

function PhysCanvas({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 270 135" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      {[62, 46, 30, 14].map((r, i) => (
        <circle key={i} cx={135} cy={67} r={r} fill="none"
          stroke={`${accent}${["38","2A","1E","14"][i]}`} strokeWidth={1.5} />
      ))}
      <circle cx={135} cy={67} r={6} fill={accent} />
      <circle cx={197} cy={67} r={5} fill={accent} opacity={0.9}>
        <animateTransform attributeName="transform" type="rotate"
          from="0 135 67" to="360 135 67" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx={135} cy={21} r={4} fill={accent} opacity={0.6}>
        <animateTransform attributeName="transform" type="rotate"
          from="0 135 67" to="-360 135 67" dur="10s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function EngCanvas({ accent }: { accent: string }) {
  const w = (offset: number) => {
    let d = `M 0 ${67 + offset}`;
    for (let x = 0; x <= 270; x += 32) d += ` Q ${x + 16} ${67 + offset - 17} ${x + 32} ${67 + offset}`;
    return d;
  };
  return (
    <svg viewBox="0 0 270 135" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      {[-30, -15, 0, 15, 30].map((o, i) => (
        <path key={i} d={w(o)} fill="none"
          stroke={`${accent}${["18","28","40","28","18"][i]}`} strokeWidth={2.5} />
      ))}
    </svg>
  );
}

const CANVAS_MAP: Record<string, React.FC<{ accent: string }>> = {
  Mathematics: MathCanvas,
  Biology:     BioCanvas,
  History:     HistCanvas,
  Physics:     PhysCanvas,
  English:     EngCanvas,
};

/* ──────────────────────────────────────────────────────────────────
   KNOWLEDGE CONSTELLATION
────────────────────────────────────────────────────────────────── */

const C_NODES = [
  { cx: 312, cy: 105, r: 22,  fill: "var(--app-text-primary)", isHub: true  },
  { cx: 118, cy: 78,  r: 12,  fill: "#FF6B00"               },
  { cx: 502, cy: 72,  r: 10,  fill: "#64748B"               },
  { cx: 70,  cy: 168, r: 7,   fill: "#64748B"               },
  { cx: 548, cy: 162, r: 13,  fill: "#94A3B8"               },
  { cx: 196, cy: 162, r: 9,   fill: "#FF9840"               },
  { cx: 418, cy: 152, r: 7,   fill: "#94A3B8"               },
  { cx: 154, cy: 30,  r: 5,   fill: "#CBD5E1"               },
  { cx: 471, cy: 28,  r: 5,   fill: "#CBD5E1"               },
  { cx: 282, cy: 190, r: 6,   fill: "#FF6B00"               },
  { cx: 378, cy: 29,  r: 4,   fill: "#CBD5E1"               },
];

const C_EDGES = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,9],
  [1,7],[2,8],[5,3],[4,6],[1,10],[2,10],[7,10],
];

function qcurve(ax: number, ay: number, bx: number, by: number) {
  const mx = (ax+bx)/2, my = (ay+by)/2;
  const dx = bx-ax, dy = by-ay;
  return `M ${ax} ${ay} Q ${mx-dy*0.18} ${my+dx*0.18} ${bx} ${by}`;
}

function Constellation() {
  return (
    <div style={{ position: "relative", width: "100%", height: 215, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
      <img src="/dashboard-illustration.png" alt="Dashboard Illustration" style={{ maxHeight: "110%", objectFit: "contain", transform: "translateY(10px)" }} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   LESSON CARD (Figma-style with canvas art)
────────────────────────────────────────────────────────────────── */

function LessonCard({ lesson, index }: { lesson: typeof PIPELINE[0]; index: number }) {
  const [hov, setHov] = useState(false);
  const sty    = SUBJECT_STYLES[lesson.subject] ?? SUBJECT_STYLES.Mathematics;
  const Canvas = CANVAS_MAP[lesson.subject];
  const status = STATUS_STYLES[lesson.status] ?? STATUS_STYLES.draft;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        flexShrink: 0,
        width: 224,
        borderRadius: 16,
        overflow: "hidden",
        background: "var(--app-card)",
        border: `1px solid ${hov ? "var(--app-border)" : "var(--app-border-glow)"}`,
        boxShadow: hov
          ? "0 20px 56px var(--app-border), 0 4px 12px var(--app-border-glow)"
          : "0 2px 8px var(--app-border-glow)",
        cursor: "pointer",
        transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* Canvas */}
      <div style={{ height: 130, background: sty.bg, position: "relative", overflow: "hidden" }}>
        {Canvas && <Canvas accent={sty.accent} />}

        {/* Hover action overlay */}
        <motion.div
          animate={{ opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "absolute", inset: 0,
            background: "var(--app-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{
            padding: "7px 16px",
            borderRadius: 99,
            background: "rgba(255,255,255,0.95)",
            fontSize: "12px",
            fontWeight: 640,
            color: "var(--app-text-primary)",
            letterSpacing: "-0.01em",
          }}>
            {lesson.status === "review" ? "Review now" : lesson.status === "published" ? "Open →" : "Continue →"}
          </span>
        </motion.div>

        {/* Status pill */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          padding: "3px 8px", borderRadius: 99,
          background: "rgba(255,255,255,0.90)",
          backdropFilter: "blur(6px)",
          fontSize: "10px", fontWeight: 650, color: status.color,
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: status.color, flexShrink: 0 }} />
          {status.label}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px" }}>
        <p style={{
          fontSize: "13px", fontWeight: 560, color: "var(--app-text-primary)",
          letterSpacing: "-0.015em", lineHeight: 1.35, marginBottom: 7,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        } as React.CSSProperties}>
          {lesson.title}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "var(--app-text-secondary)", fontWeight: 450 }}>{lesson.subject}</span>
          <span style={{ fontSize: "10.5px", color: "var(--app-border)" }}>{lesson.edited}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   PRIORITY ITEM (editorial list)
────────────────────────────────────────────────────────────────── */

function PriorityItem({ item, index }: { item: typeof NEEDS_APPROVAL[0]; index: number }) {
  const [hov, setHov] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 18,
        padding: "22px 0",
        borderBottom: "1px solid var(--app-border)",
        cursor: "pointer",
      }}
    >
      <span style={{
        fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em",
        color: "var(--app-border)", width: 22, flexShrink: 0,
        fontVariantNumeric: "tabular-nums",
      }}>
        {item.num}
      </span>

      <div style={{
        width: 38, height: 38, borderRadius: 11, flexShrink: 0,
        background: hov ? `${item.color}14` : "var(--app-border-glow)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.2s",
      }}>
        <Icon size={15} strokeWidth={1.7}
          style={{ color: hov ? item.color : "var(--app-text-secondary)", transition: "color 0.2s" }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: "15.5px", fontWeight: 500, color: "var(--app-text-primary)",
          letterSpacing: "-0.025em", lineHeight: 1.3,
        }}>
          {item.title}
        </p>
        <p style={{
          fontSize: "12.5px", color: "var(--app-text-secondary)",
          marginTop: 4, lineHeight: 1.5, letterSpacing: "-0.005em",
        }}>
          {item.sub}
        </p>
      </div>

      <motion.div
        animate={{ x: hov ? 5 : 0, opacity: hov ? 1 : 0.22 }}
        transition={{ duration: 0.15 }}
        style={{ flexShrink: 0 }}
      >
        <ArrowRight size={16} strokeWidth={1.6}
          style={{ color: hov ? item.color : "var(--app-border)" }} />
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   SECTION LABEL
────────────────────────────────────────────────────────────────── */

function Sect({ label, color = "var(--color-mild-blue)", action, onAction }: {
  label: string;
  color?: string;
  action?: string;
  onAction?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <p style={{
        fontSize: "10px", fontWeight: 750,
        letterSpacing: "0.12em", textTransform: "uppercase", color,
      }}>
        {label}
      </p>
      {action && (
        <button
          onClick={onAction}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            background: "none", border: "none",
            fontSize: "12px",
            color: hov ? "var(--app-text-primary)" : "var(--app-border)",
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 3,
            fontWeight: 480, letterSpacing: "-0.005em",
            transition: "color 0.15s", padding: 0,
          }}
        >
          {action} <ChevronRight size={12} strokeWidth={1.8} />
        </button>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────────────────────── */

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function DailyNugget() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const savedDate = localStorage.getItem('nuggetDate');
    const savedIndex = localStorage.getItem('nuggetIndex');

    if (savedDate === today && savedIndex !== null) {
      setIndex(parseInt(savedIndex, 10));
    } else {
      const newIndex = Math.floor(Math.random() * NUGGETS.length);
      localStorage.setItem('nuggetDate', today);
      localStorage.setItem('nuggetIndex', newIndex.toString());
      setIndex(newIndex);
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div variants={fadeUp} 
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        padding: "36px 42px",
        borderRadius: "24px",
        background: "var(--app-card)",
        border: `1px solid ${hov ? "rgba(255,107,0,0.15)" : "var(--app-border-glow)"}`,
        marginBottom: "56px",
        position: "relative",
        overflow: "hidden",
        boxShadow: hov 
          ? "0 24px 48px var(--app-border-glow), 0 8px 24px var(--app-border-glow)" 
          : "0 12px 32px var(--app-border-glow), 0 4px 12px var(--app-border-glow)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        display: "flex",
        alignItems: "flex-start",
        gap: "24px",
        cursor: "default"
      }}
    >
      {/* Decorative gradient orb */}
      <div style={{
        position: "absolute", top: -80, right: -80, width: 300, height: 300,
        background: "radial-gradient(circle, rgba(255,107,0,0.08) 0%, rgba(255,255,255,0) 70%)",
        pointerEvents: "none",
        transition: "transform 0.6s ease",
        transform: hov ? "scale(1.15) translate(-10px, 10px)" : "scale(1) translate(0, 0)"
      }} />

      <div style={{
        width: "52px", height: "52px", borderRadius: "16px", flexShrink: 0,
        background: "linear-gradient(135deg, #FFF4ED 0%, #FFE0C0 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.8), 0 6px 16px rgba(255, 107, 0, 0.15)",
        transform: hov ? "rotate(8deg) scale(1.05)" : "rotate(0deg) scale(1)",
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <Sparkles size={24} color="#FF6B00" style={{ opacity: 0.95 }} />
      </div>

      <div style={{ flex: 1, position: "relative", zIndex: 1, paddingTop: "2px" }}>
        <h3 style={{
          fontSize: "11px", fontWeight: 750, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "#FF6B00", marginBottom: "14px",
          display: "flex", alignItems: "center", gap: "6px"
        }}>
          Insight of the Day
        </h3>
        
        <p style={{
          fontSize: "22px", fontWeight: 500, lineHeight: 1.45,
          letterSpacing: "-0.02em", color: "var(--app-text-primary)", margin: 0,
        }}>
          "{NUGGETS[index]}"
        </p>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [newHov, setNewHov] = useState(false);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateLabel = new Date().toLocaleDateString("en-GB", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      style={{ maxWidth: 900, margin: "0 auto", paddingBottom: 72 }}
    >

      {/* ── HERO ──────────────────────────────────────────── */}
      <motion.section variants={fadeUp} style={{ marginBottom: 52 }}>

        {/* Greeting */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
          <div>
            <h1 style={{
              fontSize: "52px", fontWeight: 720, letterSpacing: "-0.052em",
              color: "var(--app-text-primary)", lineHeight: 1.03, margin: 0,
            }}>
              {greeting},<br />Amara.
            </h1>
            <p style={{
              fontSize: "16px", color: "var(--app-text-secondary)",
              marginTop: 16, fontWeight: 430, letterSpacing: "-0.015em",
              lineHeight: 1.62, maxWidth: 370,
            }}>
              Your curriculum is shaping how{" "}
              <strong style={{ color: "var(--app-text-primary)", fontWeight: 640 }}>Students</strong>{" "}
              learn across Nigeria.
            </p>
          </div>
          <span style={{
            fontSize: "12px", fontWeight: 540, color: "var(--app-text-secondary)",
            letterSpacing: "-0.01em", paddingTop: 8, flexShrink: 0,
          }}>
            {dateLabel}
          </span>
        </div>

        {/* The Knowledge Constellation */}
        <Constellation />

        {/* Ambient stats — pure typography, no boxes */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex", gap: 40, marginTop: 20, paddingTop: 20,
            borderTop: "1px solid var(--app-border)",
          }}
        >
          {[
            { value: "4",     unit: "",   label: "awaiting approval"   },
            { value: "18",    unit: "",   label: "lessons in pipeline" },
            { value: "2.4",   unit: "x",  label: "team velocity"       },
            { value: "1.2",   unit: "%",  label: "rejection rate"      },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <span style={{
                  fontSize: "26px", fontWeight: 740, letterSpacing: "-0.045em",
                  color: "var(--app-text-primary)", lineHeight: 1, fontVariantNumeric: "tabular-nums",
                }}>
                  {s.value}
                </span>
                {s.unit && (
                  <span style={{ fontSize: "16px", fontWeight: 740, color: "var(--app-text-primary)", letterSpacing: "-0.02em" }}>
                    {s.unit}
                  </span>
                )}
              </div>
              <span style={{
                fontSize: "11px", color: "var(--app-text-secondary)",
                fontWeight: 430, letterSpacing: "-0.005em",
              }}>
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── DAILY INSIGHT ──────────────────────────────────── */}
      <DailyNugget />

      {/* ── NOW ───────────────────────────────────────────── */}
      <motion.section variants={fadeUp} style={{ marginBottom: 56 }}>
        <Sect label="Needs Approval" />
        <div style={{ borderTop: "1px solid var(--app-border)" }}>
          {NEEDS_APPROVAL.map((item, i) => (
            <PriorityItem key={item.num} item={item} index={i} />
          ))}
        </div>
      </motion.section>

      {/* ── CRAFT ─────────────────────────────────────────── */}
      <motion.section variants={fadeUp} style={{ marginBottom: 56 }}>
        <Sect label="Pipeline" color="var(--color-brand)" action="View all" />

        {/* Horizontal lesson cards */}
        <div style={{
          display: "flex", gap: 14, marginTop: 16,
          overflowX: "auto", paddingBottom: 16,
          scrollbarWidth: "none",
        }}>
          {PIPELINE.map((lesson, i) => (
            <LessonCard key={lesson.id} lesson={lesson} index={i} />
          ))}

          {/* Archive / Trash card */}
          <div
            onMouseEnter={() => setNewHov(true)}
            onMouseLeave={() => setNewHov(false)}
            style={{
              flexShrink: 0, width: 224, minHeight: 222,
              borderRadius: 16,
              border: `1.5px dashed ${newHov ? "var(--color-error)" : "var(--app-border)"}`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 10,
              cursor: "pointer",
              background: newHov ? "rgba(220,38,38,0.025)" : "transparent",
              transition: "all 0.22s ease",
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 11,
              background: newHov ? "rgba(220,38,38,0.10)" : "var(--app-border-glow)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.22s",
            }}>
              <Trash2 size={16} strokeWidth={1.6}
                style={{ color: newHov ? "var(--color-error)" : "var(--app-border)", transition: "color 0.22s" }} />
            </div>
            <p style={{
              fontSize: "13px", fontWeight: 530, letterSpacing: "-0.01em",
              color: newHov ? "var(--color-error)" : "var(--app-text-secondary)",
              transition: "color 0.22s",
            }}>
              Trash & Archives
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── TEAM ──────────────────────────────────────────── */}
      <motion.section variants={fadeUp}>
        <Sect label="Team Activity" action="Manage team" />
        <div style={{ marginTop: 14 }}>
          {ACTIVITY.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 + i * 0.07 }}
              style={{
                display: "flex", alignItems: "center", gap: 13,
                padding: "14px 0",
                borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--app-border-glow)" : "none",
              }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                background: `${a.color}1A`,
                border: `1.5px solid ${a.color}38`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: a.color, fontSize: "9.5px", fontWeight: 730, letterSpacing: "0.01em",
              }}>
                {a.initials}
              </div>
              <p style={{
                flex: 1, fontSize: "13.5px", color: "var(--app-text-secondary)",
                letterSpacing: "-0.01em", lineHeight: 1.45,
              }}>
                <strong style={{ fontWeight: 590, color: "var(--app-text-primary)" }}>{a.name}</strong>
                {" "}{a.action}{" "}
                <strong style={{ fontWeight: 540, color: "var(--app-text-primary)" }}>{a.target}</strong>
              </p>
              <span style={{ fontSize: "11px", color: "var(--app-border)", flexShrink: 0 }}>
                {a.ago}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

    </motion.div>
  );
}
