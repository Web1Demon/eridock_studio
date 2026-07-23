"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Upload, Sparkles, ChevronRight, ChevronDown, X, Check, Folder,
  Eye, Copy, Trash2, MoreHorizontal, Filter, BarChart2, Brain, Zap,
  AlertCircle, CheckCircle2, Clock, Target, Hash, BookOpen, Layers,
  ArrowUpDown, GripVertical, FileText, Download, RefreshCw, Shuffle,
  AlertTriangle, TrendingUp, Activity, FlaskConical, Calculator,
  Globe, Leaf, BookText, Star, Command, PanelRight, PanelLeft,
  ChevronUp, ArrowRight, Wand2, SlidersHorizontal, LayoutGrid,
  List, Play, Pause, Timer, Award, Users, GitMerge, Microscope,
  Maximize2, Monitor, RotateCcw, Send, Info,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════ */
type QMode = "JAMB" | "WAEC";
type Difficulty = "easy" | "medium" | "hard";
type BloomLevel = "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
type QuestionType = "mcq" | "true_false" | "fill_blank" | "essay" | "hotspot";
type QStatus = "active" | "draft" | "flagged" | "retired";

interface Option { id: string; text: string; isCorrect: boolean; explanation: string }
interface Tag { id: string; label: string; color: string }

interface Question {
  id: string;
  mode: QMode;
  type: QuestionType;
  text: string;
  imageUrl?: string;
  options: Option[];
  answer: string;
  explanation: string;
  subject: string;
  topic: string;
  year?: number;
  frequency?: number;
  importBankName?: string;
  difficulty: Difficulty;
  bloom: BloomLevel;
  status: QStatus;
  tags: Tag[];
  timeLimit: number; // seconds
  usageCount: number;
  passRate?: number;
  discriminationIndex?: number;
  guessingParam?: number;
  isStar: boolean;
  createdBy: string;
  createdAt: string;
  lastEdited: string;
}

interface ImportRow { raw: string; parsed?: Partial<Question>; error?: string }

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════════ */
const SUBJECTS = [
  { id: "math",    label: "Mathematics",   icon: Calculator,  color: "#FF6B00", bg: "rgba(255,107,0,0.07)" },
  { id: "eng",     label: "English",       icon: BookText,    color: "#2563EB", bg: "rgba(37,99,235,0.07)" },
  { id: "bio",     label: "Biology",       icon: Leaf,        color: "#16A34A", bg: "rgba(22,163,74,0.07)" },
  { id: "chem",    label: "Chemistry",     icon: FlaskConical,color: "#9333EA", bg: "rgba(147,51,234,0.07)" },
  { id: "phy",     label: "Physics",       icon: Activity,    color: "#DC2626", bg: "rgba(220,38,38,0.07)" },
  { id: "geo",     label: "Geography",     icon: Globe,       color: "#0891B2", bg: "rgba(8,145,178,0.07)" },
];

const BLOOM_LABELS: Record<BloomLevel, string> = {
  remember: "Remember", understand: "Understand", apply: "Apply",
  analyze: "Analyze", evaluate: "Evaluate", create: "Create",
};
const BLOOM_COLORS: Record<BloomLevel, string> = {
  remember: "#94A3B8", understand: "#60A5FA", apply: "#34D399",
  analyze: "#FBBF24", evaluate: "#F87171", create: "#C084FC",
};
const DIFF_COLOR: Record<Difficulty, string> = { easy: "#16A34A", medium: "#D97706", hard: "#DC2626" };
const DIFF_BG: Record<Difficulty, string> = { easy: "rgba(22,163,74,0.08)", medium: "rgba(217,119,6,0.08)", hard: "rgba(220,38,38,0.08)" };

function makeQuestion(id: string, mode: QMode, subject: string, overrides: Partial<Question> = {}): Question {
  const diffs: Difficulty[] = ["easy", "medium", "hard"];
  const blooms: BloomLevel[] = ["remember", "understand", "apply", "analyze"];
  return {
    id, mode, type: "mcq",
    text: `Solve the following: If x² + 5x + 6 = 0, what are the roots? (${mode} ${subject})`,
    options: [
      { id: "a", text: "x = -2 and x = -3", isCorrect: true,  explanation: "Factorising gives (x+2)(x+3)=0" },
      { id: "b", text: "x = 2 and x = 3",   isCorrect: false, explanation: "Sign error in factorisation." },
      { id: "c", text: "x = 1 and x = -6",  isCorrect: false, explanation: "Incorrect factorisation." },
      { id: "d", text: "x = -1 and x = 6",  isCorrect: false, explanation: "Incorrect factorisation." },
    ],
    answer: "a",
    explanation: "Factorising x² + 5x + 6 gives (x+2)(x+3) = 0, so x = -2 or x = -3.",
    subject, topic: "Quadratic Equations",
    year: 1999 + parseInt(id.replace(/\D/g, "")) % 7,
    frequency: Math.floor(Math.random() * 4) + 1,
    difficulty: diffs[parseInt(id.replace(/\D/g, "")) % 3],
    bloom: blooms[parseInt(id.replace(/\D/g, "")) % 4],
    status: "active",
    tags: [{ id: "t1", label: "Algebra", color: "#FF6B00" }],
    timeLimit: 90,
    usageCount: Math.floor(Math.random() * 800 + 50),
    passRate: Math.floor(Math.random() * 40 + 45),
    discriminationIndex: Math.round((Math.random() * 0.5 + 0.2) * 100) / 100,
    guessingParam: Math.round((Math.random() * 0.15 + 0.05) * 100) / 100,
    isStar: parseInt(id.replace(/\D/g, "")) % 4 === 0,
    createdBy: "AO",
    createdAt: "2024-09-12",
    lastEdited: "2 days ago",
    ...overrides,
  };
}

const QUESTIONS: Question[] = [
  makeQuestion("q1",  "JAMB", "math"),
  makeQuestion("q2",  "JAMB", "math", { difficulty: "hard", bloom: "analyze", status: "active" }),
  makeQuestion("q3",  "JAMB", "chem", { subject: "chem", text: "Which of the following is an isotope of Carbon-12?", difficulty: "medium" }),
  makeQuestion("q4",  "JAMB", "bio",  { subject: "bio",  text: "The process by which plants make food using sunlight is called?", difficulty: "easy", bloom: "remember" }),
  makeQuestion("q5",  "JAMB", "phy",  { subject: "phy",  text: "A body moving in a circle at constant speed has acceleration directed?", difficulty: "medium", bloom: "understand" }),
  makeQuestion("q6",  "JAMB", "eng",  { subject: "eng",  text: "Choose the word that is most nearly opposite in meaning to BENEVOLENT.", difficulty: "medium", type: "mcq" }),
  makeQuestion("q7",  "JAMB", "math", { difficulty: "hard", status: "flagged", isStar: false }),
  makeQuestion("q8",  "JAMB", "geo",  { subject: "geo",  text: "The largest desert in the world is?", difficulty: "easy", bloom: "remember" }),
  makeQuestion("q9",  "WAEC", "math", { mode: "WAEC" }),
  makeQuestion("q10", "WAEC", "math", { mode: "WAEC", difficulty: "hard" }),
  makeQuestion("q11", "WAEC", "eng",  { mode: "WAEC", subject: "eng", text: "In the sentence 'The dog ran', what is the predicate?", difficulty: "easy" }),
  makeQuestion("q12", "WAEC", "bio",  { mode: "WAEC", subject: "bio",  text: "Describe the process of osmosis.", type: "essay", difficulty: "medium", bloom: "understand" }),
  makeQuestion("q13", "WAEC", "chem", { mode: "WAEC", subject: "chem", difficulty: "hard", bloom: "analyze" }),
  makeQuestion("q14", "WAEC", "phy",  { mode: "WAEC", subject: "phy",  difficulty: "medium", status: "draft" }),
];

const MATRIX_DATA = [
  { subject: "Math",  easy: 8, medium: 12, hard: 5 },
  { subject: "Eng",   easy: 10, medium: 8,  hard: 3 },
  { subject: "Bio",   easy: 6,  medium: 10, hard: 8 },
  { subject: "Chem",  easy: 4,  medium: 7,  hard: 11 },
  { subject: "Phy",   easy: 5,  medium: 9,  hard: 7 },
  { subject: "Geo",   easy: 9,  medium: 5,  hard: 2 },
];

const IMPORT_RAW_SAMPLE = [
  "Q1: What is 2+2? A) 3 B) 4* C) 5 D) 6",
  "Q2: Who wrote Hamlet? A) Dickens B) Shakespeare* C) Keats D) Milton",
  "Q3: Water boils at? A) 90°C B) 95°C C) 100°C* D) 105°C",
  "Q4: The capital of Nigeria is? A) Lagos B) Abuja* C) Kano D) Ibadan",
  "Q5: √16 = ? A) 3 B) 4* C) 5 D) 6 [MISSING EXPLANATION]",
].join("\n");


/* ═══════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════ */
const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.22 } } };

function SubjectIcon({ subject }: { subject: string }) {
  const s = SUBJECTS.find(x => x.id === subject || x.label.toLowerCase() === subject.toLowerCase());
  if (!s) return <BookOpen size={13} />;
  const Icon = s.icon;
  return <Icon size={13} />;
}

/* ═══════════════════════════════════════════════════════════════════
   QUESTION CARD (list item)
═══════════════════════════════════════════════════════════════════ */
function QuestionCard({
  q, selected, onSelect, onStar, onDelete, dragging
}: {
  q: Question; selected: boolean; onSelect: () => void;
  onStar: () => void; onDelete: () => void; dragging?: boolean;
}) {
  const [menu, setMenu] = useState(false);
  const subj = SUBJECTS.find(s => s.id === q.subject);
  const SubIcon = subj?.icon ?? BookOpen;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      onClick={onSelect}
      style={{
        padding: "13px 14px", borderRadius: 12, cursor: "pointer",
        border: `1.5px solid ${selected ? "rgba(255,107,0,0.3)" : "var(--app-border-glow)"}`,
        background: selected ? "rgba(255,107,0,0.04)" : "var(--app-card)",
        boxShadow: dragging ? "0 12px 32px rgba(0,0,0,0.12)" : selected ? "0 2px 8px rgba(255,107,0,0.08)" : "none",
        transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
        position: "relative",
      }}
    >
      {/* Status stripe */}
      <div style={{
        position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, borderRadius: "0 2px 2px 0",
        background: q.status === "flagged" ? "#DC2626" : q.status === "draft" ? "#94A3B8" : q.status === "retired" ? "#78716C" : "#16A34A",
      }} />

      <div style={{ paddingLeft: 8 }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: subj?.bg ?? "var(--app-border-glow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <SubIcon size={13} style={{ color: subj?.color ?? "var(--app-text-secondary)" }} />
          </div>
          <p style={{ flex: 1, fontSize: "13px", fontWeight: 550, color: "var(--app-text-primary)", lineHeight: 1.45, letterSpacing: "-0.01em", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {q.text}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <button onClick={e => { e.stopPropagation(); onStar(); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: q.isStar ? "#F59E0B" : "var(--app-border)" }}>
              <Star size={12} fill={q.isStar ? "#F59E0B" : "none"} />
            </button>
            <div style={{ position: "relative" }}>
              <button onClick={e => { e.stopPropagation(); setMenu(v => !v); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "var(--app-text-secondary)" }}>
                <MoreHorizontal size={13} />
              </button>
              <AnimatePresence>
                {menu && (
                  <motion.div initial={{ opacity: 0, y: -4, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                    onClick={e => e.stopPropagation()}
                    style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "var(--app-card)", border: "1px solid var(--app-border)", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", padding: "4px", zIndex: 30, width: 148 }}>
                    {[
                      { label: "Duplicate", icon: Copy },
                      { label: "View Preview", icon: Eye },
                      { label: "Export", icon: Download },
                      { label: "Delete", icon: Trash2, danger: true },
                    ].map(item => (
                      <button key={item.label} onClick={() => { setMenu(false); if (item.label === "Delete") onDelete(); }}
                        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 10px", borderRadius: 7, border: "none", background: "none", cursor: "pointer", fontSize: "12.5px", color: (item as any).danger ? "#DC2626" : "var(--app-text-primary)", fontWeight: 490 }}
                        onMouseEnter={e => (e.currentTarget.style.background = (item as any).danger ? "rgba(220,38,38,0.06)" : "var(--app-border-glow)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                        <item.icon size={12} /> {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Tags row */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: DIFF_BG[q.difficulty], color: DIFF_COLOR[q.difficulty] }}>
            {q.difficulty}
          </span>
          <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: `${BLOOM_COLORS[q.bloom]}18`, color: BLOOM_COLORS[q.bloom] }}>
            {BLOOM_LABELS[q.bloom]}
          </span>
          {q.year && (
            <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "var(--app-border-glow)", color: "var(--app-text-secondary)" }}>
              {q.year}
            </span>
          )}
          {q.passRate != null && (
            <span style={{ marginLeft: "auto", fontSize: "10.5px", fontWeight: 700, color: q.passRate > 65 ? "#16A34A" : q.passRate > 45 ? "#D97706" : "#DC2626" }}>
              {q.passRate}% pass
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DIFFICULTY MATRIX MODAL
═══════════════════════════════════════════════════════════════════ */
function MatrixModal({ onClose }: { onClose: () => void }) {
  const max = Math.max(...MATRIX_DATA.flatMap(d => [d.easy, d.medium, d.hard]));
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "var(--app-text-secondary)", backdropFilter: "blur(6px)", zIndex: 200 }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
          style={{ background: "var(--app-card)", borderRadius: 22, width: 600, padding: 28, boxShadow: "0 32px 80px rgba(0,0,0,0.16)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 750, letterSpacing: "-0.02em", color: "var(--app-text-primary)" }}>Difficulty Calibration Matrix</h2>
              <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", marginTop: 3 }}>Question distribution across subjects × difficulty levels</p>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid var(--app-border)", background: "var(--app-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} /></button>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {[["Easy", "#16A34A"], ["Medium", "#D97706"], ["Hard", "#DC2626"]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: c as string }} />
                <span style={{ fontSize: "11px", color: "var(--app-text-secondary)", fontWeight: 500 }}>{l}</span>
              </div>
            ))}
          </div>

          {/* Matrix */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MATRIX_DATA.map(row => (
              <div key={row.subject} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--app-text-primary)", width: 36, flexShrink: 0 }}>{row.subject}</p>
                <div style={{ flex: 1, display: "flex", gap: 3, height: 28 }}>
                  {[
                    { v: row.easy, c: "#16A34A" },
                    { v: row.medium, c: "#D97706" },
                    { v: row.hard, c: "#DC2626" },
                  ].map(({ v, c }, i) => (
                    <motion.div key={i} initial={{ width: 0 }} animate={{ width: `${(v / max) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.08 }}
                      style={{ height: "100%", borderRadius: 6, background: `${c}20`, border: `1px solid ${c}30`, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 28, overflow: "hidden" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: c }}>{v}</span>
                    </motion.div>
                  ))}
                </div>
                {row.hard > row.easy + row.medium && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <AlertTriangle size={11} color="#DC2626" />
                    <span style={{ fontSize: "10px", color: "#DC2626", fontWeight: 700 }}>Skewed hard</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: "12px 14px", background: "rgba(37,99,235,0.05)", borderRadius: 10, border: "1px solid rgba(37,99,235,0.12)" }}>
            <p style={{ fontSize: "12px", color: "#2563EB", fontWeight: 600 }}>💡 Recommendation: Add 6 more easy Chemistry questions to balance your bank.</p>
          </div>
        </motion.div>
      </div>
    </>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   IMPORT PIPELINE MODAL
═══════════════════════════════════════════════════════════════════ */
function parseRawQuestion(raw: string, idx: number): Partial<Question> & { error?: string } {
  // Simulate parsing logic
  const hasCorrect = raw.includes("*");
  const hasError = raw.includes("[MISSING");
  const match = raw.match(/^Q\d+:\s*(.+?)\?/);
  const text = match ? match[1] + "?" : `Question ${idx + 1}`;
  const optMatches = [...raw.matchAll(/([A-D])\)\s*([^A-D\[]+?)(?:\*)?(?=[A-D\)]|$|\[)/g)];
  const options: Option[] = optMatches.map(m => ({
    id: m[1].toLowerCase(),
    text: m[2].trim(),
    isCorrect: raw.includes(m[1] + ")*"),
    explanation: "",
  }));
  return {
    text, options,
    difficulty: "medium",
    bloom: "remember",
    type: "mcq",
    ...(hasError ? { error: "Missing explanation field" } : {}),
  };
}

function ImportPipelineModal({ mode, onClose, onImport }: { mode: QMode; onClose: () => void; onImport: (qs: Partial<Question>[]) => void }) {
  const [raw, setRaw] = useState(IMPORT_RAW_SAMPLE);
  const [step, setStep] = useState<"input" | "review" | "done">("input");
  const [parsed, setParsed] = useState<ImportRow[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  const handleParse = () => {
    const rows: ImportRow[] = raw.split("\n").filter(l => l.trim()).map((line, i) => {
      const p = parseRawQuestion(line, i);
      return { raw: line, parsed: p, error: p.error };
    });
    setParsed(rows);
    setSelectedRows(new Set(rows.map((_, i) => i)));
    setStep("review");
  };

  const handleImport = () => {
    const qs = parsed.filter((_, i) => selectedRows.has(i)).map(r => ({ ...r.parsed, mode, status: "draft" as QStatus }));
    onImport(qs);
    setStep("done");
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "var(--app-text-secondary)", backdropFilter: "blur(8px)", zIndex: 200 }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
          style={{ background: "var(--app-bg)", borderRadius: 24, width: "100%", maxWidth: 900, height: "80vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.2)" }}>

          {/* Header */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--app-border)", background: "var(--app-card)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: mode === "JAMB" ? "rgba(37,99,235,0.08)" : "rgba(22,163,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Upload size={16} style={{ color: mode === "JAMB" ? "#2563EB" : "#16A34A" }} />
              </div>
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: 750, color: "var(--app-text-primary)", letterSpacing: "-0.02em" }}>Import Pipeline — {mode}</h2>
                <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", marginTop: 1 }}>Smart parse & live review before committing</p>
              </div>
            </div>
            {/* Progress steps */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {(["input", "review", "done"] as const).map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, background: step === s ? "var(--app-text-primary)" : ["input","review","done"].indexOf(step) > i ? "#16A34A" : "var(--app-border-glow)", color: step === s || ["input","review","done"].indexOf(step) > i ? "var(--app-card)" : "var(--app-text-secondary)" }}>
                    {["input","review","done"].indexOf(step) > i ? <Check size={11} /> : i + 1}
                  </div>
                  {i < 2 && <div style={{ width: 20, height: 1, background: "var(--app-border)" }} />}
                </div>
              ))}
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid var(--app-border)", background: "var(--app-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} /></button>
          </div>

          {step === "input" && (
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>
              {/* Left: Raw input */}
              <div style={{ display: "flex", flexDirection: "column", borderRight: "1px solid var(--app-border)", padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Raw Input</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => fileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-card)", cursor: "pointer", fontSize: "12px", color: "var(--app-text-primary)", fontWeight: 600 }}>
                      <FileText size={12} /> Upload File
                    </button>
                    <input ref={fileRef} type="file" accept=".csv,.json,.txt" style={{ display: "none" }} />
                  </div>
                </div>
                <div style={{ background: "#1E1E2E", borderRadius: 12, flex: 1, overflow: "hidden", fontFamily: "monospace" }}>
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 5 }}>
                    {["#FF5F56", "#FFBD2E", "#27C93F"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                  </div>
                  <textarea value={raw} onChange={e => setRaw(e.target.value)}
                    style={{ width: "100%", height: "calc(100% - 38px)", background: "transparent", border: "none", outline: "none", padding: "12px 14px", color: "#E2E8F0", fontFamily: "monospace", fontSize: "12.5px", lineHeight: 1.7, resize: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              {/* Right: Format guide */}
              <div style={{ padding: 20, overflowY: "auto" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Supported Formats</p>
                {[
                  { label: "Plain Text", desc: "Q1: Question text? A) Option B) Option* C) Option D) Option\n(mark correct answer with *)", color: "#2563EB" },
                  { label: "CSV", desc: "question,optA,optB,optC,optD,correct,explanation", color: "#16A34A" },
                  { label: "JSON Array", desc: '[{"text":"...","options":[...],"answer":"a"}]', color: "#9333EA" },
                ].map(f => (
                  <div key={f.label} style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--app-border)", background: "var(--app-card)", marginBottom: 10 }}>
                    <p style={{ fontSize: "12.5px", fontWeight: 700, color: f.color, marginBottom: 6 }}>{f.label}</p>
                    <pre style={{ fontSize: "11px", color: "var(--app-text-secondary)", margin: 0, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{f.desc}</pre>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(255,107,0,0.05)", borderRadius: 12, border: "1px solid rgba(255,107,0,0.15)" }}>
                  <p style={{ fontSize: "12px", color: "#FF6B00", fontWeight: 650 }}>⚡ Pro tip: Mark correct answers with * in plain text format for instant parsing.</p>
                </div>
              </div>
            </div>
          )}

          {step === "review" && (
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>
              {/* Left: Raw lines */}
              <div style={{ borderRight: "1px solid var(--app-border)", padding: 20, overflowY: "auto" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Raw Lines</p>
                {parsed.map((row, i) => (
                  <div key={i} style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${row.error ? "rgba(220,38,38,0.2)" : "var(--app-border-glow)"}`, background: row.error ? "rgba(220,38,38,0.03)" : "var(--app-card)", marginBottom: 8, fontFamily: "monospace", fontSize: "11.5px", color: "var(--app-text-secondary)", lineHeight: 1.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span>{row.raw}</span>
                      {row.error && <AlertTriangle size={12} color="#DC2626" style={{ flexShrink: 0, marginLeft: 8, marginTop: 2 }} />}
                    </div>
                    {row.error && <p style={{ fontSize: "10.5px", color: "#DC2626", marginTop: 4, fontFamily: "sans-serif" }}>{row.error}</p>}
                  </div>
                ))}
              </div>

              {/* Right: Parsed preview */}
              <div style={{ padding: 20, overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Parsed Preview ({selectedRows.size}/{parsed.length} selected)</p>
                </div>
                {parsed.map((row, i) => (
                  <div key={i} onClick={() => setSelectedRows(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; })}
                    style={{ padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${selectedRows.has(i) ? "rgba(22,163,74,0.3)" : "var(--app-border-glow)"}`, background: selectedRows.has(i) ? "rgba(22,163,74,0.04)" : "var(--app-card)", marginBottom: 8, cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <p style={{ fontSize: "13px", fontWeight: 550, color: "var(--app-text-primary)", lineHeight: 1.45 }}>{row.parsed?.text ?? "—"}</p>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${selectedRows.has(i) ? "#16A34A" : "var(--app-border)"}`, background: selectedRows.has(i) ? "#16A34A" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 8 }}>
                        {selectedRows.has(i) && <Check size={10} color="var(--app-card)" />}
                      </div>
                    </div>
                    {row.parsed?.options?.map(o => (
                      <div key={o.id} style={{ fontSize: "12px", color: o.isCorrect ? "#16A34A" : "var(--app-text-secondary)", padding: "2px 0", fontWeight: o.isCorrect ? 650 : 400 }}>
                        {o.isCorrect ? "✓ " : "○ "}{o.text}
                      </div>
                    ))}
                    {row.error && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: 6 }}>⚠ {row.error}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "done" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(22,163,74,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <CheckCircle2 size={40} color="#16A34A" />
              </motion.div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--app-text-primary)", letterSpacing: "-0.02em", marginBottom: 8 }}>Import Successful</h2>
              <p style={{ fontSize: "14px", color: "var(--app-text-secondary)", marginBottom: 28 }}>{selectedRows.size} questions added to your {mode} bank as drafts.</p>
              <button onClick={onClose} style={{ padding: "12px 28px", background: "var(--app-text-primary)", color: "var(--app-card)", border: "none", borderRadius: 12, fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Back to Studio</button>
            </div>
          )}

          {/* Footer */}
          {step !== "done" && (
            <div style={{ padding: "14px 24px", borderTop: "1px solid var(--app-border)", background: "var(--app-card)", display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
              {step === "review" && <button onClick={() => setStep("input")} style={{ padding: "10px 20px", border: "1.5px solid var(--app-border)", borderRadius: 11, background: "var(--app-card)", cursor: "pointer", fontSize: "13.5px", fontWeight: 600, color: "var(--app-text-secondary)" }}>← Back</button>}
              <button onClick={step === "input" ? handleParse : handleImport}
                style={{ padding: "10px 24px", background: mode === "JAMB" ? "#2563EB" : "#16A34A", color: "var(--app-card)", border: "none", borderRadius: 11, cursor: "pointer", fontSize: "13.5px", fontWeight: 700, boxShadow: `0 8px 20px ${mode === "JAMB" ? "rgba(37,99,235,0.25)" : "rgba(22,163,74,0.25)"}` }}>
                {step === "input" ? `Parse ${raw.split("\n").filter(l => l.trim()).length} Lines →` : `Import ${selectedRows.size} Questions →`}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AI MUTATOR PANEL (slide-in from right)
═══════════════════════════════════════════════════════════════════ */
const VARIATION_TEMPLATES = [
  { label: "Reverse Premise", desc: "Flip the question to test from the answer direction", tag: "Conceptual" },
  { label: "Context Shift",   desc: "Same concept, different real-world scenario",           tag: "Applied" },
  { label: "Negation Form",   desc: "Ask which is NOT correct or which does NOT apply",      tag: "Tricky" },
  { label: "Numeric Variant", desc: "Swap values while keeping the same structure",           tag: "Calculative" },
  { label: "Bloom Elevated",  desc: "Raise cognitive demand to Analyze/Evaluate level",      tag: "Higher Order" },
];

function AIVariationPanel({ q, onClose }: { q: Question; onClose: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleGenerate = () => {
    if (selected === null) return;
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setDone(true); }, 1800);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "var(--app-border)", zIndex: 200 }} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 340, damping: 32 }}
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 380, background: "var(--app-card)", borderLeft: "1px solid var(--app-border-glow)", zIndex: 201, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "-20px 0 60px rgba(0,0,0,0.08)" }}>

        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--app-border)", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, rgba(255,107,0,0.15), rgba(147,51,234,0.15))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Wand2 size={14} style={{ color: "#9333EA" }} />
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 750, color: "var(--app-text-primary)", letterSpacing: "-0.015em" }}>AI Question Mutator</h3>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)", padding: 4 }}><X size={15} /></button>
          </div>
          <p style={{ fontSize: "11.5px", color: "var(--app-text-secondary)", lineHeight: 1.5 }}>Generate fresh variations of this question to prevent rote memorization.</p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {/* Source preview */}
          <div style={{ padding: "12px 14px", background: "var(--app-border-glow)", borderRadius: 12, border: "1px solid var(--app-border)", marginBottom: 20 }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Source Question</p>
            <p style={{ fontSize: "12.5px", color: "var(--app-text-primary)", lineHeight: 1.5 }}>{q.text}</p>
          </div>

          {/* Variation types */}
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Mutation Type</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {VARIATION_TEMPLATES.map((t, i) => (
              <button key={i} onClick={() => setSelected(i)}
                style={{ padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${selected === i ? "rgba(147,51,234,0.3)" : "var(--app-border-glow)"}`, background: selected === i ? "rgba(147,51,234,0.05)" : "var(--app-card)", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ fontSize: "13px", fontWeight: 650, color: "var(--app-text-primary)" }}>{t.label}</p>
                  <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: selected === i ? "rgba(147,51,234,0.12)" : "var(--app-border-glow)", color: selected === i ? "#9333EA" : "var(--app-text-secondary)" }}>{t.tag}</span>
                </div>
                <p style={{ fontSize: "11.5px", color: "var(--app-text-secondary)", marginTop: 4, lineHeight: 1.4 }}>{t.desc}</p>
              </button>
            ))}
          </div>

          {/* Generated variations */}
          {done && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Generated Variation</p>
              <div style={{ padding: "14px", background: "rgba(22,163,74,0.04)", borderRadius: 12, border: "1.5px solid rgba(22,163,74,0.2)", marginBottom: 10 }}>
                <p style={{ fontSize: "13px", fontWeight: 550, color: "var(--app-text-primary)", lineHeight: 1.5, marginBottom: 10 }}>
                  If the roots of a quadratic equation are −2 and −3, which of the following could be the equation?
                </p>
                {["x² + 5x + 6 = 0 ✓", "x² − 5x + 6 = 0", "x² + 5x − 6 = 0", "x² − 5x − 6 = 0"].map((o, i) => (
                  <div key={i} style={{ fontSize: "12px", color: i === 0 ? "#16A34A" : "var(--app-text-secondary)", fontWeight: i === 0 ? 650 : 400, padding: "2px 0" }}>{o}</div>
                ))}
              </div>
              <button style={{ width: "100%", padding: "10px", background: "var(--app-text-primary)", color: "var(--app-card)", border: "none", borderRadius: 11, fontSize: "13.5px", fontWeight: 700, cursor: "pointer" }}>
                Add to Bank →
              </button>
            </motion.div>
          )}
        </div>

        {!done && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid var(--app-border)", flexShrink: 0 }}>
            <button onClick={handleGenerate} disabled={selected === null || generating}
              style={{ width: "100%", padding: "12px", background: selected === null ? "var(--app-border-glow)" : "linear-gradient(135deg, #FF6B00, #9333EA)", color: selected === null ? "var(--app-border)" : "var(--app-card)", border: "none", borderRadius: 12, fontSize: "14px", fontWeight: 700, cursor: selected === null ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {generating ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><RefreshCw size={15} /></motion.div> Generating…</>
              ) : (
                <><Wand2 size={15} /> Generate Variation</>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   CBT SIMULATOR MODAL
═══════════════════════════════════════════════════════════════════ */
function CBTSimulator({ q, mode, onClose }: { q: Question; mode: QMode; onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [time, setTime] = useState(q.timeLimit);

  useEffect(() => {
    const t = setInterval(() => setTime(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(time / 60);
  const secs = time % 60;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: mode === "JAMB" ? "#0F172A" : "#064E3B", display: "flex", flexDirection: "column" }}>

      {/* Exam header */}
      <div style={{ padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ padding: "4px 14px", borderRadius: 99, background: mode === "JAMB" ? "#2563EB" : "#16A34A", color: "var(--app-card)", fontSize: "12px", fontWeight: 800, letterSpacing: "0.06em" }}>{mode}</div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Question 1 of 40</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, background: time < 30 ? "rgba(220,38,38,0.2)" : "rgba(255,255,255,0.08)", border: `1px solid ${time < 30 ? "rgba(220,38,38,0.4)" : "rgba(255,255,255,0.1)"}` }}>
            <Timer size={13} color={time < 30 ? "#F87171" : "#94A3B8"} />
            <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: 700, color: time < 30 ? "#F87171" : "var(--app-card)" }}>
              {mins}:{secs.toString().padStart(2, "0")}
            </span>
          </div>
          <button onClick={onClose} style={{ padding: "6px 14px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>
            Exit Preview
          </button>
        </div>
      </div>

      {/* Question body */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 40px" }}>
        <div style={{ width: "100%", maxWidth: 680 }}>
          <div style={{ marginBottom: 28, padding: "20px 24px", background: "rgba(255,255,255,0.05)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: 12, fontWeight: 600 }}>Question 1</p>
            <p style={{ fontSize: "17px", color: "var(--app-card)", lineHeight: 1.7, fontWeight: 450 }}>{q.text}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, i) => {
              const letter = ["A", "B", "C", "D"][i];
              const isSelected = selected === opt.id;
              const isCorrect = opt.isCorrect;
              const showResult = revealed && (isSelected || isCorrect);
              return (
                <button key={opt.id} onClick={() => !revealed && setSelected(opt.id)}
                  style={{
                    padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${showResult ? (isCorrect ? "#16A34A" : "#DC2626") : isSelected ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}`,
                    background: showResult ? (isCorrect ? "rgba(22,163,74,0.12)" : "rgba(220,38,38,0.08)") : isSelected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                    display: "flex", alignItems: "center", gap: 14, cursor: revealed ? "default" : "pointer", textAlign: "left",
                    transition: "all 0.2s",
                  }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, border: `1.5px solid ${showResult ? (isCorrect ? "#16A34A" : "#DC2626") : isSelected ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: showResult && isCorrect ? "rgba(22,163,74,0.2)" : "transparent" }}>
                    {showResult ? (isCorrect ? <Check size={15} color="#4ADE80" /> : (isSelected ? <X size={14} color="#F87171" /> : null)) : <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 700 }}>{letter}</span>}
                  </div>
                  <span style={{ color: showResult ? (isCorrect ? "#4ADE80" : isSelected ? "#F87171" : "rgba(255,255,255,0.4)") : "rgba(255,255,255,0.85)", fontSize: "15px" }}>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Reveal / Next */}
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            {!revealed && (
              <button onClick={() => setRevealed(true)} disabled={!selected}
                style={{ flex: 1, padding: "13px", background: selected ? (mode === "JAMB" ? "#2563EB" : "#16A34A") : "rgba(255,255,255,0.06)", color: selected ? "var(--app-card)" : "rgba(255,255,255,0.3)", border: "none", borderRadius: 12, fontSize: "15px", fontWeight: 700, cursor: selected ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                Submit Answer
              </button>
            )}
            {revealed && (
              <button onClick={onClose}
                style={{ flex: 1, padding: "13px", background: "rgba(255,255,255,0.08)", color: "var(--app-card)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
                Back to Studio →
              </button>
            )}
          </div>

          {revealed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 16, padding: "14px 16px", background: "rgba(255,255,255,0.05)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
              <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.5)", marginBottom: 4, fontWeight: 600 }}>Explanation</p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{q.explanation}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INSPECTOR PANEL (right pane)
═══════════════════════════════════════════════════════════════════ */
function InspectorPanel({ q, mode, onUpdate, onOpenMutator, onSimulate }: {
  q: Question | null; mode: QMode;
  onUpdate: (updates: Partial<Question>) => void;
  onOpenMutator: () => void;
  onSimulate: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"edit" | "analytics" | "irt">("edit");

  if (!q) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", background: "var(--app-bg)" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: "var(--app-border-glow)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <FileText size={26} style={{ color: "var(--app-border)" }} />
        </div>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--app-text-secondary)", marginBottom: 6 }}>Select a question</p>
        <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", lineHeight: 1.5 }}>Click any question from the library to inspect and edit it here.</p>
      </div>
    );
  }

  const subj = SUBJECTS.find(s => s.id === q.subject);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--app-bg)" }}>
      {/* Tab bar */}
      <div style={{ padding: "0 16px", borderBottom: "1px solid var(--app-border)", background: "var(--app-card)", flexShrink: 0, display: "flex", gap: 0 }}>
        {(["edit", "analytics", "irt"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: "12px 14px", border: "none", background: "none", cursor: "pointer", fontSize: "12.5px", fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? "var(--app-text-primary)" : "var(--app-text-secondary)", borderBottom: `2px solid ${activeTab === tab ? "#FF6B00" : "transparent"}`, transition: "all 0.15s", textTransform: "capitalize" }}>
            {tab === "irt" ? "IRT Metrics" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
        {activeTab === "edit" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Question text */}
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Question Text</label>
              <textarea value={q.text} onChange={e => onUpdate({ text: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--app-border-glow)", borderRadius: 10, fontSize: "13px", color: "var(--app-text-primary)", fontFamily: "inherit", lineHeight: 1.55, resize: "none", outline: "none", minHeight: 90, boxSizing: "border-box" }} />
            </div>

            {/* Options */}
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Answer Options</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {q.options.map((opt, i) => (
                  <div key={opt.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => onUpdate({ options: q.options.map(o => ({ ...o, isCorrect: o.id === opt.id })), answer: opt.id })}
                      style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${opt.isCorrect ? "#16A34A" : "var(--app-border)"}`, background: opt.isCorrect ? "#16A34A" : "transparent", flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {opt.isCorrect && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--app-card)" }} />}
                    </button>
                    <div style={{ width: 20, height: 20, borderRadius: 5, background: opt.isCorrect ? "rgba(22,163,74,0.1)" : "var(--app-border-glow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "10px", fontWeight: 800, color: opt.isCorrect ? "#16A34A" : "var(--app-text-secondary)" }}>{["A","B","C","D"][i]}</span>
                    </div>
                    <input value={opt.text} onChange={e => onUpdate({ options: q.options.map(o => o.id === opt.id ? { ...o, text: e.target.value } : o) })}
                      style={{ flex: 1, padding: "7px 10px", border: `1.5px solid ${opt.isCorrect ? "rgba(22,163,74,0.3)" : "var(--app-border-glow)"}`, borderRadius: 8, fontSize: "12.5px", outline: "none", background: opt.isCorrect ? "rgba(22,163,74,0.03)" : "var(--app-card)", fontFamily: "inherit", color: "var(--app-text-primary)" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Explanation</label>
              <textarea value={q.explanation} onChange={e => onUpdate({ explanation: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--app-border-glow)", borderRadius: 10, fontSize: "12.5px", color: "var(--app-text-primary)", fontFamily: "inherit", lineHeight: 1.55, resize: "none", outline: "none", minHeight: 72, boxSizing: "border-box" }} />
            </div>

            {/* Metadata */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Difficulty</label>
                <div style={{ display: "flex", gap: 4 }}>
                  {(["easy","medium","hard"] as Difficulty[]).map(d => (
                    <button key={d} onClick={() => onUpdate({ difficulty: d })}
                      style={{ flex: 1, padding: "6px 2px", borderRadius: 8, border: `1.5px solid ${q.difficulty === d ? DIFF_COLOR[d] : "var(--app-border-glow)"}`, background: q.difficulty === d ? DIFF_BG[d] : "var(--app-card)", color: q.difficulty === d ? DIFF_COLOR[d] : "var(--app-text-secondary)", fontSize: "10px", fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{d[0].toUpperCase()}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Time Limit</label>
                <select value={q.timeLimit} onChange={e => onUpdate({ timeLimit: Number(e.target.value) })}
                  style={{ width: "100%", padding: "7px 10px", border: "1.5px solid var(--app-border-glow)", borderRadius: 8, fontSize: "12.5px", outline: "none", background: "var(--app-card)", color: "var(--app-text-primary)", fontFamily: "inherit", cursor: "pointer" }}>
                  {[30, 45, 60, 90, 120, 180].map(s => <option key={s} value={s}>{s}s</option>)}
                </select>
              </div>
            </div>

            {/* Bloom's Taxonomy */}
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Bloom's Level</label>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {(Object.keys(BLOOM_LABELS) as BloomLevel[]).map(b => (
                  <button key={b} onClick={() => onUpdate({ bloom: b })}
                    style={{ padding: "5px 10px", borderRadius: 99, border: `1.5px solid ${q.bloom === b ? BLOOM_COLORS[b] : "var(--app-border-glow)"}`, background: q.bloom === b ? `${BLOOM_COLORS[b]}15` : "var(--app-card)", color: q.bloom === b ? BLOOM_COLORS[b] : "var(--app-text-secondary)", fontSize: "10.5px", fontWeight: 650, cursor: "pointer" }}>
                    {BLOOM_LABELS[b]}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
              <button onClick={onOpenMutator}
                style={{ flex: 1, padding: "10px", border: "1.5px solid rgba(147,51,234,0.25)", borderRadius: 10, background: "rgba(147,51,234,0.05)", color: "#9333EA", fontSize: "12.5px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Wand2 size={13} /> AI Mutator
              </button>
              <button onClick={onSimulate}
                style={{ flex: 1, padding: "10px", border: "1.5px solid var(--app-border)", borderRadius: 10, background: "var(--app-card)", color: "var(--app-text-primary)", fontSize: "12.5px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Monitor size={13} /> Preview
              </button>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Performance Analytics</p>
            {[
              { label: "Usage Count",   value: q.usageCount, suffix: "× used",    color: "#2563EB", pct: (q.usageCount / 1000) * 100 },
              { label: "Pass Rate",     value: q.passRate ?? 0, suffix: "%",        color: (q.passRate ?? 0) > 65 ? "#16A34A" : (q.passRate ?? 0) > 45 ? "#D97706" : "#DC2626", pct: q.passRate ?? 0 },
            ].map(stat => (
              <div key={stat.label} style={{ padding: "14px", background: "var(--app-card)", borderRadius: 12, border: "1px solid var(--app-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 500 }}>{stat.label}</p>
                  <p style={{ fontSize: "15px", fontWeight: 750, color: stat.color }}>{stat.value}{stat.suffix}</p>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: "var(--app-border-glow)", overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, stat.pct)}%` }} transition={{ duration: 0.7, ease: "easeOut" }}
                    style={{ height: "100%", borderRadius: 99, background: stat.color }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "irt" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Item Response Theory</p>
            <div style={{ padding: "12px 14px", background: "rgba(147,51,234,0.04)", borderRadius: 12, border: "1px solid rgba(147,51,234,0.15)" }}>
              <p style={{ fontSize: "11.5px", color: "#9333EA", fontWeight: 600, marginBottom: 4 }}>⚗ IRT Parameters (3PL Model)</p>
              <p style={{ fontSize: "11px", color: "var(--app-text-secondary)", lineHeight: 1.5 }}>Based on historical response patterns from student sessions.</p>
            </div>
            {[
              { label: "Discrimination (a)", desc: "How well it differentiates ability levels", value: q.discriminationIndex ?? 0, color: "#9333EA", format: (v: number) => v.toFixed(2) },
              { label: "Difficulty (b)",       desc: "Ability level at 50% probability",           value: (q.passRate ?? 50) / 100, color: "#F59E0B", format: (v: number) => v.toFixed(2) },
              { label: "Guessing (c)",          desc: "Probability of correct by chance",            value: q.guessingParam ?? 0, color: "#DC2626", format: (v: number) => v.toFixed(2) },
            ].map(p => (
              <div key={p.label} style={{ padding: "13px 14px", background: "var(--app-card)", borderRadius: 12, border: "1px solid var(--app-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <p style={{ fontSize: "12.5px", fontWeight: 650, color: "var(--app-text-primary)" }}>{p.label}</p>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: p.color, fontVariantNumeric: "tabular-nums" }}>{p.format(p.value)}</span>
                </div>
                <p style={{ fontSize: "11px", color: "var(--app-text-secondary)", lineHeight: 1.4 }}>{p.desc}</p>
                <div style={{ height: 4, borderRadius: 99, background: "var(--app-border-glow)", marginTop: 10, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${p.value * 100}%` }} transition={{ duration: 0.6 }}
                    style={{ height: "100%", borderRadius: 99, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EMPTY STATE
═══════════════════════════════════════════════════════════════════ */
function QuestionsEmptyState({ mode, onImport, onCreate }: { mode: QMode; onImport: () => void; onCreate: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
      <motion.div animate={{ y: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        style={{ width: 120, height: 120, borderRadius: 30, background: mode === "JAMB" ? "rgba(37,99,235,0.07)" : "rgba(22,163,74,0.07)", border: `2px dashed ${mode === "JAMB" ? "rgba(37,99,235,0.2)" : "rgba(22,163,74,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <rect x="8" y="10" width="40" height="8" rx="4" fill={mode === "JAMB" ? "rgba(37,99,235,0.2)" : "rgba(22,163,74,0.2)"} />
          <rect x="8" y="24" width="28" height="6" rx="3" fill={mode === "JAMB" ? "rgba(37,99,235,0.12)" : "rgba(22,163,74,0.12)"} />
          <rect x="8" y="36" width="32" height="6" rx="3" fill={mode === "JAMB" ? "rgba(37,99,235,0.1)" : "rgba(22,163,74,0.1)"} />
          <circle cx="43" cy="43" r="9" fill={mode === "JAMB" ? "#2563EB" : "#16A34A"} />
          <path d="M40 43H46M43 40V46" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>
      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--app-text-primary)", letterSpacing: "-0.03em", marginBottom: 12 }}>
        No {mode} Questions Yet
      </h2>
      <p style={{ fontSize: "14px", color: "var(--app-text-secondary)", lineHeight: 1.7, maxWidth: 360, marginBottom: 32 }}>
        Build your {mode} question bank by importing a file or creating questions one by one.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onImport}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", background: mode === "JAMB" ? "#2563EB" : "#16A34A", color: "var(--app-card)", border: "none", borderRadius: 12, fontSize: "14px", fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 24px ${mode === "JAMB" ? "rgba(37,99,235,0.3)" : "rgba(22,163,74,0.3)"}` }}>
          <Upload size={15} /> Import Questions
        </button>
        <button onClick={onCreate}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "var(--app-card)", color: "var(--app-text-primary)", border: "1.5px solid var(--app-border)", borderRadius: 12, fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
          <Plus size={15} /> Create Manually
        </button>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   TOPIC ORDERING — data shape
═══════════════════════════════════════════════════════════════════ */
// Subject → topic ordering map (manual order persisted in state)
type TopicOrder = Record<string, string[]>; // subjectId → ordered topic names

const DEFAULT_TOPIC_ORDERS: Record<QMode, TopicOrder> = {
  JAMB: {
    math: ["Number & Numeration", "Algebra", "Quadratic Equations", "Geometry", "Trigonometry", "Statistics"],
    eng:  ["Comprehension", "Summary", "Lexis & Structure", "Oral English"],
    bio:  ["Cell Biology", "Genetics", "Ecology", "Photosynthesis", "Human Physiology"],
    chem: ["Atomic Structure", "Chemical Bonding", "Organic Chemistry", "Electrochemistry"],
    phy:  ["Mechanics", "Waves", "Electrostatics", "Electromagnetism", "Optics"],
    geo:  ["Map Reading", "Climatology", "Geomorphology", "Economic Geography"],
  },
  WAEC: {
    math: ["Algebra", "Quadratic Equations", "Mensuration", "Coordinate Geometry", "Calculus"],
    eng:  ["Essay Writing", "Comprehension", "Summary", "Literature"],
    bio:  ["Ecology", "Genetics", "Cell Biology", "Human Physiology", "Plant Physiology"],
    chem: ["Organic Chemistry", "Equilibrium", "Electrochemistry", "Atomic Theory"],
    phy:  ["Mechanics", "Heat", "Light", "Sound", "Electricity"],
    geo:  ["Physical Geography", "Human Geography", "Regional Geography"],
  },
};

/* ═══════════════════════════════════════════════════════════════════
   LANDING PAGE — overview before entering workspace
═══════════════════════════════════════════════════════════════════ */
function QuestionsLandingPage({
  questions,
  onEnterWorkspace,
  onCreateNew,
  onImport,
}: {
  questions: Question[];
  onEnterWorkspace: (mode: QMode, subjectId?: string) => void;
  onCreateNew: () => void;
  onImport: (mode: QMode) => void;
}) {
  const jambQs = questions.filter(q => q.mode === "JAMB");
  const waecQs = questions.filter(q => q.mode === "WAEC");
  const totalQs = questions.length;
  const hasAny  = totalQs > 0;

  return (
    <div style={{ flex: 1, overflowY: "auto", fontFamily: "var(--font-sans)", background: "var(--app-bg)" }}>

      {/* Header */}
      <div style={{ padding: "36px 48px 0", background: "var(--app-card)", borderBottom: "1px solid var(--app-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Question Bank</p>
            <h1 style={{ fontSize: "30px", fontWeight: 850, color: "var(--app-text-primary)", letterSpacing: "-0.03em", marginBottom: 6 }}>Questions Studio</h1>
            <p style={{ fontSize: "14px", color: "var(--app-text-secondary)", lineHeight: 1.6 }}>
              Build, manage, and calibrate your JAMB and WAEC question banks.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onCreateNew}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "var(--app-text-primary)", color: "var(--app-card)", border: "none", borderRadius: 12, fontSize: "14px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.18)" }}>
              <Plus size={15} /> New Question
            </button>
          </div>
        </div>

        {/* Summary stats */}
        {hasAny && (
          <div style={{ display: "flex", gap: 32, paddingBottom: 20 }}>
            {[
              { label: "Total Questions",  value: totalQs,    color: "var(--app-text-primary)" },
              { label: "JAMB Bank",        value: jambQs.length, color: "#2563EB" },
              { label: "WAEC Bank",        value: waecQs.length, color: "#16A34A" },
              { label: "Avg Pass Rate",    value: `${Math.round(questions.reduce((a, q) => a + (q.passRate ?? 0), 0) / (questions.length || 1))}%`, color: "#FF6B00" },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: "24px", fontWeight: 850, color: s.color, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: "11.5px", color: "var(--app-text-secondary)", marginTop: 4, fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "32px 48px 72px" }}>
        {!hasAny ? (
          /* ── Full empty state ── */
          <LandingEmptyState onCreateNew={onCreateNew} onImport={onImport} />
        ) : (
          /* ── Mode cards + subject breakdown ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {(["JAMB", "WAEC"] as QMode[]).map(mode => {
              const mqs = questions.filter(q => q.mode === mode);
              if (mqs.length === 0) {
                return (
                  <ModeEmptyCard key={mode} mode={mode}
                    onImport={() => onImport(mode)}
                    onCreate={onCreateNew}
                  />
                );
              }
              // Group by subject
              const bySubject = SUBJECTS.map(s => ({
                subj: s,
                questions: mqs.filter(q => q.subject === s.id),
              })).filter(g => g.questions.length > 0);

              return (
                <div key={mode}>
                  {/* Mode heading */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ padding: "4px 14px", borderRadius: 99, background: mode === "JAMB" ? "rgba(37,99,235,0.1)" : "rgba(22,163,74,0.1)", fontSize: "12px", fontWeight: 800, letterSpacing: "0.05em", color: mode === "JAMB" ? "#2563EB" : "#16A34A" }}>{mode}</div>
                      <h2 style={{ fontSize: "18px", fontWeight: 750, color: "var(--app-text-primary)", letterSpacing: "-0.02em" }}>{mode === "WAEC" ? "WAEC (Other)" : "JAMB CBT"}</h2>
                      <span style={{ fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 500 }}>{mqs.length} questions</span>
                    </div>
                    <button onClick={() => onEnterWorkspace(mode)}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: `1.5px solid ${mode === "JAMB" ? "rgba(37,99,235,0.25)" : "rgba(22,163,74,0.25)"}`, background: mode === "JAMB" ? "rgba(37,99,235,0.05)" : "rgba(22,163,74,0.05)", color: mode === "JAMB" ? "#2563EB" : "#16A34A", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                      Open Studio <ChevronRight size={13} />
                    </button>
                  </div>

                  {/* Subject grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                    {bySubject.map(({ subj, questions: sqs }) => {
                      const topics = [...new Set(sqs.map(q => q.topic))];
                      const byDiff = { easy: sqs.filter(q => q.difficulty === "easy").length, medium: sqs.filter(q => q.difficulty === "medium").length, hard: sqs.filter(q => q.difficulty === "hard").length };
                      const SubIcon = subj.icon;
                      return (
                        <motion.div key={subj.id} whileHover={{ y: -2, boxShadow: "0 10px 28px rgba(0,0,0,0.08)" }} transition={{ duration: 0.18 }}
                          onClick={() => onEnterWorkspace(mode, subj.id)}
                          style={{ padding: "18px 20px", background: "var(--app-card)", borderRadius: 16, border: "1px solid var(--app-border)", cursor: "pointer", transition: "box-shadow 0.18s" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: subj.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <SubIcon size={16} style={{ color: subj.color }} />
                            </div>
                            <div>
                              <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)" }}>{subj.label}</p>
                              <p style={{ fontSize: "11px", color: "var(--app-text-secondary)" }}>{sqs.length} questions · {topics.length} topics</p>
                            </div>
                          </div>
                          {/* Difficulty bar */}
                          <div style={{ height: 5, borderRadius: 99, overflow: "hidden", background: "var(--app-border-glow)", marginBottom: 12, display: "flex" }}>
                            {[
                              { v: byDiff.easy,   c: "#16A34A" },
                              { v: byDiff.medium, c: "#D97706" },
                              { v: byDiff.hard,   c: "#DC2626" },
                            ].map((seg, i) => (
                              <motion.div key={i} initial={{ width: 0 }} animate={{ width: `${(seg.v / sqs.length) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.1 }}
                                style={{ height: "100%", background: seg.c }} />
                            ))}
                          </div>
                          {/* Topics preview */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {topics.slice(0, 3).map(t => (
                              <span key={t} style={{ fontSize: "10.5px", padding: "2px 8px", borderRadius: 99, background: subj.bg, color: subj.color, fontWeight: 600 }}>{t}</span>
                            ))}
                            {topics.length > 3 && <span style={{ fontSize: "10.5px", padding: "2px 8px", borderRadius: 99, background: "var(--app-border-glow)", color: "var(--app-text-secondary)", fontWeight: 600 }}>+{topics.length - 3}</span>}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Full Empty State ─────────────────────────────────────────── */
function LandingEmptyState({ onCreateNew, onImport }: { onCreateNew: () => void; onImport: (mode: QMode) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 0", textAlign: "center" }}>
      {/* Animated illustration */}
      <div style={{ position: "relative", width: 220, height: 180, marginBottom: 36 }}>
        <motion.div animate={{ y: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", width: 180, height: 140, borderRadius: 28, background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(22,163,74,0.06))", border: "2px dashed var(--app-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            {/* Question sheet */}
            <rect x="12" y="8"  width="56" height="64" rx="8" fill="rgba(37,99,235,0.06)" stroke="rgba(37,99,235,0.15)" strokeWidth="1.5"/>
            <rect x="20" y="18" width="40" height="6"  rx="3" fill="rgba(37,99,235,0.2)"/>
            {/* MCQ lines */}
            <circle cx="22" cy="34" r="4" stroke="rgba(22,163,74,0.4)" strokeWidth="1.5"/>
            <rect x="30" y="31" width="26" height="4" rx="2" fill="var(--app-border)"/>
            <circle cx="22" cy="46" r="4" stroke="var(--app-border)" strokeWidth="1.5"/>
            <rect x="30" y="43" width="20" height="4" rx="2" fill="var(--app-border-glow)"/>
            <circle cx="22" cy="58" r="4" stroke="var(--app-border)" strokeWidth="1.5"/>
            <rect x="30" y="55" width="24" height="4" rx="2" fill="var(--app-border-glow)"/>
            {/* Tick */}
            <circle cx="22" cy="34" r="4" fill="rgba(22,163,74,0.15)"/>
            <path d="M20 34l1.5 1.5L24 32" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Plus badge */}
            <circle cx="64" cy="64" r="12" fill="var(--app-text-primary)"/>
            <path d="M64 59v10M59 64h10" stroke="var(--app-card)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </motion.div>
        {/* Floating dots */}
        {[
          { x: 10, y: 20, c: "#2563EB", d: 0 },
          { x: 190, y: 30, c: "#16A34A", d: 0.5 },
          { x: 20, y: 140, c: "#FF6B00", d: 1 },
          { x: 185, y: 120, c: "#9333EA", d: 1.5 },
        ].map((dot, i) => (
          <motion.div key={i} animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: dot.d }}
            style={{ position: "absolute", left: dot.x, top: dot.y, width: 10, height: 10, borderRadius: "50%", background: dot.c, opacity: 0.4 }} />
        ))}
      </div>

      <h2 style={{ fontSize: "28px", fontWeight: 850, color: "var(--app-text-primary)", letterSpacing: "-0.03em", marginBottom: 12 }}>
        Your question bank is empty
      </h2>
      <p style={{ fontSize: "15px", color: "var(--app-text-secondary)", lineHeight: 1.7, maxWidth: 420, marginBottom: 36 }}>
        Create your first question manually, or import a batch from a CSV or text file. Questions are organized by subject and topic automatically.
      </p>

      {/* Primary actions */}
      <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
        <button onClick={onCreateNew}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 26px", background: "var(--app-text-primary)", color: "var(--app-card)", border: "none", borderRadius: 13, fontSize: "15px", fontWeight: 750, cursor: "pointer", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", letterSpacing: "-0.01em" }}>
          <Plus size={16} /> Create Question
        </button>
        <button onClick={() => onImport("JAMB")}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 26px", background: "var(--app-card)", color: "var(--app-text-primary)", border: "1.5px solid var(--app-border)", borderRadius: 13, fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
          <Upload size={16} /> Import from File
        </button>
      </div>

      {/* Mode quick-start cards */}
      <div style={{ display: "flex", gap: 16, maxWidth: 600 }}>
        {(["JAMB", "WAEC"] as QMode[]).map(mode => (
          <div key={mode} style={{ flex: 1, padding: "20px", background: "var(--app-card)", borderRadius: 16, border: "1px solid var(--app-border)", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ padding: "3px 12px", borderRadius: 99, background: mode === "JAMB" ? "rgba(37,99,235,0.09)" : "rgba(22,163,74,0.09)", fontSize: "11px", fontWeight: 800, color: mode === "JAMB" ? "#2563EB" : "#16A34A", letterSpacing: "0.05em" }}>{mode}</div>
            </div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)", marginBottom: 6 }}>{mode === "JAMB" ? "JAMB CBT Format" : "WAEC (Other)"}</p>
            <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", lineHeight: 1.55, marginBottom: 14 }}>
              {mode === "JAMB" ? "Multiple-choice questions with a timer. Import past questions or create from scratch." : "Supports essays, fill-in-the-blank, and MCQ formats for theory-based exams."}
            </p>
            <button onClick={() => onImport(mode)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: `1.5px solid ${mode === "JAMB" ? "rgba(37,99,235,0.2)" : "rgba(22,163,74,0.2)"}`, background: "transparent", color: mode === "JAMB" ? "#2563EB" : "#16A34A", fontSize: "12.5px", fontWeight: 700, cursor: "pointer" }}>
              <Upload size={12} /> Import {mode}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Mode-level empty card (shown when JAMB has 0 or WAEC has 0) ─ */
function ModeEmptyCard({ mode, onImport, onCreate }: { mode: QMode; onImport: () => void; onCreate: () => void }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ padding: "4px 14px", borderRadius: 99, background: mode === "JAMB" ? "rgba(37,99,235,0.08)" : "rgba(22,163,74,0.08)", fontSize: "12px", fontWeight: 800, color: mode === "JAMB" ? "#2563EB" : "#16A34A" }}>{mode}</div>
        <h2 style={{ fontSize: "18px", fontWeight: 750, color: "var(--app-text-primary)" }}>{mode === "WAEC" ? "WAEC (Other)" : "JAMB CBT"}</h2>
      </div>
      <div style={{ padding: "32px", background: "var(--app-card)", borderRadius: 16, border: "2px dashed var(--app-border)", display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: mode === "JAMB" ? "rgba(37,99,235,0.07)" : "rgba(22,163,74,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <FileText size={22} style={{ color: mode === "JAMB" ? "#2563EB" : "#16A34A" }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--app-text-primary)", marginBottom: 4 }}>No {mode} questions yet</p>
          <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", lineHeight: 1.5 }}>Add your first question to begin building the {mode} bank.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onImport}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: `1.5px solid ${mode === "JAMB" ? "rgba(37,99,235,0.25)" : "rgba(22,163,74,0.25)"}`, background: "transparent", color: mode === "JAMB" ? "#2563EB" : "#16A34A", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            <Upload size={13} /> Import
          </button>
          <button onClick={onCreate}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "none", background: "var(--app-text-primary)", color: "var(--app-card)", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            <Plus size={13} /> Create
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CREATE NEW QUESTION WIZARD
═══════════════════════════════════════════════════════════════════ */
interface WizardState {
  mode: QMode | null;
  type: QuestionType | null;
  subject: string | null;
  topic: string;
  text: string;
  options: Option[];
  explanation: string;
  difficulty: Difficulty;
  bloom: BloomLevel;
  year: string;
  timeLimit: number;
}

const BLANK_WIZARD: WizardState = {
  mode: null, type: null, subject: null, topic: "",
  text: "", explanation: "", difficulty: "medium", bloom: "understand",
  year: "", timeLimit: 90,
  options: [
    { id: "a", text: "", isCorrect: true,  explanation: "" },
    { id: "b", text: "", isCorrect: false, explanation: "" },
    { id: "c", text: "", isCorrect: false, explanation: "" },
    { id: "d", text: "", isCorrect: false, explanation: "" },
  ],
};

const QTYPE_OPTIONS: { type: QuestionType; label: string; desc: string; icon: React.ElementType; color: string; bg: string; modes: QMode[] }[] = [
  { type: "mcq",        label: "Multiple Choice",    desc: "4 options, one correct answer. Standard JAMB & WAEC format.",     icon: Target,    color: "#2563EB", bg: "rgba(37,99,235,0.07)",   modes: ["JAMB","WAEC"] },
  { type: "true_false", label: "True / False",       desc: "Binary choice question. Quick to create and great for concepts.",  icon: CheckCircle2, color: "#16A34A", bg: "rgba(22,163,74,0.07)",   modes: ["JAMB","WAEC"] },
  { type: "fill_blank", label: "Fill in the Blank",  desc: "Students type in a missing word or phrase.",                      icon: FileText,  color: "#D97706", bg: "rgba(217,119,6,0.07)",   modes: ["WAEC"] },
  { type: "essay",      label: "Essay / Long Answer", desc: "Theory questions that require written explanations.",              icon: BookText,  color: "#9333EA", bg: "rgba(147,51,234,0.07)",  modes: ["WAEC"] },
];

function CreateQuestionWizard({
  defaultMode,
  onClose,
  onSave,
  onImport,
}: {
  defaultMode?: QMode;
  onClose: () => void;
  onSave: (q: Partial<Question>) => void;
  onImport?: (mode: QMode) => void;
}) {
  const [step, setStep] = useState(0); // 0=mode, 1=type, 2=subject+topic, 3=question, 4=review
  const [state, setState] = useState<WizardState>({ ...BLANK_WIZARD, mode: defaultMode ?? null });
  const [aiOrdering, setAiOrdering] = useState(false);

  const update = (patch: Partial<WizardState>) => setState(prev => ({ ...prev, ...patch }));

  const STEPS = ["Mode", "Type", "Subject & Topic", "Question", "Review"];
  const canNext = [
    !!state.mode,
    !!state.type,
    !!state.subject && !!state.topic,
    !!state.text && state.options.some(o => o.isCorrect) && state.options.filter(o => o.text).length >= 2,
    true,
  ];

  const handleSave = () => {
    onSave({
      mode:        state.mode!,
      type:        state.type!,
      subject:     state.subject!,
      topic:       state.topic,
      text:        state.text,
      options:     state.options,
      explanation: state.explanation,
      difficulty:  state.difficulty,
      bloom:       state.bloom,
      year:        state.year ? Number(state.year) : undefined,
      timeLimit:   state.timeLimit,
      answer:      state.options.find(o => o.isCorrect)?.id ?? "a",
      status:      "draft",
    });
    onClose();
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "var(--app-text-secondary)", backdropFilter: "blur(8px)", zIndex: 300 }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 301, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
          style={{ background: "var(--app-bg)", borderRadius: 26, width: "100%", maxWidth: 700, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.22)" }}>

          {/* Wizard header */}
          <div style={{ padding: "22px 28px 0", background: "var(--app-card)", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--app-text-primary)", letterSpacing: "-0.02em" }}>New Question</h2>
                <p style={{ fontSize: "12.5px", color: "var(--app-text-secondary)", marginTop: 2 }}>Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
              </div>
              <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid var(--app-border)", background: "var(--app-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={15} /></button>
            </div>

            {/* Step bar */}
            <div style={{ display: "flex", gap: 4, marginBottom: 0, paddingBottom: 16, borderBottom: "1px solid var(--app-border)" }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ flex: 1, cursor: i < step ? "pointer" : "default" }} onClick={() => i < step && setStep(i)}>
                  <div style={{ height: 3, borderRadius: 99, background: i <= step ? "#FF6B00" : "var(--app-border)", transition: "background 0.25s" }} />
                  <p style={{ fontSize: "10px", fontWeight: 600, color: i === step ? "#FF6B00" : i < step ? "var(--app-text-primary)" : "var(--app-border)", marginTop: 6 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)", marginBottom: 16 }}>Which exam format is this question for?</p>
                  <div style={{ display: "flex", gap: 14 }}>
                    {(["JAMB", "WAEC"] as QMode[]).map(m => (
                      <button key={m} onClick={() => update({ mode: m })}
                        style={{ flex: 1, padding: "24px 20px", borderRadius: 18, border: `2px solid ${state.mode === m ? (m === "JAMB" ? "#2563EB" : "#16A34A") : "var(--app-border)"}`, background: state.mode === m ? (m === "JAMB" ? "rgba(37,99,235,0.06)" : "rgba(22,163,74,0.06)") : "var(--app-card)", cursor: "pointer", textAlign: "left", transition: "all 0.18s" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: m === "JAMB" ? "rgba(37,99,235,0.1)" : "rgba(22,163,74,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                          {m === "JAMB" ? <Monitor size={20} style={{ color: "#2563EB" }} /> : <FileText size={20} style={{ color: "#16A34A" }} />}
                        </div>
                        <p style={{ fontSize: "18px", fontWeight: 800, color: "var(--app-text-primary)", marginBottom: 6, letterSpacing: "-0.02em" }}>{m}</p>
                        <p style={{ fontSize: "12.5px", color: "var(--app-text-secondary)", lineHeight: 1.55 }}>
                          {m === "JAMB" ? "Computer-based test. MCQ format with countdown timer. Used for UTME admission." : "Pen & paper exam. Supports MCQ, theory, and essay formats."}
                        </p>
                        {m === "WAEC" && <p style={{ fontSize: "11px", color: "#16A34A", fontWeight: 600, marginTop: 8 }}>Includes WAEC, NECO, GCE</p>}
                      </button>
                    ))}
                  </div>

                  {onImport && (
                    <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--app-border)" }}>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Or add questions in bulk</p>
                      <button onClick={() => { onImport(state.mode || "JAMB"); onClose(); }}
                        style={{ width: "100%", padding: "16px 20px", borderRadius: 14, border: "2px solid rgba(37,99,235,0.2)", background: "rgba(37,99,235,0.04)", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "all 0.15s" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Upload size={18} style={{ color: "#2563EB" }} />
                        </div>
                        <div style={{ textAlign: "left", flex: 1 }}>
                          <p style={{ fontSize: "14px", fontWeight: 750, color: "#2563EB" }}>Import from File</p>
                          <p style={{ fontSize: "12px", color: "rgba(37,99,235,0.7)", lineHeight: 1.4, marginTop: 2 }}>Upload a CSV or text file. AI will automatically sort topics, years, and frequency.</p>
                        </div>
                        <ChevronRight size={16} style={{ color: "#2563EB" }} />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)", marginBottom: 16 }}>What type of question is this?</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {QTYPE_OPTIONS.filter(t => t.modes.includes(state.mode!)).map(t => (
                      <button key={t.type} onClick={() => update({ type: t.type })}
                        style={{ padding: "16px 18px", borderRadius: 14, border: `2px solid ${state.type === t.type ? t.color : "var(--app-border-glow)"}`, background: state.type === t.type ? t.bg : "var(--app-card)", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14, transition: "all 0.15s" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 11, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <t.icon size={18} style={{ color: t.color }} />
                        </div>
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)" }}>{t.label}</p>
                          <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", lineHeight: 1.4, marginTop: 2 }}>{t.desc}</p>
                        </div>
                        {state.type === t.type && <Check size={16} style={{ color: t.color, marginLeft: "auto", flexShrink: 0 }} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)", marginBottom: 16 }}>Choose the subject and topic</p>
                  {/* Subject grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
                    {SUBJECTS.map(s => {
                      const SubIcon = s.icon;
                      return (
                        <button key={s.id} onClick={() => update({ subject: s.id, topic: "" })}
                          style={{ padding: "14px 12px", borderRadius: 12, border: `2px solid ${state.subject === s.id ? s.color : "var(--app-border-glow)"}`, background: state.subject === s.id ? s.bg : "var(--app-card)", cursor: "pointer", textAlign: "center", transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                          <SubIcon size={18} style={{ color: state.subject === s.id ? s.color : "var(--app-text-secondary)" }} />
                          <p style={{ fontSize: "12px", fontWeight: state.subject === s.id ? 700 : 500, color: state.subject === s.id ? s.color : "var(--app-text-primary)" }}>{s.label}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Topic picker */}
                  {state.subject && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--app-text-primary)" }}>Topic</p>
                        <button onClick={() => { setAiOrdering(true); setTimeout(() => setAiOrdering(false), 1500); }}
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 8, border: "1.5px solid rgba(147,51,234,0.2)", background: "rgba(147,51,234,0.04)", color: "#9333EA", fontSize: "11.5px", fontWeight: 700, cursor: "pointer" }}>
                          {aiOrdering ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}><RefreshCw size={11} /></motion.div> Ordering…</> : <><Sparkles size={11} /> AI Order</>}
                        </button>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {(DEFAULT_TOPIC_ORDERS[state.mode!]?.[state.subject] ?? []).map(t => (
                          <button key={t} onClick={() => update({ topic: t })}
                            style={{ padding: "7px 13px", borderRadius: 99, border: `1.5px solid ${state.topic === t ? "#FF6B00" : "var(--app-border)"}`, background: state.topic === t ? "rgba(255,107,0,0.07)" : "var(--app-card)", color: state.topic === t ? "#FF6B00" : "var(--app-text-secondary)", fontSize: "12.5px", fontWeight: state.topic === t ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                            {t}
                          </button>
                        ))}
                      </div>
                      {/* Custom topic */}
                      <div style={{ marginTop: 12 }}>
                        <input value={state.topic} onChange={e => update({ topic: e.target.value })}
                          placeholder="Or type a custom topic…"
                          style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--app-border)", borderRadius: 11, fontSize: "13.5px", color: "var(--app-text-primary)", fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: "var(--app-card)" }} />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {/* Question text */}
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 7 }}>Question Text</label>
                    <textarea value={state.text} onChange={e => update({ text: e.target.value })}
                      placeholder="Type your question here…"
                      style={{ width: "100%", minHeight: 100, padding: "12px 14px", border: "1.5px solid var(--app-border)", borderRadius: 12, fontSize: "14px", fontFamily: "inherit", lineHeight: 1.6, resize: "none", outline: "none", color: "var(--app-text-primary)", boxSizing: "border-box", background: "var(--app-card)" }} />
                  </div>

                  {/* Options (for MCQ / TF) */}
                  {(state.type === "mcq" || state.type === "true_false") && (
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
                        Answer Options <span style={{ color: "var(--app-text-secondary)", fontWeight: 500, textTransform: "none" }}>(click circle to mark correct)</span>
                      </label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {(state.type === "true_false"
                          ? state.options.slice(0, 2).map((o, i) => ({ ...o, text: i === 0 ? "True" : "False" }))
                          : state.options
                        ).map((opt, i) => (
                          <div key={opt.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button onClick={() => update({ options: state.options.map(o => ({ ...o, isCorrect: o.id === opt.id })) })}
                              style={{ width: 24, height: 24, borderRadius: "50%", border: `2.5px solid ${opt.isCorrect ? "#16A34A" : "var(--app-border)"}`, background: opt.isCorrect ? "#16A34A" : "transparent", flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                              {opt.isCorrect && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--app-card)" }} />}
                            </button>
                            <div style={{ width: 22, height: 22, borderRadius: 6, background: opt.isCorrect ? "rgba(22,163,74,0.12)" : "var(--app-border-glow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <span style={{ fontSize: "11px", fontWeight: 800, color: opt.isCorrect ? "#16A34A" : "var(--app-text-secondary)" }}>{["A","B","C","D"][i]}</span>
                            </div>
                            <input value={opt.text} onChange={e => update({ options: state.options.map(o => o.id === opt.id ? { ...o, text: e.target.value } : o) })}
                              disabled={state.type === "true_false"}
                              placeholder={`Option ${["A","B","C","D"][i]}`}
                              style={{ flex: 1, padding: "9px 12px", border: `1.5px solid ${opt.isCorrect ? "rgba(22,163,74,0.35)" : "var(--app-border)"}`, borderRadius: 10, fontSize: "13.5px", fontFamily: "inherit", outline: "none", background: opt.isCorrect ? "rgba(22,163,74,0.04)" : "var(--app-card)", color: "var(--app-text-primary)", transition: "all 0.15s" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 7 }}>Explanation / Rationale</label>
                    <textarea value={state.explanation} onChange={e => update({ explanation: e.target.value })}
                      placeholder="Explain why the correct answer is right, and what makes the distractors wrong…"
                      style={{ width: "100%", minHeight: 80, padding: "10px 14px", border: "1.5px solid var(--app-border)", borderRadius: 12, fontSize: "13.5px", fontFamily: "inherit", lineHeight: 1.6, resize: "none", outline: "none", color: "var(--app-text-primary)", boxSizing: "border-box", background: "var(--app-card)" }} />
                  </div>

                  {/* Metadata row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>Difficulty</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {(["easy", "medium", "hard"] as Difficulty[]).map(d => (
                          <button key={d} onClick={() => update({ difficulty: d })}
                            style={{ padding: "6px 0", borderRadius: 8, border: `1.5px solid ${state.difficulty === d ? DIFF_COLOR[d] : "var(--app-border-glow)"}`, background: state.difficulty === d ? DIFF_BG[d] : "var(--app-card)", color: state.difficulty === d ? DIFF_COLOR[d] : "var(--app-text-secondary)", fontSize: "11px", fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{d}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>Bloom's Level</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {(Object.keys(BLOOM_LABELS) as BloomLevel[]).map(b => (
                          <button key={b} onClick={() => update({ bloom: b })}
                            style={{ padding: "5px 9px", borderRadius: 99, border: `1.5px solid ${state.bloom === b ? BLOOM_COLORS[b] : "var(--app-border-glow)"}`, background: state.bloom === b ? `${BLOOM_COLORS[b]}18` : "var(--app-card)", color: state.bloom === b ? BLOOM_COLORS[b] : "var(--app-text-secondary)", fontSize: "10.5px", fontWeight: 650, cursor: "pointer" }}>
                            {BLOOM_LABELS[b]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>Year (Optional)</label>
                      <input value={state.year} onChange={e => update({ year: e.target.value })}
                        placeholder="2024"
                        style={{ width: "100%", padding: "7px 10px", border: "1.5px solid var(--app-border)", borderRadius: 9, fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "var(--app-card)", color: "var(--app-text-primary)" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)", marginBottom: 18 }}>Review before saving</p>
                  <div style={{ background: "var(--app-card)", borderRadius: 16, border: "1px solid var(--app-border)", overflow: "hidden" }}>
                    {/* Header */}
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--app-border)", display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: state.mode === "JAMB" ? "rgba(37,99,235,0.09)" : "rgba(22,163,74,0.09)", color: state.mode === "JAMB" ? "#2563EB" : "#16A34A" }}>{state.mode}</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: DIFF_BG[state.difficulty], color: DIFF_COLOR[state.difficulty] }}>{state.difficulty}</span>
                      <span style={{ fontSize: "11px", fontWeight: 650, padding: "3px 10px", borderRadius: 99, background: `${BLOOM_COLORS[state.bloom]}15`, color: BLOOM_COLORS[state.bloom] }}>{BLOOM_LABELS[state.bloom]}</span>
                      {state.year && <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: 99, background: "var(--app-border-glow)", color: "var(--app-text-secondary)", fontWeight: 600 }}>{state.year}</span>}
                    </div>
                    {/* Subject + topic */}
                    <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--app-border)", display: "flex", gap: 8 }}>
                      <span style={{ fontSize: "12px", color: "var(--app-text-secondary)" }}>
                        {SUBJECTS.find(s => s.id === state.subject)?.label} → {state.topic}
                      </span>
                    </div>
                    {/* Question */}
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--app-border)" }}>
                      <p style={{ fontSize: "15px", color: "var(--app-text-primary)", lineHeight: 1.65, fontWeight: 450 }}>{state.text || <em style={{ color: "var(--app-text-secondary)" }}>No question text</em>}</p>
                    </div>
                    {/* Options */}
                    {(state.type === "mcq" || state.type === "true_false") && (
                      <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--app-border)" }}>
                        {state.options.filter(o => o.text || state.type === "true_false").map((o, i) => (
                          <div key={o.id} style={{ padding: "6px 0", display: "flex", gap: 8, alignItems: "center" }}>
                            <div style={{ width: 20, height: 20, borderRadius: 6, background: o.isCorrect ? "rgba(22,163,74,0.15)" : "var(--app-border-glow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: "10px", fontWeight: 800, color: o.isCorrect ? "#16A34A" : "var(--app-text-secondary)" }}>{["A","B","C","D"][i]}</span>
                            </div>
                            <p style={{ fontSize: "13px", color: o.isCorrect ? "#16A34A" : "var(--app-text-secondary)", fontWeight: o.isCorrect ? 650 : 400 }}>
                              {state.type === "true_false" ? (i === 0 ? "True" : "False") : o.text}
                              {o.isCorrect && " ✓"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Explanation */}
                    {state.explanation && (
                      <div style={{ padding: "12px 20px" }}>
                        <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Explanation</p>
                        <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", lineHeight: 1.6 }}>{state.explanation}</p>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(255,107,0,0.05)", borderRadius: 12, border: "1px solid rgba(255,107,0,0.15)" }}>
                    <p style={{ fontSize: "12px", color: "#FF6B00", fontWeight: 600 }}>Question will be saved as a <strong>draft</strong>. You can publish it from the Studio after review.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer navigation */}
          <div style={{ padding: "16px 28px", borderTop: "1px solid var(--app-border)", background: "var(--app-card)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <button onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}
              style={{ padding: "10px 20px", border: "1.5px solid var(--app-border)", borderRadius: 11, background: "var(--app-card)", cursor: "pointer", fontSize: "13.5px", fontWeight: 600, color: "var(--app-text-secondary)" }}>
              {step === 0 ? "Cancel" : "← Back"}
            </button>
            <div style={{ display: "flex", gap: 4 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{ width: i === step ? 18 : 6, height: 6, borderRadius: 99, background: i === step ? "#FF6B00" : i < step ? "var(--app-text-primary)" : "var(--app-border)", transition: "all 0.2s" }} />
              ))}
            </div>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext[step]}
                style={{ padding: "10px 24px", border: "none", borderRadius: 11, background: canNext[step] ? "#FF6B00" : "var(--app-border-glow)", color: canNext[step] ? "var(--app-card)" : "var(--app-border)", cursor: canNext[step] ? "pointer" : "not-allowed", fontSize: "13.5px", fontWeight: 700, boxShadow: canNext[step] ? "0 4px 14px rgba(255,107,0,0.3)" : "none", transition: "all 0.2s" }}>
                Next →
              </button>
            ) : (
              <button onClick={handleSave}
                style={{ padding: "10px 24px", border: "none", borderRadius: 11, background: "var(--app-text-primary)", color: "var(--app-card)", cursor: "pointer", fontSize: "13.5px", fontWeight: 750 }}>
                Save Question ✓
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GROUPED LIBRARY PANE (replaces flat list)
═══════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════
   GROUPED LIBRARY PANE (Subject -> Topic -> Year -> Questions)
═══════════════════════════════════════════════════════════════════ */
function GroupedLibrary({
  questions, selected, onSelect, onStar, onDelete,
  dragId, dragOver, onDragStart, onDragEnd, onDrop, onDragOver, onDragLeave,
  topicOrders, setTopicOrders, mode,
}: {
  questions: Question[]; selected: string | null; onSelect: (id: string) => void;
  onStar: (id: string) => void; onDelete: (id: string) => void;
  dragId: string | null; dragOver: string | null;
  onDragStart: (id: string) => void; onDragEnd: () => void;
  onDrop: (id: string) => void; onDragOver: (id: string) => void; onDragLeave: () => void;
  topicOrders: TopicOrder; setTopicOrders: (orders: TopicOrder) => void;
  mode: QMode;
}) {
  const [aiSorting, setAiSorting] = useState<string | null>(null);
  
  // State for expanded/collapsed sections (by IDs like "subj-math", "topic-math-algebra")
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["subj-math"]));

  const toggleExpand = (id: string) => setExpanded(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  // Group by Subject -> Topic -> Year
  const grouped = SUBJECTS.map(subj => {
    const subjQs = questions.filter(q => q.subject === subj.id);
    if (subjQs.length === 0) return null;

    const topicOrder = topicOrders[subj.id] ?? [];
    const allTopics = [...new Set(subjQs.map(q => q.topic))];
    const orderedTopics = [
      ...topicOrder.filter(t => allTopics.includes(t)),
      ...allTopics.filter(t => !topicOrder.includes(t)),
    ];

    const byTopic = orderedTopics.map(topic => {
      const topicQs = subjQs.filter(q => q.topic === topic);
      // Group by year
      const years = [...new Set(topicQs.map(q => q.year ?? "Unknown"))].sort((a, b) => b > a ? 1 : -1);
      
      const byYear = years.map(year => ({
        year,
        questions: topicQs.filter(q => (q.year ?? "Unknown") === year),
      }));

      return { topic, byYear, total: topicQs.length };
    });

    return { subj, byTopic, total: subjQs.length };
  }).filter(Boolean) as { subj: typeof SUBJECTS[0]; byTopic: any[]; total: number }[];

  const handleAISort = (subjId: string) => {
    setAiSorting(subjId);
    setTimeout(() => {
      const subjQs = questions.filter(q => q.subject === subjId);
      const topics = [...new Set(subjQs.map(q => q.topic))];
      const sorted = topics.sort((a, b) => subjQs.filter(q => q.topic === b).length - subjQs.filter(q => q.topic === a).length);
      setTopicOrders({ ...topicOrders, [subjId]: sorted });
      setAiSorting(null);
    }, 1200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {grouped.map(({ subj, byTopic, total }) => {
        const SubIcon = subj.icon;
        const subjId = `subj-${subj.id}`;
        const subjExpanded = expanded.has(subjId);
        
        return (
          <div key={subj.id} style={{ marginBottom: 4 }}>
            {/* Level 1: Subject */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 6px", cursor: "pointer", borderRadius: 8, background: subjExpanded ? "var(--app-border-glow)" : "transparent" }} onClick={() => toggleExpand(subjId)}>
              <ChevronRight size={12} style={{ color: "var(--app-text-secondary)", transform: subjExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
              <div style={{ width: 22, height: 22, borderRadius: 7, background: subj.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <SubIcon size={12} style={{ color: subj.color }} />
              </div>
              <p style={{ fontSize: "12px", fontWeight: 750, color: "var(--app-text-primary)", flex: 1 }}>{subj.label}</p>
              <span style={{ fontSize: "10.5px", color: "var(--app-text-secondary)", fontWeight: 650 }}>{total}</span>
              <button onClick={e => { e.stopPropagation(); handleAISort(subj.id); }}
                style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 7px", borderRadius: 6, border: "1px solid rgba(147,51,234,0.2)", background: "transparent", color: "#9333EA", fontSize: "10px", fontWeight: 700, cursor: "pointer", marginLeft: 4 }}>
                {aiSorting === subj.id ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}><RefreshCw size={9} /></motion.div> : <Sparkles size={9} />} AI
              </button>
            </div>

            <AnimatePresence>
              {subjExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                  <div style={{ display: "flex", flexDirection: "column", paddingLeft: 18, borderLeft: "1px solid var(--app-border-glow)", marginLeft: 11, marginTop: 4 }}>
                    
                    {/* Level 2: Topic */}
                    {byTopic.map(({ topic, byYear, total: topicTotal }) => {
                      const topicId = `topic-${subj.id}-${topic}`;
                      const topicExpanded = expanded.has(topicId);

                      return (
                        <div key={topic} style={{ marginBottom: 4 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", cursor: "pointer", borderRadius: 6, background: topicExpanded ? "var(--app-border-glow)" : "transparent" }} onClick={() => toggleExpand(topicId)}>
                            <ChevronRight size={11} style={{ color: "var(--app-text-secondary)", transform: topicExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                            <Folder size={12} style={{ color: "var(--app-text-secondary)" }} />
                            <p style={{ fontSize: "11.5px", fontWeight: 650, color: "var(--app-text-primary)", flex: 1, letterSpacing: "-0.01em" }}>{topic}</p>
                            <span style={{ fontSize: "10px", color: "var(--app-text-secondary)", fontWeight: 600 }}>{topicTotal}</span>
                          </div>

                          <AnimatePresence>
                            {topicExpanded && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                                <div style={{ display: "flex", flexDirection: "column", paddingLeft: 16, borderLeft: "1px solid var(--app-border-glow)", marginLeft: 11, marginTop: 2 }}>
                                  
                                  {/* Level 3: Year */}
                                  {byYear.map(({ year, questions: yearQs }: any) => {
                                    const yearId = `year-${subj.id}-${topic}-${year}`;
                                    const yearExpanded = expanded.has(yearId);

                                    return (
                                      <div key={year} style={{ marginBottom: 2 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", cursor: "pointer", borderRadius: 6 }} onClick={() => toggleExpand(yearId)}>
                                          <ChevronRight size={10} style={{ color: "var(--app-border)", transform: yearExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                                          <Clock size={11} style={{ color: "#2563EB" }} />
                                          <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--app-text-secondary)", flex: 1 }}>{year}</p>
                                          <span style={{ fontSize: "9.5px", color: "var(--app-text-secondary)", fontWeight: 600 }}>{yearQs.length}</span>
                                        </div>

                                        {/* Level 4: Questions (Compact) */}
                                        <AnimatePresence>
                                          {yearExpanded && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                                              <div style={{ display: "flex", flexDirection: "column", paddingLeft: 16, marginTop: 2, marginBottom: 6 }}>
                                                {yearQs.map((q: Question) => (
                                                  <div key={q.id}
                                                    draggable
                                                    onDragStart={() => onDragStart(q.id)}
                                                    onDragOver={e => { e.preventDefault(); onDragOver(q.id); }}
                                                    onDragLeave={onDragLeave}
                                                    onDrop={() => onDrop(q.id)}
                                                    onDragEnd={onDragEnd}
                                                    onClick={() => onSelect(q.id)}
                                                    style={{ 
                                                      display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", cursor: "pointer", borderRadius: 6,
                                                      background: selected === q.id ? "rgba(255,107,0,0.08)" : "transparent",
                                                      borderTop: dragOver === q.id && dragId !== q.id ? `2px solid ${subj.color}` : "2px solid transparent",
                                                      opacity: dragId === q.id ? 0.4 : 1,
                                                    }}>
                                                    
                                                    {/* Status dot */}
                                                    <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: q.status === "flagged" ? "#DC2626" : q.status === "draft" ? "#94A3B8" : "#16A34A" }} />
                                                    
                                                    <p style={{ fontSize: "11.5px", color: selected === q.id ? "var(--app-text-primary)" : "var(--app-text-secondary)", fontWeight: selected === q.id ? 650 : 450, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
                                                      {q.text}
                                                    </p>
                                                    
                                                    {q.frequency && (
                                                      <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "1px 4px", borderRadius: 4, background: "var(--app-border-glow)" }}>
                                                        <Activity size={9} style={{ color: "var(--app-text-secondary)" }} />
                                                        <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--app-text-secondary)" }}>{q.frequency}x</span>
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   QUESTIONS WORKSPACE — MAIN
═══════════════════════════════════════════════════════════════════ */
export default function QuestionsWorkspace() {
  const [viewState, setViewState] = useState<"landing" | "workspace">("landing");
  const [mode, setMode]           = useState<QMode>("JAMB");
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);
  const [topicOrders, setTopicOrders] = useState<TopicOrder>(DEFAULT_TOPIC_ORDERS.JAMB);
  
  const [selected, setSelected]   = useState<string | null>(null);
  const [search, setSearch]       = useState("");
  
  // Basic Filters
  const [filterSubject, setFilterSubject] = useState<string | null>(null);
  const [filterDiff, setFilterDiff]       = useState<Difficulty | null>(null);
  const [filterStatus, setFilterStatus]   = useState<QStatus | null>(null);
  
  // Advanced Filters
  const [filterYearMin, setFilterYearMin] = useState<string>("");
  const [filterYearMax, setFilterYearMax] = useState<string>("");
  const [filterFreqMin, setFilterFreqMin] = useState<string>("");
  
  const [viewMode, setViewMode]   = useState<"list" | "grid">("list");
  
  const [showImport, setShowImport] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showMutator, setShowMutator] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [rightOpen, setRightOpen] = useState(true);
  
  const [dragId, setDragId]       = useState<string | null>(null);
  const [dragOver, setDragOver]   = useState<string | null>(null);

  const selectedQ = questions.find(q => q.id === selected) ?? null;

  // Filter
  const filtered = questions.filter(q => {
    if (q.mode !== mode) return false;
    if (search && !q.text.toLowerCase().includes(search.toLowerCase()) && !q.subject.includes(search.toLowerCase())) return false;
    if (filterSubject && q.subject !== filterSubject) return false;
    if (filterDiff && q.difficulty !== filterDiff) return false;
    if (filterStatus && q.status !== filterStatus) return false;
    
    // Advanced filters
    if (filterYearMin && q.year && q.year < parseInt(filterYearMin)) return false;
    if (filterYearMax && q.year && q.year > parseInt(filterYearMax)) return false;
    if (filterFreqMin && q.frequency && q.frequency < parseInt(filterFreqMin)) return false;
    
    return true;
  });

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    if (selected === id) setSelected(null);
  };

  const handleImport = (qs: Partial<Question>[]) => {
    const newQs = qs.map((q, i) => ({
      ...makeQuestion(`imported_${Date.now()}_${i}`, mode, q.subject ?? "math"),
      ...q,
    }));
    setQuestions(prev => [...prev, ...newQs]);
  };

  const handleCreate = (q: Partial<Question>) => {
    const newQ = {
      ...makeQuestion(`created_${Date.now()}`, q.mode || mode, q.subject || "math"),
      ...q,
    };
    setQuestions(prev => [...prev, newQ]);
    if (viewState === "workspace" && q.mode === mode) {
      setSelected(newQ.id);
    } else {
      setMode(q.mode || mode);
      setSelected(newQ.id);
      setViewState("workspace");
    }
  };

  // Drag reorder
  const handleDragStart = (id: string) => setDragId(id);
  const handleDragEnd   = () => { setDragId(null); setDragOver(null); };
  const handleDrop      = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setQuestions(prev => {
      const arr = [...prev];
      const from = arr.findIndex(q => q.id === dragId);
      const to   = arr.findIndex(q => q.id === targetId);
      const [item] = arr.splice(from, 1);
      
      const targetQ = arr[to];
      if (item.subject !== targetQ.subject || item.topic !== targetQ.topic || item.year !== targetQ.year) {
        item.subject = targetQ.subject;
        item.topic = targetQ.topic;
        item.year = targetQ.year;
      }
      
      arr.splice(to, 0, item);
      return arr;
    });
    setDragId(null); setDragOver(null);
  };

  const modeQs = questions.filter(q => q.mode === mode);
  const easyCount   = modeQs.filter(q => q.difficulty === "easy").length;
  const medCount    = modeQs.filter(q => q.difficulty === "medium").length;
  const hardCount   = modeQs.filter(q => q.difficulty === "hard").length;
  const avgPass     = modeQs.length ? Math.round(modeQs.reduce((a, q) => a + (q.passRate ?? 0), 0) / modeQs.length) : 0;

  if (viewState === "landing") {
    return (
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <AnimatePresence>
          {showImport && <ImportPipelineModal mode={mode} onClose={() => setShowImport(false)} onImport={handleImport} />}
          {showCreate && <CreateQuestionWizard defaultMode={mode} onClose={() => setShowCreate(false)} onSave={handleCreate} onImport={(m) => { setMode(m); setShowCreate(false); setShowImport(true); }} />}
        </AnimatePresence>
        <QuestionsLandingPage 
          questions={questions}
          onEnterWorkspace={(m, subjectId) => {
            setMode(m);
            setTopicOrders(DEFAULT_TOPIC_ORDERS[m]);
            setFilterSubject(subjectId ?? null);
            setViewState("workspace");
          }}
          onCreateNew={() => setShowCreate(true)}
          onImport={(m) => { setMode(m); setShowImport(true); }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "var(--font-sans)", background: "var(--app-bg)" }}>
      <AnimatePresence>
        {showImport   && <ImportPipelineModal mode={mode} onClose={() => setShowImport(false)} onImport={handleImport} />}
        {showCreate   && <CreateQuestionWizard defaultMode={mode} onClose={() => setShowCreate(false)} onSave={handleCreate} onImport={(m) => { setMode(m); setShowCreate(false); setShowImport(true); }} />}
        {showMatrix   && <MatrixModal onClose={() => setShowMatrix(false)} />}
        {showMutator  && selectedQ && <AIVariationPanel q={selectedQ} onClose={() => setShowMutator(false)} />}
        {showSimulator && selectedQ && <CBTSimulator q={selectedQ} mode={mode} onClose={() => setShowSimulator(false)} />}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════
         LEFT: SIDEBAR EXPLORER (Nested Tree)
      ══════════════════════════════════════════ */}
      <div style={{ width: 340, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: "1px solid var(--app-border)", background: "var(--app-card)", overflow: "hidden" }}>
        
        {/* Header & Mode Switch */}
        <div style={{ padding: "14px 14px 10px", flexShrink: 0, borderBottom: "1px solid var(--app-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <button onClick={() => setViewState("landing")}
              style={{ padding: "6px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={14} style={{ transform: "rotate(180deg)" }} />
            </button>
            <h2 style={{ fontSize: "15px", fontWeight: 800, color: "var(--app-text-primary)" }}>Studio Library</h2>
          </div>
          <div style={{ display: "flex", background: "var(--app-border-glow)", borderRadius: 10, padding: 3 }}>
            {(["JAMB", "WAEC"] as QMode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); setTopicOrders(DEFAULT_TOPIC_ORDERS[m]); setSelected(null); }}
                style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: "12.5px", fontWeight: mode === m ? 750 : 500, background: mode === m ? "var(--app-card)" : "transparent", boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.06)" : "none", color: mode === m ? "var(--app-text-primary)" : "var(--app-text-secondary)", transition: "all 0.15s" }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div style={{ padding: "10px 14px", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, padding: "0 10px", border: "1.5px solid var(--app-border)", borderRadius: 9, background: "var(--app-bg)" }}>
              <Search size={12} style={{ color: "var(--app-text-secondary)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..." style={{ flex: 1, border: "none", outline: "none", fontSize: "12.5px", color: "var(--app-text-primary)", padding: "7px 0", background: "transparent", fontFamily: "inherit" }} />
            </div>
            <button onClick={() => setShowFilters(v => !v)}
              style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${showFilters ? "rgba(37,99,235,0.3)" : "var(--app-border)"}`, background: showFilters ? "rgba(37,99,235,0.05)" : "var(--app-card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <SlidersHorizontal size={13} style={{ color: showFilters ? "#2563EB" : "var(--app-text-secondary)" }} />
            </button>
          </div>

          {/* Advanced Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                <div style={{ padding: "8px 10px 12px", background: "rgba(37,99,235,0.03)", borderRadius: 10, border: "1px solid rgba(37,99,235,0.1)", display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                  {/* Years */}
                  <div>
                    <label style={{ fontSize: "10px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 }}>Year Range</label>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input value={filterYearMin} onChange={e => setFilterYearMin(e.target.value)} placeholder="1999" style={{ flex: 1, width: "100%", padding: "5px 8px", border: "1px solid var(--app-border)", borderRadius: 6, fontSize: "12px" }} />
                      <span style={{ fontSize: "11px", color: "var(--app-text-secondary)", fontWeight: 700 }}>TO</span>
                      <input value={filterYearMax} onChange={e => setFilterYearMax(e.target.value)} placeholder="2005" style={{ flex: 1, width: "100%", padding: "5px 8px", border: "1px solid var(--app-border)", borderRadius: 6, fontSize: "12px" }} />
                    </div>
                  </div>
                  {/* Frequency */}
                  <div>
                    <label style={{ fontSize: "10px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 }}>Minimum Frequency</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", border: "1px solid var(--app-border)", borderRadius: 6, background: "var(--app-card)" }}>
                      <Activity size={12} style={{ color: "var(--app-text-secondary)" }} />
                      <input value={filterFreqMin} onChange={e => setFilterFreqMin(e.target.value)} placeholder="e.g. 3" style={{ flex: 1, border: "none", outline: "none", fontSize: "12px" }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nested Tree Explorer */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 14px", borderTop: "1px solid var(--app-border)" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 30, textAlign: "center" }}>
              <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 500 }}>No questions found.</p>
            </div>
          ) : (
            <GroupedLibrary
              questions={filtered}
              selected={selected}
              onSelect={id => setSelected(id === selected ? null : id)}
              onStar={id => updateQuestion(id, { isStar: !questions.find(q => q.id === id)?.isStar })}
              onDelete={deleteQuestion}
              dragId={dragId}
              dragOver={dragOver}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onDragOver={setDragOver}
              onDragLeave={() => setDragOver(null)}
              topicOrders={topicOrders}
              setTopicOrders={setTopicOrders}
              mode={mode}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ padding: "10px", borderTop: "1px solid var(--app-border)", flexShrink: 0, display: "flex", gap: 6, background: "var(--app-card)" }}>
          <button onClick={() => setShowCreate(true)}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "10px", border: "none", borderRadius: 9, background: "var(--app-text-primary)", color: "var(--app-card)", fontSize: "13px", fontWeight: 750, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <Plus size={14} /> New Question
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
         CENTER + RIGHT (Canvas & Inspector)
      ══════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        <div style={{ height: 50, borderBottom: "1px solid var(--app-border)", background: "var(--app-card)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <p style={{ fontSize: "13.5px", fontWeight: 750, color: "var(--app-text-primary)", letterSpacing: "-0.015em" }}>Studio Canvas</p>
            <div style={{ padding: "2px 8px", borderRadius: 99, background: mode === "JAMB" ? "rgba(37,99,235,0.08)" : "rgba(22,163,74,0.08)", fontSize: "10.5px", fontWeight: 700, color: mode === "JAMB" ? "#2563EB" : "#16A34A" }}>{mode}</div>
            <div style={{ height: 14, width: 1, background: "var(--app-border)" }} />
            <p style={{ fontSize: "11.5px", color: "var(--app-text-secondary)", fontWeight: 500 }}>{filtered.length} questions visible</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => setShowMatrix(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-card)", cursor: "pointer", fontSize: "12px", fontWeight: 650, color: "var(--app-text-primary)" }}>
              <BarChart2 size={12} /> Matrix
            </button>
            <button
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-card)", cursor: "pointer", fontSize: "12px", fontWeight: 650, color: "var(--app-text-primary)" }}>
              <Download size={12} /> Export
            </button>
            <button onClick={() => setRightOpen(v => !v)}
              style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid var(--app-border)", background: rightOpen ? "rgba(255,107,0,0.05)" : "var(--app-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {rightOpen ? <PanelRight size={13} style={{ color: "#FF6B00" }} /> : <PanelLeft size={13} style={{ color: "var(--app-text-secondary)" }} />}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Center Canvas */}
          <div style={{ flex: 1, overflowY: "auto", padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
            {!selected ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
                <div style={{ padding: "24px", background: "var(--app-card)", borderRadius: 18, border: "1px solid var(--app-border)", textAlign: "center", maxWidth: 400 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "var(--app-border-glow)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Layers size={22} style={{ color: "var(--app-border)" }} />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 750, color: "var(--app-text-primary)", letterSpacing: "-0.015em", marginBottom: 8 }}>Select a question to edit</h3>
                  <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", lineHeight: 1.6 }}>Click any question in the library panel to view it in full size, inspect its properties, or mutate it with AI.</p>
                </div>
              </div>
            ) : selectedQ ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ background: "var(--app-card)", borderRadius: 18, border: "1px solid var(--app-border)", overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--app-border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: DIFF_BG[selectedQ.difficulty], color: DIFF_COLOR[selectedQ.difficulty] }}>{selectedQ.difficulty}</span>
                      <span style={{ fontSize: "11px", fontWeight: 650, padding: "3px 10px", borderRadius: 99, background: `${BLOOM_COLORS[selectedQ.bloom]}15`, color: BLOOM_COLORS[selectedQ.bloom] }}>{BLOOM_LABELS[selectedQ.bloom]}</span>
                      {selectedQ.year && <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: 99, background: "rgba(37,99,235,0.08)", color: "#2563EB", fontWeight: 700 }}>Year {selectedQ.year}</span>}
                      {selectedQ.frequency && <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: 99, background: "rgba(217,119,6,0.08)", color: "#D97706", fontWeight: 700 }}>Freq: {selectedQ.frequency}x</span>}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setShowSimulator(true)}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-card)", cursor: "pointer", fontSize: "11.5px", fontWeight: 650, color: "var(--app-text-primary)" }}>
                        <Play size={11} /> Preview Student
                      </button>
                      <button onClick={() => setShowMutator(true)}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8, border: "1.5px solid rgba(147,51,234,0.25)", background: "rgba(147,51,234,0.05)", cursor: "pointer", fontSize: "11.5px", fontWeight: 700, color: "#9333EA" }}>
                        <Wand2 size={11} /> Mutate
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: "17px", color: "var(--app-text-primary)", lineHeight: 1.7, fontWeight: 450, letterSpacing: "-0.01em" }}>{selectedQ.text}</p>
                </div>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--app-border)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {selectedQ.options.map((opt, i) => (
                      <div key={opt.id} style={{ padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${opt.isCorrect ? "rgba(22,163,74,0.3)" : "var(--app-border-glow)"}`, background: opt.isCorrect ? "rgba(22,163,74,0.04)" : "var(--app-card)", display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 7, background: opt.isCorrect ? "rgba(22,163,74,0.12)" : "var(--app-border-glow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: "11px", fontWeight: 800, color: opt.isCorrect ? "#16A34A" : "var(--app-text-secondary)" }}>{["A","B","C","D"][i]}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: "13px", color: opt.isCorrect ? "#16A34A" : "var(--app-text-primary)", fontWeight: opt.isCorrect ? 650 : 450, lineHeight: 1.4 }}>{opt.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "16px 24px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Explanation</p>
                  <p style={{ fontSize: "13.5px", color: "var(--app-text-secondary)", lineHeight: 1.65 }}>{selectedQ.explanation}</p>
                </div>
              </motion.div>
            ) : null}
          </div>

          <AnimatePresence>
            {rightOpen && (
              <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 300, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                style={{ borderLeft: "1px solid var(--app-border-glow)", overflow: "hidden", flexShrink: 0, display: "flex", flexDirection: "column", background: "var(--app-card)" }}>
                <InspectorPanel
                  q={selectedQ}
                  mode={mode}
                  onUpdate={updates => selected && updateQuestion(selected, updates)}
                  onOpenMutator={() => setShowMutator(true)}
                  onSimulate={() => setShowSimulator(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
