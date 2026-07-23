"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, Clock, AlertCircle, MessageSquare, 
  MoreHorizontal, Plus, Search, Layers, FileText,
  User, Check, Filter, Zap, X
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────
   DESIGN TOKENS
────────────────────────────────────────────────────────────────── */
const TOKENS = {
  fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  border: "var(--app-shadow), 0 0 0 1px var(--app-border)",
  bg: "var(--app-card)",
  bgSubtle: "var(--app-bg)",
  textPrimary: "var(--app-text-primary)",
  textMuted: "var(--app-text-secondary)",
  brand: "#FF6B00",
  success: "#16A34A",
  danger: "#DC2626",
  warning: "#D97706"
};

/* ──────────────────────────────────────────────────────────────────
   TYPES & DATA
────────────────────────────────────────────────────────────────── */
type Status = "ideas" | "drafting" | "review" | "approved";
type Priority = "low" | "normal" | "urgent";

interface DraftItem {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  tags: string[];
  assignees: { name: string; initials: string }[];
  progress?: { completed: number; total: number };
  updatedAt: string;
  lessonId: string;
}

const INITIAL_DRAFTS: DraftItem[] = [
  { id: "d1", lessonId: "MAT-204", title: "Polynomial Long Division", status: "drafting", priority: "urgent", tags: ["Mathematics", "Core"], assignees: [{ name: "Chidi Madu", initials: "CM" }], progress: { completed: 8, total: 12 }, updatedAt: "2h ago" },
  { id: "d2", lessonId: "PHY-101", title: "Newton's First Law", status: "review", priority: "normal", tags: ["Physics"], assignees: [{ name: "Sarah James", initials: "SJ" }], progress: { completed: 10, total: 10 }, updatedAt: "5h ago" },
  { id: "d3", lessonId: "HIS-305", title: "Pre-Colonial Trade Routes", status: "ideas", priority: "low", tags: ["History"], assignees: [], updatedAt: "1d ago" },
  { id: "d4", lessonId: "CHE-202", title: "Covalent Bonding Dynamics", status: "drafting", priority: "normal", tags: ["Chemistry", "Lab"], assignees: [{ name: "Marcus Vance", initials: "MV" }], progress: { completed: 3, total: 15 }, updatedAt: "3d ago" },
  { id: "d5", lessonId: "MAT-205", title: "Quadratic Roots & Functions", status: "approved", priority: "normal", tags: ["Mathematics"], assignees: [{ name: "Dr. Amara Osei", initials: "AO" }], progress: { completed: 14, total: 14 }, updatedAt: "1w ago" },
];

const COLUMNS: { id: Status; label: string; icon: any }[] = [
  { id: "ideas", label: "Ideas", icon: Zap },
  { id: "drafting", label: "Drafting", icon: FileText },
  { id: "review", label: "In Review", icon: AlertCircle },
  { id: "approved", label: "Approved", icon: CheckCircle2 },
];

/* ──────────────────────────────────────────────────────────────────
   PAGE COMPONENT
────────────────────────────────────────────────────────────────── */
export default function PendingDraftsPage() {
  const [drafts, setDrafts] = useState<DraftItem[]>(INITIAL_DRAFTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Modals
  const [newDraftModal, setNewDraftModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  // New Draft State
  const [newTitle, setNewTitle] = useState("");
  const [newLessonId, setNewLessonId] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("normal");

  const moveDraft = (id: string, newStatus: Status) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    setMenuOpenId(null);
  };

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLessonId) return;

    const newDraft: DraftItem = {
      id: `d_${Date.now()}`,
      lessonId: newLessonId.toUpperCase(),
      title: newTitle,
      status: "ideas",
      priority: newPriority,
      tags: ["New"],
      assignees: [{ name: "Current User", initials: "CU" }],
      updatedAt: "Just now"
    };

    setDrafts(prev => [newDraft, ...prev]);
    setNewDraftModal(false);
    setNewTitle("");
    setNewLessonId("");
    setNewPriority("normal");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", fontFamily: "'Inter', -apple-system, sans-serif", background: TOKENS.bgSubtle }}>
      
      {/* ── HEADER ── */}
      <div style={{ padding: "32px 40px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid var(--app-border)", background: TOKENS.bgSubtle }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: TOKENS.textPrimary, letterSpacing: "-0.02em" }}>Pending Drafts</h1>
          <p style={{ fontSize: "14px", color: TOKENS.textMuted, marginTop: 4, fontWeight: 500 }}>Manage and track your active curriculum pipeline.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} color={TOKENS.textMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input 
              type="text" placeholder="Search drafts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: "8px 12px 8px 32px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-card)", fontSize: "13px", fontFamily: "inherit", width: 240, outline: "none" }} 
            />
          </div>
          <button onClick={() => setFilterModal(true)} style={{ padding: "8px 14px", borderRadius: 8, background: "var(--app-card)", border: "1px solid var(--app-border)", fontSize: "13px", fontWeight: 600, color: TOKENS.textPrimary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={14} /> Filter
          </button>
          <button onClick={() => setNewDraftModal(true)} style={{ padding: "8px 16px", borderRadius: 8, background: "var(--app-text-primary)", border: "none", fontSize: "13px", fontWeight: 600, color: "var(--app-card)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={16} /> New Draft
          </button>
        </div>
      </div>

      {/* ── BOARD ── */}
      <div style={{ flex: 1, overflowX: "auto", overflowY: "hidden", padding: "32px 40px" }}>
        <div style={{ display: "flex", gap: 24, height: "100%", minWidth: 1200 }}>
          {COLUMNS.map(column => {
            const columnDrafts = drafts.filter(d => d.status === column.id && d.title.toLowerCase().includes(searchQuery.toLowerCase()));
            const Icon = column.icon;

            return (
              <div key={column.id} style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--app-border)", borderRadius: 16, padding: "20px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: "0 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon size={14} color={TOKENS.textMuted} />
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: TOKENS.textPrimary, textTransform: "uppercase", letterSpacing: "0.04em" }}>{column.label}</h3>
                    <span style={{ fontSize: "12px", fontFamily: TOKENS.fontMono, color: TOKENS.textMuted, background: "var(--app-border)", padding: "2px 6px", borderRadius: 99 }}>{columnDrafts.length}</span>
                  </div>
                  <button onClick={() => setNewDraftModal(true)} style={{ background: "transparent", border: "none", cursor: "pointer", color: TOKENS.textMuted }}>
                    <Plus size={16} />
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, padding: "0 4px" }}>
                  <AnimatePresence mode="popLayout">
                    {columnDrafts.map((draft) => (
                      <motion.div 
                        layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                        key={draft.id} style={{ background: TOKENS.bg, boxShadow: TOKENS.border, borderRadius: 12, padding: "16px", cursor: "grab", position: "relative" }}
                        whileHover={{ y: -2, boxShadow: "0 0 0 1px var(--app-border-glow), 0 8px 24px rgba(0,0,0,0.04)" }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                          <span style={{ fontSize: "11px", fontWeight: 650, color: TOKENS.textMuted, fontFamily: TOKENS.fontMono }}>{draft.lessonId}</span>
                          <div style={{ position: "relative" }}>
                            <button onClick={() => setMenuOpenId(menuOpenId === draft.id ? null : draft.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: TOKENS.textMuted, padding: 4 }}><MoreHorizontal size={14} /></button>
                            <AnimatePresence>
                              {menuOpenId === draft.id && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: "absolute", top: "100%", right: 0, zIndex: 100, background: TOKENS.bg, boxShadow: "0 12px 32px rgba(0,0,0,0.1), 0 0 0 1px var(--app-border-glow)", borderRadius: 8, padding: 6, minWidth: 160 }}>
                                  <div style={{ fontSize: "11px", fontWeight: 700, color: TOKENS.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", padding: "6px 8px", marginBottom: 4 }}>Move to...</div>
                                  {COLUMNS.map(c => (
                                    <button key={c.id} onClick={() => moveDraft(draft.id, c.id)} disabled={c.id === draft.status} style={{ width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", borderRadius: 4, fontSize: "13px", fontWeight: 500, color: c.id === draft.status ? TOKENS.textMuted : TOKENS.textPrimary, cursor: c.id === draft.status ? "default" : "pointer", display: "flex", justifyContent: "space-between" }}>
                                      {c.label} {c.id === draft.status && <Check size={14} />}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <h4 style={{ fontSize: "14px", fontWeight: 700, color: TOKENS.textPrimary, marginBottom: 12, lineHeight: 1.4, letterSpacing: "-0.01em" }}>{draft.title}</h4>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                          {draft.tags.map(tag => (<span key={tag} style={{ fontSize: "10px", fontWeight: 650, color: TOKENS.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", padding: "2px 6px", background: "var(--app-border)", borderRadius: 4 }}>{tag}</span>))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--app-border)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ display: "flex" }}>
                              {draft.assignees.length > 0 ? draft.assignees.map((a, i) => (<div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--app-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: TOKENS.textPrimary, border: "2px solid #fff", marginLeft: i > 0 ? -8 : 0 }}>{a.initials}</div>)) : (<div style={{ width: 24, height: 24, borderRadius: "50%", border: "1px dashed var(--app-border)", display: "flex", alignItems: "center", justifyContent: "center", color: TOKENS.textMuted }}><User size={12} /></div>)}
                            </div>
                            {draft.progress && <span style={{ fontSize: "11px", fontWeight: 650, color: TOKENS.textMuted, fontFamily: TOKENS.fontMono }}>{draft.progress.completed}/{draft.progress.total}</span>}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {draft.priority === "urgent" && <AlertCircle size={14} color={TOKENS.danger} />}
                            {draft.priority === "low" && <Circle size={14} color={TOKENS.textMuted} />}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── NEW DRAFT MODAL ── */}
      <AnimatePresence>
        {newDraftModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--app-text-secondary)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} style={{ width: "100%", maxWidth: 480, background: "var(--app-card)", borderRadius: 24, boxShadow: "0 24px 48px rgba(0,0,0,0.1)", overflow: "hidden" }}>
              <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--app-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: TOKENS.textPrimary, letterSpacing: "-0.01em" }}>Create New Draft</h3>
                <button onClick={() => setNewDraftModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: TOKENS.textMuted }}><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateDraft} style={{ padding: 32 }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 650, color: TOKENS.textPrimary, marginBottom: 8 }}>Lesson ID</label>
                    <input type="text" placeholder="e.g. MAT-101" value={newLessonId} onChange={e => setNewLessonId(e.target.value)} required style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-card)", fontSize: "14px", fontFamily: TOKENS.fontMono, textTransform: "uppercase" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 650, color: TOKENS.textPrimary, marginBottom: 8 }}>Priority</label>
                    <select value={newPriority} onChange={e => setNewPriority(e.target.value as Priority)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-card)", fontSize: "14px", fontFamily: "inherit" }}>
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 32 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 650, color: TOKENS.textPrimary, marginBottom: 8 }}>Lesson Title</label>
                  <input type="text" placeholder="Lesson title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} required style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-card)", fontSize: "14px", fontFamily: "inherit" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                  <button type="button" onClick={() => setNewDraftModal(false)} style={{ padding: "10px 16px", borderRadius: 8, background: "transparent", border: "none", fontSize: "13px", fontWeight: 600, color: TOKENS.textPrimary, cursor: "pointer" }}>Cancel</button>
                  <button type="submit" style={{ padding: "10px 16px", borderRadius: 8, background: "var(--app-text-primary)", border: "none", fontSize: "13px", fontWeight: 600, color: "var(--app-card)", cursor: "pointer" }}>Create Draft</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FILTER MODAL ── */}
      <AnimatePresence>
        {filterModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--app-text-secondary)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} style={{ width: "100%", maxWidth: 360, background: "var(--app-card)", borderRadius: 24, boxShadow: "0 24px 48px rgba(0,0,0,0.1)", overflow: "hidden" }}>
              <div style={{ padding: "24px", borderBottom: "1px solid var(--app-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: TOKENS.textPrimary, letterSpacing: "-0.01em" }}>Filter Drafts</h3>
                <button onClick={() => setFilterModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: TOKENS.textMuted }}><X size={20} /></button>
              </div>
              <div style={{ padding: 24 }}>
                <p style={{ fontSize: "13px", color: TOKENS.textMuted }}>Filter UI placeholder. In a production app, this would contain multi-select checkboxes for Priority, Assignees, and Tags.</p>
              </div>
              <div style={{ padding: "16px 24px", background: "var(--app-bg)", borderTop: "1px solid var(--app-border)", display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => setFilterModal(false)} style={{ padding: "8px 16px", borderRadius: 8, background: "var(--app-text-primary)", border: "none", fontSize: "13px", fontWeight: 600, color: "var(--app-card)", cursor: "pointer" }}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
