"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, UserPlus, BookOpen,
  Sparkles, GitPullRequest, Layers, ChevronRight, X,
  Activity, ArrowRight, ShieldCheck, Eye,
  Search, Send, MessageSquare, Clock, Check,
  Star, AlertTriangle, CheckCircle2, PenLine, Globe
} from "lucide-react";

/* ─────────────────────────────────────────
   TYPES
─────────────────────────────────────────── */
type TeamTab = "overview" | "directory" | "squads" | "activity" | "permissions";
type InviteStep = 1 | 2 | 3;

interface TeamMember {
  id: string; name: string; role: string; email: string;
  avatar: string; color: string;
  department: "Mathematics" | "Sciences" | "Humanities" | "General";
  status: "active" | "away" | "offline";
  currentTask: string; bio: string;
  stats: { lessonsCreated: number; reviewsDone: number; activeDrafts: number; approvalRate: number; };
  permissions: "Admin" | "Senior Author" | "Reviewer" | "Contributor";
  joinedDate: string;
}

interface ReviewAssignment {
  memberId: string;
  lesson: string;
  deadline: string;
  priority: "low" | "normal" | "urgent";
  note: string;
}

interface DirectMessage {
  memberId: string;
  subject: string;
  body: string;
}

/* ─────────────────────────────────────────
   DATA
─────────────────────────────────────────── */
const TEAM_MEMBERS: TeamMember[] = [
  { id: "m1", name: "Dr. Amara Osei", role: "Head of Curriculum & Content Lead", email: "amara.osei@eridock.edu", avatar: "AO", color: "#FF6B00", department: "Mathematics", status: "active", currentTask: "Editing Quadratic Equations L2", bio: "Ph.D. in Mathematics Education. 12+ years experience building secondary STEM curricula across West Africa.", stats: { lessonsCreated: 42, reviewsDone: 128, activeDrafts: 3, approvalRate: 98 }, permissions: "Admin", joinedDate: "Jan 2024" },
  { id: "m2", name: "Sarah James", role: "Principal Curriculum Architect", email: "sarah.j@eridock.edu", avatar: "SJ", color: "#7C3AED", department: "Sciences", status: "active", currentTask: "Reviewing Physics Assessment #4", bio: "Former WAEC Physics Chief Examiner specializing in interactive simulation design and inquiry-based learning.", stats: { lessonsCreated: 31, reviewsDone: 94, activeDrafts: 2, approvalRate: 96 }, permissions: "Admin", joinedDate: "Mar 2024" },
  { id: "m3", name: "Marcus Vance", role: "Senior STEM Specialist", email: "marcus.v@eridock.edu", avatar: "MV", color: "#2563EB", department: "Sciences", status: "away", currentTask: "Drafting Organic Chemistry Module", bio: "Biochemistry researcher turned educator. Focused on high-engagement visual science content.", stats: { lessonsCreated: 19, reviewsDone: 45, activeDrafts: 5, approvalRate: 91 }, permissions: "Senior Author", joinedDate: "Jun 2024" },
  { id: "m4", name: "Elena Rostova", role: "Humanities & History Lead", email: "elena.r@eridock.edu", avatar: "ER", color: "#16A34A", department: "Humanities", status: "active", currentTask: "Building African History Graph", bio: "Specializing in African history, literature, and social sciences curriculum alignment.", stats: { lessonsCreated: 27, reviewsDone: 62, activeDrafts: 1, approvalRate: 95 }, permissions: "Senior Author", joinedDate: "Feb 2024" },
  { id: "m5", name: "David Chen", role: "Pedagogical Peer Reviewer", email: "david.c@eridock.edu", avatar: "DC", color: "#D97706", department: "General", status: "offline", currentTask: "Offline · Last active 2h ago", bio: "Educational psychologist focusing on cognitive load reduction and formative assessment rubrics.", stats: { lessonsCreated: 14, reviewsDone: 110, activeDrafts: 0, approvalRate: 99 }, permissions: "Reviewer", joinedDate: "Aug 2024" },
  { id: "m6", name: "Kofi Mensah", role: "AI & Assessment Specialist", email: "kofi.m@eridock.edu", avatar: "KM", color: "#EC4899", department: "Mathematics", status: "active", currentTask: "Analyzing AI Simulator Persona Reports", bio: "EdTech engineer and math teacher building student simulator feedback models and automated rubrics.", stats: { lessonsCreated: 22, reviewsDone: 76, activeDrafts: 4, approvalRate: 94 }, permissions: "Senior Author", joinedDate: "Sep 2024" },
];

const SQUADS = [
  { id: "sq1", name: "Mathematics & Logic", desc: "Algebra, Calculus, Trigonometry & Assessment Graphs.", lead: "Dr. Amara Osei", members: [TEAM_MEMBERS[0], TEAM_MEMBERS[5]], lessons: 86, progress: 92, color: "#FF6B00", gradient: "linear-gradient(135deg, #FF6B00, #FF9840)" },
  { id: "sq2", name: "Sciences & Lab Experiments", desc: "Physics simulations, Chemistry reactions, Biology cards.", lead: "Sarah James", members: [TEAM_MEMBERS[1], TEAM_MEMBERS[2]], lessons: 112, progress: 88, color: "#7C3AED", gradient: "linear-gradient(135deg, #7C3AED, #A855F7)" },
  { id: "sq3", name: "Humanities & Social Sciences", desc: "West African History, Literature, Civic Education.", lead: "Elena Rostova", members: [TEAM_MEMBERS[3]], lessons: 54, progress: 78, color: "#16A34A", gradient: "linear-gradient(135deg, #16A34A, #4ADE80)" },
];

const ACTIVITY_LOG = [
  { id: "a1", user: "Dr. Amara Osei", action: "staged", target: "Quadratic Equations — Level 2", time: "12 min ago", avatar: "AO", color: "#FF6B00", type: "stage" },
  { id: "a2", user: "Sarah James", action: "approved review on", target: "Optics & Light Refraction", time: "45 min ago", avatar: "SJ", color: "#7C3AED", type: "review" },
  { id: "a3", user: "Kofi Mensah", action: "ran AI Simulation for", target: "Polynomial Division", time: "2 hr ago", avatar: "KM", color: "#EC4899", type: "ai" },
  { id: "a4", user: "Marcus Vance", action: "created 4 slides in", target: "Chemical Bonding Basics", time: "3 hr ago", avatar: "MV", color: "#2563EB", type: "create" },
  { id: "a5", user: "Elena Rostova", action: "added 12 media assets to", target: "Post-Colonial Africa History", time: "5 hr ago", avatar: "ER", color: "#16A34A", type: "media" },
];

const DRAFT_LESSONS = [
  "Quadratic Equations — Level 2",
  "Optics & Light Refraction",
  "Chemical Bonding Basics",
  "Post-Colonial Africa History",
  "Trigonometric Identities",
  "Organic Chemistry — Module 1",
];

const PERMISSION_ROLES = [
  {
    role: "Admin", desc: "Full control — curriculum structure, staging, publishing, and team management.",
    icon: ShieldCheck, color: "#FF6B00", users: 2,
    can: ["Create & edit all lessons", "Stage & publish content", "Invite & manage team", "Configure AI models"]
  },
  {
    role: "Senior Author", desc: "Creates lessons, runs AI simulations, and stages content for peer review.",
    icon: PenLine, color: "#7C3AED", users: 3,
    can: ["Create & edit their lessons", "Run AI Student Simulations", "Stage for peer review", "Use media library"]
  },
  {
    role: "Reviewer", desc: "Audits and approves lesson drafts. Cannot create or publish content.",
    icon: Eye, color: "#16A34A", users: 1,
    can: ["Review draft lessons", "Leave structured feedback", "Approve or request revisions", "View analytics"]
  },
];

/* ─────────────────────────────────────────
   ILLUSTRATIONS (inline SVG)
─────────────────────────────────────────── */
function IllustrationCollaboration() {
  return (
    <svg viewBox="0 0 520 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", maxHeight: 260 }}>
      <defs>
        <radialGradient id="bg_glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.04" />
        </radialGradient>
        <linearGradient id="card1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--app-card)" />
          <stop offset="100%" stopColor="#FFF7F0" />
        </linearGradient>
        <linearGradient id="card2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--app-card)" />
          <stop offset="100%" stopColor="#F5F3FF" />
        </linearGradient>
        <filter id="card_shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.07" />
        </filter>
      </defs>
      <circle cx="260" cy="170" r="160" fill="url(#bg_glow)" />

      {/* Card 1 — Lesson Card */}
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="40" y="80" width="190" height="140" rx="20" fill="url(#card1)" filter="url(#card_shadow)" stroke="rgba(255,107,0,0.15)" strokeWidth="1.5" />
        <rect x="60" y="105" width="80" height="10" rx="5" fill="#FF6B00" opacity="0.9" />
        <rect x="60" y="126" width="150" height="7" rx="3.5" fill="#E5E7EB" />
        <rect x="60" y="144" width="120" height="7" rx="3.5" fill="#E5E7EB" />
        <rect x="60" y="162" width="135" height="7" rx="3.5" fill="#F3F4F6" />
        <circle cx="175" cy="195" r="12" fill="#FF6B00" />
        <path d="M170 195 L173 198 L180 191" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>

      {/* Card 2 — Analytics Card */}
      <motion.g animate={{ y: [0, 10, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}>
        <rect x="290" y="50" width="200" height="160" rx="22" fill="url(#card2)" filter="url(#card_shadow)" stroke="rgba(124,58,237,0.15)" strokeWidth="1.5" />
        <rect x="312" y="76" width="60" height="11" rx="5.5" fill="#7C3AED" opacity="0.9" />
        <rect x="312" y="100" width="160" height="7" rx="3.5" fill="#E5E7EB" />
        {/* Mini bar chart */}
        <rect x="312" y="125" width="24" height="48" rx="6" fill="#7C3AED" opacity="0.2" />
        <rect x="342" y="138" width="24" height="35" rx="6" fill="#7C3AED" opacity="0.35" />
        <rect x="372" y="118" width="24" height="55" rx="6" fill="#7C3AED" opacity="0.6" />
        <rect x="402" y="128" width="24" height="45" rx="6" fill="#7C3AED" />
        <rect x="432" y="133" width="24" height="40" rx="6" fill="#7C3AED" opacity="0.5" />
      </motion.g>

      {/* Connecting pulse line */}
      <motion.path d="M 230 155 C 258 190, 272 130, 290 145" fill="none" stroke="#FF6B00" strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round"
        animate={{ strokeDashoffset: [0, -22] }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }} />

      {/* Avatars at bottom */}
      <circle cx="190" cy="280" r="24" fill="#FF6B00" />
      <text x="190" y="285" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="sans-serif">AO</text>
      <circle cx="246" cy="280" r="24" fill="#7C3AED" stroke="white" strokeWidth="3" />
      <text x="246" y="285" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="sans-serif">SJ</text>
      <circle cx="302" cy="280" r="24" fill="#2563EB" stroke="white" strokeWidth="3" />
      <text x="302" y="285" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="sans-serif">MV</text>
      <circle cx="358" cy="280" r="24" fill="#16A34A" stroke="white" strokeWidth="3" />
      <text x="358" y="285" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="sans-serif">ER</text>
      <motion.circle cx="246" cy="258" r="7" fill="#16A34A" stroke="white" strokeWidth="2" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
    </svg>
  );
}

function IllustrationEmptyTeam() {
  return (
    <svg viewBox="0 0 360 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", maxHeight: 220 }}>
      <defs>
        <radialGradient id="empty_glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="180" cy="140" r="130" fill="url(#empty_glow)" />
      {/* Three empty person silhouettes */}
      {[100, 180, 260].map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={100} r={i === 1 ? 30 : 24} fill={i === 1 ? "#E5E7EB" : "#F3F4F6"} />
          <path d={`M${cx - (i === 1 ? 40 : 32)} 200 C${cx - (i === 1 ? 40 : 32)} ${i === 1 ? 148 : 154},${cx + (i === 1 ? 40 : 32)} ${i === 1 ? 148 : 154},${cx + (i === 1 ? 40 : 32)} 200 Z`} fill={i === 1 ? "#E5E7EB" : "#F3F4F6"} />
          {i === 1 && (
            <g>
              <circle cx={cx} cy={100} r={12} fill="#D1D5DB" />
              <circle cx={cx - 7} cy={98} r={3} fill="#9CA3AF" />
              <circle cx={cx + 7} cy={98} r={3} fill="#9CA3AF" />
              <path d={`M${cx - 5} 105 Q${cx} 110 ${cx + 5} 105`} stroke="#9CA3AF" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          )}
        </g>
      ))}
      {/* Plus badge on middle figure */}
      <circle cx="210" cy="70" r="18" fill="#FF6B00" />
      <path d="M210 62 L210 78 M202 70 L218 70" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   STATUS HELPERS
─────────────────────────────────────────── */
function StatusDot({ status }: { status: string }) {
  const c = status === "active" ? "#16A34A" : status === "away" ? "#F59E0B" : "#9CA3AF";
  return <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: c, flexShrink: 0 }} />;
}

/* ─────────────────────────────────────────
   INVITE WIZARD MODAL
─────────────────────────────────────────── */
function InviteModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<InviteStep>(1);
  const [form, setForm] = useState({ name: "", email: "", role: "Senior Author", department: "Mathematics", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const roles = [
    { id: "Admin", label: "Admin", desc: "Full workspace control", color: "#FF6B00", bg: "rgba(255,107,0,0.07)" },
    { id: "Senior Author", label: "Senior Author", desc: "Create & stage lessons", color: "#7C3AED", bg: "rgba(124,58,237,0.07)" },
    { id: "Reviewer", label: "Reviewer", desc: "Audit & approve drafts", color: "#16A34A", bg: "rgba(22,163,74,0.07)" },
  ];

  function handleSend() {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1600);
  }

  const canNext1 = form.name.trim().length > 1 && form.email.includes("@");
  const roleObj = roles.find(r => r.id === form.role)!;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--app-text-secondary)", backdropFilter: "blur(6px)", padding: 20 }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 540, background: "var(--app-card)", borderRadius: 28, boxShadow: "0 32px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)", overflow: "hidden" }}
      >
        {/* Progress bar */}
        <div style={{ height: 4, background: "#F3F4F6" }}>
          <motion.div animate={{ width: sent ? "100%" : step === 1 ? "33%" : step === 2 ? "66%" : "100%" }} style={{ height: "100%", background: "linear-gradient(90deg, #FF6B00, #7C3AED)", borderRadius: 2 }} transition={{ duration: 0.4 }} />
        </div>

        <div style={{ padding: "32px 36px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 750, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                {sent ? "Invitation Sent" : `Step ${step} of 3 · ${step === 1 ? "Who to invite" : step === 2 ? "Assign a role" : "Personalise the invite"}`}
              </p>
              <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--app-text-primary)", letterSpacing: "-0.02em" }}>
                {sent ? `Welcome, ${form.name}! 🎉` : step === 1 ? "Who are you inviting?" : step === 2 ? "What will they do?" : "Make it personal"}
              </h3>
            </div>
            <button onClick={onClose} style={{ background: "var(--app-border-glow)", border: "none", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <X size={17} color="var(--app-text-secondary)" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* ── STEP 1: Identity ── */}
            {!sent && step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--app-text-primary)", display: "block", marginBottom: 7 }}>Full Name</label>
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Dr. Amina Yusuf" style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: "1.5px solid var(--app-border)", fontSize: "14.5px", outline: "none", background: "var(--app-bg)", color: "var(--app-text-primary)", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--app-text-primary)", display: "block", marginBottom: 7 }}>Institutional Email</label>
                    <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} type="email" placeholder="colleague@school.edu.ng" style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: "1.5px solid var(--app-border)", fontSize: "14.5px", outline: "none", background: "var(--app-bg)", color: "var(--app-text-primary)", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--app-text-primary)", display: "block", marginBottom: 7 }}>Department</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {["Mathematics", "Sciences", "Humanities", "General"].map(dept => (
                        <button key={dept} onClick={() => setForm(p => ({ ...p, department: dept }))} style={{ padding: "11px 14px", borderRadius: 12, border: `1.5px solid ${form.department === dept ? "#FF6B00" : "var(--app-border)"}`, background: form.department === dept ? "rgba(255,107,0,0.06)" : "var(--app-bg)", color: form.department === dept ? "#FF6B00" : "var(--app-text-secondary)", fontSize: "13px", fontWeight: 650, cursor: "pointer", transition: "all 0.15s" }}>
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button disabled={!canNext1} onClick={() => setStep(2)} style={{ marginTop: 28, width: "100%", padding: "15px", borderRadius: 99, background: canNext1 ? "var(--app-text-primary)" : "#E5E7EB", color: canNext1 ? "var(--app-card)" : "#9CA3AF", border: "none", fontSize: "14.5px", fontWeight: 750, cursor: canNext1 ? "pointer" : "not-allowed", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Continue <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: Role ── */}
            {!sent && step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                  {roles.map(r => (
                    <button key={r.id} onClick={() => setForm(p => ({ ...p, role: r.id }))} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderRadius: 16, border: `1.5px solid ${form.role === r.id ? r.color : "var(--app-border)"}`, background: form.role === r.id ? r.bg : "var(--app-bg)", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: r.bg, color: r.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ShieldCheck size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "14.5px", fontWeight: 750, color: "var(--app-text-primary)" }}>{r.label}</p>
                        <p style={{ fontSize: "12.5px", color: "var(--app-text-secondary)", marginTop: 2 }}>{r.desc}</p>
                      </div>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${form.role === r.id ? r.color : "#D1D5DB"}`, background: form.role === r.id ? r.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {form.role === r.id && <Check size={11} color="white" strokeWidth={3} />}
                      </div>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: "15px", borderRadius: 99, background: "var(--app-border-glow)", color: "var(--app-text-primary)", border: "none", fontSize: "14px", fontWeight: 650, cursor: "pointer" }}>Back</button>
                  <button onClick={() => setStep(3)} style={{ flex: 2, padding: "15px", borderRadius: 99, background: "var(--app-text-primary)", color: "var(--app-card)", border: "none", fontSize: "14.5px", fontWeight: 750, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Personalise ── */}
            {!sent && step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {/* Preview card */}
                <div style={{ padding: "20px 24px", borderRadius: 18, background: "linear-gradient(135deg, rgba(255,107,0,0.04), rgba(124,58,237,0.04))", border: "1.5px solid var(--app-border-glow)", marginBottom: 20 }}>
                  <p style={{ fontSize: "11px", fontWeight: 750, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--app-text-secondary)", marginBottom: 10 }}>Preview</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: roleObj.color, color: "var(--app-card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800 }}>
                      {form.name ? form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "??"}
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)" }}>{form.name || "Colleague's Name"}</p>
                      <p style={{ fontSize: "12px", color: "var(--app-text-secondary)" }}>{form.role} · {form.department}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: "13.5px", color: "var(--app-text-secondary)", fontStyle: "italic", lineHeight: 1.5 }}>
                    "{form.message || "We'd love to have you join our collaborative studio — your expertise will be invaluable to our curriculum team."}"
                  </p>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--app-text-primary)", display: "block", marginBottom: 7 }}>Personal Welcome Note <span style={{ color: "var(--app-text-secondary)", fontWeight: 500 }}>(optional)</span></label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Add a personal touch to your invitation..." style={{ width: "100%", height: 100, padding: "13px 16px", borderRadius: 14, border: "1.5px solid var(--app-border)", fontSize: "14px", outline: "none", background: "var(--app-bg)", color: "var(--app-text-primary)", resize: "none", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep(2)} style={{ flex: 1, padding: "15px", borderRadius: 99, background: "var(--app-border-glow)", color: "var(--app-text-primary)", border: "none", fontSize: "14px", fontWeight: 650, cursor: "pointer" }}>Back</button>
                  <button onClick={handleSend} disabled={sending} style={{ flex: 2, padding: "15px", borderRadius: 99, background: "#FF6B00", color: "var(--app-card)", border: "none", fontSize: "14.5px", fontWeight: 750, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 20px rgba(255,107,0,0.28)" }}>
                    {sending ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "var(--app-card)" }} /> : <><Send size={16} /> Send Invitation</>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── SENT CONFIRMATION ── */}
            {sent && (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "16px 0 8px" }}>
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.1 }}
                  style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(22,163,74,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}
                >
                  <CheckCircle2 size={36} color="#16A34A" />
                </motion.div>
                <p style={{ fontSize: "16px", color: "var(--app-text-secondary)", marginBottom: 8 }}>
                  An invitation has been sent to <strong style={{ color: "var(--app-text-primary)" }}>{form.email}</strong>
                </p>
                <p style={{ fontSize: "13.5px", color: "var(--app-text-secondary)", marginBottom: 28 }}>
                  They'll receive a personalised welcome email with instructions to join your studio as <strong>{form.role}</strong>.
                </p>
                <button onClick={onClose} style={{ padding: "13px 32px", borderRadius: 99, background: "var(--app-text-primary)", color: "var(--app-card)", border: "none", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MEMBER PROFILE MODAL (with Peer Review + Message)
─────────────────────────────────────────── */
function MemberProfileModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  type ProfileView = "profile" | "review" | "message";
  const [view, setView] = useState<ProfileView>("profile");
  const [review, setReview] = useState<ReviewAssignment>({ memberId: member.id, lesson: DRAFT_LESSONS[0], deadline: "", priority: "normal", note: "" });
  const [msg, setMsg] = useState<DirectMessage>({ memberId: member.id, subject: "", body: "" });
  const [reviewSent, setReviewSent] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function submitReview() {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setReviewSent(true); }, 1500);
  }

  function submitMessage() {
    if (!msg.subject.trim() || !msg.body.trim()) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setMsgSent(true); }, 1500);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--app-text-secondary)", backdropFilter: "blur(6px)", padding: 20 }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 580, background: "var(--app-card)", borderRadius: 28, boxShadow: "0 32px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)", overflow: "hidden" }}
      >
        {/* Hero banner */}
        <div style={{ background: `linear-gradient(135deg, ${member.color}18, ${member.color}06)`, padding: "32px 36px 24px", borderBottom: "1px solid var(--app-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: member.color, color: "var(--app-card)", fontSize: "20px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 24px ${member.color}40` }}>
                  {member.avatar}
                </div>
                <StatusDot status={member.status} />
              </div>
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--app-text-primary)", letterSpacing: "-0.02em" }}>{member.name}</h3>
                <p style={{ fontSize: "13.5px", color: "var(--app-text-secondary)", marginTop: 3 }}>{member.role}</p>
                <span style={{ display: "inline-block", marginTop: 6, fontSize: "11px", fontWeight: 750, padding: "3px 10px", borderRadius: 99, background: `${member.color}18`, color: member.color }}>{member.permissions} · Joined {member.joinedDate}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "var(--app-border-glow)", border: "none", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={17} color="var(--app-text-secondary)" />
            </button>
          </div>

          {/* Sub-tabs */}
          {view === "profile" && (
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => { setView("review"); setReviewSent(false); }} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 99, background: "var(--app-text-primary)", color: "var(--app-card)", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.14)" }}>
                <GitPullRequest size={14} /> Assign Peer Review
              </button>
              <button onClick={() => { setView("message"); setMsgSent(false); }} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 99, background: "var(--app-border-glow)", color: "var(--app-text-primary)", border: "none", fontSize: "13px", fontWeight: 650, cursor: "pointer" }}>
                <MessageSquare size={14} /> Message
              </button>
            </div>
          )}
        </div>

        <div style={{ padding: "28px 36px" }}>
          <AnimatePresence mode="wait">
            {/* ── PROFILE VIEW ── */}
            {view === "profile" && (
              <motion.div key="profile-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p style={{ fontSize: "14px", color: "var(--app-text-secondary)", lineHeight: 1.65, marginBottom: 22 }}>{member.bio}</p>
                <div style={{ padding: "14px 18px", borderRadius: 14, background: "var(--app-border-glow)", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: member.status === "active" ? "#16A34A" : "#F59E0B", flexShrink: 0 }} />
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--app-text-primary)" }}>{member.currentTask}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {[
                    { label: "Lessons", val: member.stats.lessonsCreated, color: member.color },
                    { label: "Reviews", val: member.stats.reviewsDone, color: "#7C3AED" },
                    { label: "Drafts", val: member.stats.activeDrafts, color: "#D97706" },
                    { label: "Quality", val: `${member.stats.approvalRate}%`, color: "#16A34A" },
                  ].map(s => (
                    <div key={s.label} style={{ padding: "14px", borderRadius: 14, border: "1px solid var(--app-border)", textAlign: "center" }}>
                      <p style={{ fontSize: "20px", fontWeight: 850, color: s.color, letterSpacing: "-0.02em" }}>{s.val}</p>
                      <p style={{ fontSize: "11px", color: "var(--app-text-secondary)", fontWeight: 600, marginTop: 3 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── PEER REVIEW ASSIGNMENT ── */}
            {view === "review" && !reviewSent && (
              <motion.div key="review-view" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <button onClick={() => setView("profile")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--app-text-secondary)", fontSize: "13px", cursor: "pointer", marginBottom: 20, padding: 0, fontWeight: 600 }}>
                  ← Back to Profile
                </button>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--app-text-primary)", display: "block", marginBottom: 7 }}>Assign Lesson Draft</label>
                    <select value={review.lesson} onChange={e => setReview(p => ({ ...p, lesson: e.target.value }))} style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: "1.5px solid var(--app-border)", fontSize: "14px", outline: "none", background: "var(--app-bg)", color: "var(--app-text-primary)" }}>
                      {DRAFT_LESSONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--app-text-primary)", display: "block", marginBottom: 7 }}>Review Deadline</label>
                      <input type="date" value={review.deadline} onChange={e => setReview(p => ({ ...p, deadline: e.target.value }))} style={{ width: "100%", padding: "12px 14px", borderRadius: 14, border: "1.5px solid var(--app-border)", fontSize: "14px", outline: "none", background: "var(--app-bg)", color: "var(--app-text-primary)", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--app-text-primary)", display: "block", marginBottom: 7 }}>Priority</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        {(["low", "normal", "urgent"] as const).map(p => (
                          <button key={p} onClick={() => setReview(r => ({ ...r, priority: p }))} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: `1.5px solid ${review.priority === p ? (p === "urgent" ? "#DC2626" : p === "normal" ? "#2563EB" : "#6B7280") : "var(--app-border)"}`, background: review.priority === p ? (p === "urgent" ? "rgba(220,38,38,0.07)" : p === "normal" ? "rgba(37,99,235,0.07)" : "rgba(107,114,128,0.07)") : "var(--app-bg)", color: review.priority === p ? (p === "urgent" ? "#DC2626" : p === "normal" ? "#2563EB" : "#6B7280") : "var(--app-text-secondary)", fontSize: "12px", fontWeight: 700, cursor: "pointer", textTransform: "capitalize", transition: "all 0.15s" }}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--app-text-primary)", display: "block", marginBottom: 7 }}>Review Brief / Instructions</label>
                    <textarea value={review.note} onChange={e => setReview(p => ({ ...p, note: e.target.value }))} placeholder={`What should ${member.name.split(" ")[0]} focus on in this review?`} style={{ width: "100%", height: 90, padding: "13px 16px", borderRadius: 14, border: "1.5px solid var(--app-border)", fontSize: "14px", outline: "none", background: "var(--app-bg)", color: "var(--app-text-primary)", resize: "none", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" }} />
                  </div>
                </div>
                <button onClick={submitReview} disabled={submitting} style={{ marginTop: 24, width: "100%", padding: "15px", borderRadius: 99, background: "var(--app-text-primary)", color: "var(--app-card)", border: "none", fontSize: "14.5px", fontWeight: 750, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
                  {submitting ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "var(--app-card)" }} /> : <><GitPullRequest size={16} /> Assign Review Task</>}
                </button>
              </motion.div>
            )}

            {/* Review Sent Confirmation */}
            {view === "review" && reviewSent && (
              <motion.div key="review-sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "12px 0" }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(22,163,74,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <CheckCircle2 size={34} color="#16A34A" />
                </motion.div>
                <h4 style={{ fontSize: "18px", fontWeight: 750, color: "var(--app-text-primary)", marginBottom: 8 }}>Review Assigned!</h4>
                <p style={{ fontSize: "14px", color: "var(--app-text-secondary)", marginBottom: 24, lineHeight: 1.5 }}>
                  <strong>{member.name}</strong> has been notified of the peer review task for <strong>"{review.lesson}"</strong>.
                </p>
                <button onClick={onClose} style={{ padding: "12px 28px", borderRadius: 99, background: "var(--app-text-primary)", color: "var(--app-card)", border: "none", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Done</button>
              </motion.div>
            )}

            {/* ── DIRECT MESSAGE ── */}
            {view === "message" && !msgSent && (
              <motion.div key="msg-view" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <button onClick={() => setView("profile")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--app-text-secondary)", fontSize: "13px", cursor: "pointer", marginBottom: 20, padding: 0, fontWeight: 600 }}>← Back to Profile</button>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--app-text-primary)", display: "block", marginBottom: 7 }}>Subject</label>
                    <input value={msg.subject} onChange={e => setMsg(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Curriculum Update — Review Needed" style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: "1.5px solid var(--app-border)", fontSize: "14px", outline: "none", background: "var(--app-bg)", color: "var(--app-text-primary)", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--app-text-primary)", display: "block", marginBottom: 7 }}>Message</label>
                    <textarea value={msg.body} onChange={e => setMsg(p => ({ ...p, body: e.target.value }))} placeholder={`Hi ${member.name.split(" ")[0]}, I wanted to reach out about...`} style={{ width: "100%", height: 130, padding: "13px 16px", borderRadius: 14, border: "1.5px solid var(--app-border)", fontSize: "14px", outline: "none", background: "var(--app-bg)", color: "var(--app-text-primary)", resize: "none", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box" }} />
                    <p style={{ fontSize: "11.5px", color: "var(--app-text-secondary)", marginTop: 6 }}>Sending to: <strong style={{ color: "var(--app-text-secondary)" }}>{member.email}</strong></p>
                  </div>
                </div>
                <button onClick={submitMessage} disabled={submitting || !msg.subject.trim() || !msg.body.trim()} style={{ marginTop: 22, width: "100%", padding: "15px", borderRadius: 99, background: (!msg.subject.trim() || !msg.body.trim()) ? "#E5E7EB" : "var(--app-text-primary)", color: (!msg.subject.trim() || !msg.body.trim()) ? "#9CA3AF" : "var(--app-card)", border: "none", fontSize: "14.5px", fontWeight: 750, cursor: (!msg.subject.trim() || !msg.body.trim()) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
                  {submitting ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "var(--app-card)" }} /> : <><Send size={16} /> Send Message</>}
                </button>
              </motion.div>
            )}

            {/* Message sent */}
            {view === "message" && msgSent && (
              <motion.div key="msg-sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "12px 0" }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <Send size={32} color="#2563EB" />
                </motion.div>
                <h4 style={{ fontSize: "18px", fontWeight: 750, color: "var(--app-text-primary)", marginBottom: 8 }}>Message Sent!</h4>
                <p style={{ fontSize: "14px", color: "var(--app-text-secondary)", marginBottom: 24 }}>
                  Your message was delivered to <strong>{member.email}</strong>.
                </p>
                <button onClick={onClose} style={{ padding: "12px 28px", borderRadius: 99, background: "var(--app-text-primary)", color: "var(--app-card)", border: "none", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Done</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE COMPONENT
─────────────────────────────────────────── */
function EmptyState({ tab, onInvite }: { tab: TeamTab; onInvite: () => void }) {
  const configs: Record<TeamTab, { title: string; desc: string; cta: string; action?: () => void }> = {
    overview: { title: "Your studio team starts here", desc: "Invite educators, assign roles, and build a collaborative curriculum factory that's greater than any one person.", cta: "Invite Your First Member" },
    directory: { title: "No faculty members yet", desc: "Your studio is quiet. Invite educators from your institution — assign them as Authors, Reviewers, or Admins.", cta: "Invite a Faculty Member" },
    squads: { title: "No subject squads yet", desc: "Squads are automatically created when you invite faculty and assign them departments. Start by inviting your first colleague.", cta: "Invite Faculty to Create Squads" },
    activity: { title: "No activity yet", desc: "Activity will appear here as your team creates lessons, reviews content, and collaborates in real time.", cta: "Invite Your Team" },
    permissions: { title: "No roles configured yet", desc: "Role permissions will appear here once you invite faculty members. Each person gets assigned a role when joining.", cta: "Invite & Assign Roles" },
  };
  const c = configs[tab];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 32px", textAlign: "center", background: "var(--app-card)", borderRadius: 28, border: "1px dashed var(--app-border)" }}>
      <div style={{ width: 240 }}>
        <IllustrationEmptyTeam />
      </div>
      <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--app-text-primary)", marginTop: 24, marginBottom: 10, letterSpacing: "-0.02em" }}>{c.title}</h3>
      <p style={{ fontSize: "14.5px", color: "var(--app-text-secondary)", maxWidth: 400, lineHeight: 1.6, marginBottom: 28 }}>{c.desc}</p>
      <button onClick={onInvite} style={{ display: "flex", alignItems: "center", gap: 9, padding: "14px 28px", background: "var(--app-text-primary)", color: "var(--app-card)", borderRadius: 99, border: "none", fontSize: "14.5px", fontWeight: 750, cursor: "pointer", boxShadow: "0 8px 20px rgba(0,0,0,0.14)" }}>
        <UserPlus size={17} /> {c.cta}
      </button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<TeamTab>("overview");
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState<string>("All");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [members, setMembers] = useState(TEAM_MEMBERS);

  const hasTeam = members.length > 0;
  const filteredMembers = members.filter(m => {
    const q = search.toLowerCase();
    const match = m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    return match && (filterDept === "All" || m.department === filterDept);
  });

  const TABS: { id: TeamTab; label: string; icon: any }[] = [
    { id: "overview", label: "Spotlight", icon: Sparkles },
    { id: "directory", label: "Faculty", icon: Users },
    { id: "squads", label: "Squads", icon: Layers },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "permissions", label: "Access & Roles", icon: ShieldCheck },
  ];

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", paddingBottom: 80, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ padding: "12px 0 36px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "36px", fontWeight: 850, color: "var(--app-text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Built for Educators.
          </h1>
          <p style={{ fontSize: "15px", color: "var(--app-text-secondary)", marginTop: 8, fontWeight: 450 }}>
            {hasTeam ? `${members.length} faculty members · 3 active subject squads · ${members.filter(m => m.status === "active").length} online now` : "Your collaborative studio faculty workspace"}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 14px 32px rgba(20,18,16,0.22)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setInviteOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: 9, padding: "13px 24px", background: "var(--app-text-primary)", color: "var(--app-card)", borderRadius: 99, border: "none", fontSize: "14px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(20,18,16,0.18)" }}
        >
          <UserPlus size={16} /> Invite Teacher
        </motion.button>
      </div>

      {/* ── PILL NAV ── */}
      <div style={{ display: "flex", gap: 4, padding: "5px", background: "var(--app-border-glow)", borderRadius: 99, width: "fit-content", marginBottom: 32 }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ position: "relative", display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 99, border: "none", background: "transparent", color: active ? "var(--app-text-primary)" : "var(--app-text-secondary)", fontSize: "13px", fontWeight: active ? 750 : 550, cursor: "pointer", transition: "color 0.2s" }}>
              {active && <motion.div layoutId="tab-pill" style={{ position: "absolute", inset: 0, borderRadius: 99, background: "var(--app-card)", boxShadow: "0 2px 10px rgba(0,0,0,0.09)", zIndex: 0 }} transition={{ type: "spring", stiffness: 450, damping: 36 }} />}
              <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 7 }}>
                <Icon size={14} color={active ? "#FF6B00" : "currentColor"} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── TAB CONTENT ── */}
      <AnimatePresence mode="wait">

        {/* 1. SPOTLIGHT */}
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.22 }}>
            {!hasTeam ? <EmptyState tab="overview" onInvite={() => setInviteOpen(true)} /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Hero */}
                <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 32, background: "var(--app-card)", border: "1px solid var(--app-border)", borderRadius: 28, padding: "44px 48px", boxShadow: "0 12px 40px rgba(0,0,0,0.03)", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.08em" }}>Studio Collaboration</span>
                    <h2 style={{ fontSize: "30px", fontWeight: 800, color: "var(--app-text-primary)", marginTop: 8, letterSpacing: "-0.02em", lineHeight: 1.2 }}>Real-time multiplayer lesson creation for modern schools.</h2>
                    <p style={{ fontSize: "14.5px", color: "var(--app-text-secondary)", marginTop: 12, lineHeight: 1.65 }}>Your faculty builds seamlessly across STEM and Humanities — live cursors, AI Student Personas, and peer review audits in one unified hub.</p>
                    <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
                      <button onClick={() => setActiveTab("directory")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 99, background: "#FF6B00", color: "var(--app-card)", border: "none", fontSize: "13.5px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 18px rgba(255,107,0,0.28)" }}>
                        Explore Faculty <ArrowRight size={15} />
                      </button>
                      <button onClick={() => setActiveTab("squads")} style={{ padding: "12px 22px", borderRadius: 99, background: "var(--app-border-glow)", color: "var(--app-text-primary)", border: "none", fontSize: "13.5px", fontWeight: 650, cursor: "pointer" }}>View Squads</button>
                    </div>
                  </div>
                  <IllustrationCollaboration />
                </div>

                {/* Stats Bento */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                  {[
                    { label: "Active Educators", val: `${members.filter(m => m.status === "active").length} Online`, sub: "Across all departments", icon: Users, color: "#FF6B00" },
                    { label: "Peer Reviews Queued", val: "11 Pending", sub: "Avg turnaround: 1.4 days", icon: GitPullRequest, color: "#7C3AED" },
                    { label: "AI Co-Teach Insights", val: "254 Applied", sub: "Across 42 active lessons", icon: Sparkles, color: "#16A34A" },
                  ].map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -4 }} style={{ background: "var(--app-card)", border: "1px solid var(--app-border)", borderRadius: 22, padding: "28px", boxShadow: "0 8px 24px rgba(0,0,0,0.02)" }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: `${s.color}12`, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <s.icon size={20} />
                      </div>
                      <p style={{ fontSize: "22px", fontWeight: 850, color: "var(--app-text-primary)", letterSpacing: "-0.02em" }}>{s.val}</p>
                      <p style={{ fontSize: "12.5px", color: "var(--app-text-secondary)", marginTop: 4 }}>{s.sub}</p>
                      <p style={{ fontSize: "11.5px", color: s.color, fontWeight: 700, marginTop: 14 }}>{s.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 2. FACULTY DIRECTORY */}
        {activeTab === "directory" && (
          <motion.div key="directory" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.22 }}>
            {!hasTeam ? <EmptyState tab="directory" onInvite={() => setInviteOpen(true)} /> : (
              <>
                {/* Toolbar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
                  <div style={{ position: "relative", width: 320 }}>
                    <Search size={15} style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "var(--app-text-secondary)" }} />
                    <input type="text" placeholder="Search faculty..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "11px 15px 11px 42px", borderRadius: 99, border: "1px solid var(--app-border)", fontSize: "13.5px", outline: "none", background: "var(--app-card)", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ display: "flex", gap: 7 }}>
                    {["All", "Mathematics", "Sciences", "Humanities"].map(d => (
                      <button key={d} onClick={() => setFilterDept(d)} style={{ padding: "8px 16px", borderRadius: 99, border: "none", background: filterDept === d ? "var(--app-text-primary)" : "var(--app-border-glow)", color: filterDept === d ? "var(--app-card)" : "var(--app-text-secondary)", fontSize: "12.5px", fontWeight: 650, cursor: "pointer", transition: "all 0.15s" }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Member Cards Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                  {filteredMembers.map(member => (
                    <motion.div key={member.id} layout whileHover={{ y: -5 }} onClick={() => setSelectedMember(member)}
                      style={{ background: "var(--app-card)", border: "1px solid var(--app-border)", borderRadius: 24, padding: "24px", cursor: "pointer", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", transition: "box-shadow 0.2s" }}
                    >
                      {/* Soft color accent top */}
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: member.color, borderRadius: "24px 24px 0 0" }} />

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ position: "relative" }}>
                          <div style={{ width: 50, height: 50, borderRadius: "50%", background: member.color, color: "var(--app-card)", fontSize: "15px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 16px ${member.color}30` }}>
                            {member.avatar}
                          </div>
                          <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", background: member.status === "active" ? "#16A34A" : member.status === "away" ? "#F59E0B" : "#9CA3AF", border: "2px solid #fff" }} />
                        </div>
                        <span style={{ fontSize: "10.5px", fontWeight: 750, padding: "3px 10px", borderRadius: 99, background: member.permissions === "Admin" ? "rgba(255,107,0,0.1)" : "var(--app-border-glow)", color: member.permissions === "Admin" ? "#FF6B00" : "var(--app-text-secondary)" }}>
                          {member.permissions}
                        </span>
                      </div>

                      <h3 style={{ fontSize: "16px", fontWeight: 750, color: "var(--app-text-primary)" }}>{member.name}</h3>
                      <p style={{ fontSize: "12.5px", color: "var(--app-text-secondary)", marginTop: 2 }}>{member.role}</p>

                      <div style={{ margin: "14px 0", padding: "10px 14px", borderRadius: 12, background: "var(--app-border-glow)", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: member.status === "active" ? "#16A34A" : member.status === "away" ? "#F59E0B" : "#9CA3AF" }} />
                        <span style={{ fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 550, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{member.currentTask}</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid var(--app-border)", marginTop: "auto" }}>
                        <div style={{ display: "flex", gap: 18 }}>
                          <span style={{ fontSize: "13px", color: "var(--app-text-primary)" }}><strong style={{ fontWeight: 800 }}>{member.stats.lessonsCreated}</strong> <span style={{ color: "var(--app-text-secondary)", fontSize: "11.5px" }}>lessons</span></span>
                          <span style={{ fontSize: "13px", color: "var(--app-text-primary)" }}><strong style={{ fontWeight: 800 }}>{member.stats.approvalRate}%</strong> <span style={{ color: "var(--app-text-secondary)", fontSize: "11.5px" }}>quality</span></span>
                        </div>
                        <motion.div whileHover={{ x: 3 }} style={{ display: "flex", alignItems: "center", gap: 4, color: member.color, fontSize: "12.5px", fontWeight: 750, cursor: "pointer" }}>
                          Open <ChevronRight size={14} />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* 3. SQUADS */}
        {activeTab === "squads" && (
          <motion.div key="squads" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.22 }}>
            {!hasTeam ? <EmptyState tab="squads" onInvite={() => setInviteOpen(true)} /> : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
                {SQUADS.map(squad => (
                  <motion.div key={squad.id} whileHover={{ y: -5 }} style={{ background: "var(--app-card)", border: "1px solid var(--app-border)", borderRadius: 26, padding: "30px", boxShadow: "0 8px 28px rgba(0,0,0,0.03)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: squad.gradient }} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, padding: "3px 10px", borderRadius: 99, background: `${squad.color}10`, color: squad.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{squad.members.length} Authors</span>
                      <span style={{ fontSize: "13px", fontWeight: 750, color: "var(--app-text-primary)" }}>{squad.progress}%</span>
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--app-text-primary)", letterSpacing: "-0.01em" }}>{squad.name}</h3>
                    <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", marginTop: 6, lineHeight: 1.55 }}>{squad.desc}</p>
                    <div style={{ margin: "20px 0", height: 5, borderRadius: 99, background: "var(--app-border-glow)", overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${squad.progress}%` }} transition={{ duration: 1.2, ease: "easeOut" }} style={{ height: "100%", background: squad.gradient, borderRadius: 99 }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ display: "flex" }}>
                        {squad.members.map((m, i) => (
                          <div key={m.id} style={{ width: 30, height: 30, borderRadius: "50%", background: m.color, color: "var(--app-card)", fontSize: "10px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", marginLeft: i > 0 ? -9 : 0 }}>{m.avatar}</div>
                        ))}
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 600 }}>Lead: {squad.lead}</span>
                    </div>
                    <button onClick={() => alert(`Opening ${squad.name} workspace`)} style={{ marginTop: 22, width: "100%", padding: "12px", borderRadius: 14, background: "var(--app-border-glow)", color: "var(--app-text-primary)", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                      Manage Squad <ArrowRight size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* 4. ACTIVITY */}
        {activeTab === "activity" && (
          <motion.div key="activity" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.22 }}>
            {!hasTeam ? <EmptyState tab="activity" onInvite={() => setInviteOpen(true)} /> : (
              <div style={{ background: "var(--app-card)", border: "1px solid var(--app-border)", borderRadius: 26, padding: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--app-text-primary)" }}>Studio Activity Stream</h3>
                    <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", marginTop: 2 }}>Real-time collaborative events from across your faculty</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 99, background: "rgba(22,163,74,0.08)" }}>
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} />
                    <span style={{ fontSize: "12px", color: "#16A34A", fontWeight: 700 }}>Live</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {ACTIVITY_LOG.map((act, i) => (
                    <motion.div key={act.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 16, border: "1px solid var(--app-border)", background: "var(--app-bg)" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: act.color, color: "var(--app-card)", fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{act.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "14px", color: "var(--app-text-primary)", fontWeight: 500 }}>
                          <strong style={{ fontWeight: 750 }}>{act.user}</strong> {act.action} <strong style={{ color: "#FF6B00", fontWeight: 700 }}>{act.target}</strong>
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", marginTop: 2 }}>{act.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 5. ACCESS & ROLES */}
        {activeTab === "permissions" && (
          <motion.div key="permissions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.22 }}>
            {!hasTeam ? <EmptyState tab="permissions" onInvite={() => setInviteOpen(true)} /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ background: "var(--app-card)", border: "1px solid var(--app-border)", borderRadius: 26, padding: "32px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                    <div>
                      <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--app-text-primary)" }}>Role Access Matrix</h3>
                      <p style={{ fontSize: "13.5px", color: "var(--app-text-secondary)", marginTop: 4 }}>Configure fine-grained permissions for content creation, staging & publishing.</p>
                    </div>
                    <button onClick={() => setInviteOpen(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 99, background: "#FF6B00", color: "var(--app-card)", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 16px rgba(255,107,0,0.25)" }}>
                      <UserPlus size={14} /> Add Member
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {PERMISSION_ROLES.map((r, i) => (
                      <div key={i} style={{ padding: "22px 24px", borderRadius: 20, border: "1px solid var(--app-border)", background: "var(--app-bg)" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 14, background: `${r.color}12`, color: r.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <r.icon size={20} />
                            </div>
                            <div>
                              <h4 style={{ fontSize: "16px", fontWeight: 750, color: "var(--app-text-primary)" }}>{r.role}</h4>
                              <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", marginTop: 2 }}>{r.desc}</p>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--app-text-secondary)" }}>{r.users} Assigned</span>
                            <button style={{ padding: "7px 14px", borderRadius: 10, border: "1px solid var(--app-border)", background: "var(--app-card)", fontSize: "12.5px", fontWeight: 650, cursor: "pointer" }}>Configure</button>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {r.can.map(cap => (
                            <span key={cap} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 99, background: `${r.color}0D`, color: r.color, fontSize: "12px", fontWeight: 650 }}>
                              <Check size={11} strokeWidth={2.5} /> {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {inviteOpen && <InviteModal onClose={() => setInviteOpen(false)} />}
        {selectedMember && <MemberProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
      </AnimatePresence>
    </div>
  );
}
