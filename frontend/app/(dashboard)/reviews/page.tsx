"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, Clock, AlertCircle, MessageSquare, 
  Flag, ThumbsUp, ThumbsDown, ChevronRight, X, User,
  Send, Maximize2, Minimize2, MoreHorizontal, FileText, Check,
  Brain, Loader2, History, RotateCcw, Layers
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────
   DESIGN TOKENS
────────────────────────────────────────────────────────────────── */
const TOKENS = {
  fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  border: "0 0 0 1px var(--app-border-glow), 0 2px 12px rgba(0,0,0,0.03)",
  bg: "var(--app-card)",
  bgSubtle: "var(--app-bg)",
  textPrimary: "var(--app-text-primary)",
  textMuted: "var(--app-text-secondary)",
  brand: "#FF6B00",
  success: "#16A34A",
  danger: "#DC2626",
  warning: "#D97706",
  provoke: "#EA580C", // A slightly deeper orange for Provoking
  sync: "#2563EB" // A distinct blue for Syncing actions
};

/* ──────────────────────────────────────────────────────────────────
   MOCK DATA
────────────────────────────────────────────────────────────────── */
type SyncItem = { id: string; title: string; syncedAt: string; author: string; status: "synced" | "reverted" };

const INITIAL_INBOX = [
  { id: "r1", title: "Quadratic Equations — Level 2", author: "Dr. Amara Osei", initials: "AO", priority: "urgent", time: "2h ago", deadline: "Today, 5:00 PM", status: "unread", tags: ["Mathematics", "Assessment"] },
  { id: "r2", title: "Optics & Light Refraction", author: "Sarah James", initials: "SJ", priority: "normal", time: "5h ago", deadline: "Tomorrow, 10:00 AM", status: "read", tags: ["Physics", "Simulation"] },
  { id: "r3", title: "Post-Colonial Africa History", author: "Elena Rostova", initials: "ER", priority: "low", time: "1d ago", deadline: "Friday", status: "read", tags: ["History", "Reading"] },
];

const MOCK_SLIDES = [
  { id: "s1", type: "Concept Card", title: "Standard Form of Quadratics", content: "Understanding ax² + bx + c = 0. The coefficients determine the parabola's shape and position." },
  { id: "s2", type: "Formula Spotlight", title: "The Quadratic Formula", content: "x = [-b ± √(b² - 4ac)] / 2a" },
  { id: "s3", type: "Worked Example", title: "Solving x² - 5x + 6 = 0", content: "Step 1: Identify a=1, b=-5, c=6.\nStep 2: Factorize to (x-2)(x-3) = 0." },
  { id: "s4", type: "Multiple Choice", title: "Check for Understanding", content: "What are the roots of x² - 4 = 0?" },
];

/* ──────────────────────────────────────────────────────────────────
   PAGE COMPONENT
────────────────────────────────────────────────────────────────── */
export default function ReviewsPage() {
  const [inboxItems, setInboxItems] = useState(INITIAL_INBOX);
  const [filter, setFilter] = useState<"pending" | "completed">("pending");
  
  // Selection
  const [activeId, setActiveId] = useState<string>("r1");
  const [stackMode, setStackMode] = useState(false);
  const [stackSelection, setStackSelection] = useState<Set<string>>(new Set(["r1"]));

  const [selectedSlide, setSelectedSlide] = useState<string | null>(null);
  
  // Interaction States
  const [score, setScore] = useState(8);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [provokeModalOpen, setProvokeModalOpen] = useState(false);
  const [provokeStatement, setProvokeStatement] = useState("");
  
  // Sync History
  const [historyOpen, setHistoryOpen] = useState(false);
  const [syncHistory, setSyncHistory] = useState<SyncItem[]>([
    { id: "sy1", title: "Linear Equations Mastery", syncedAt: "Yesterday, 4:30 PM", author: "Dr. Amara Osei", status: "synced" },
    { id: "sy2", title: "Introduction to Kinematics", syncedAt: "Yesterday, 2:15 PM", author: "Sarah James", status: "synced" },
  ]);

  const [toastMsg, setToastMsg] = useState<{title: string, desc: string, type: "success"|"warning"|"info"} | null>(null);

  const filteredItems = inboxItems.filter(item => filter === "pending" ? item.status !== "completed" : item.status === "completed");
  const activeItem = inboxItems.find(i => i.id === activeId);

  // Stack Mode Helpers
  const isStacked = stackMode && stackSelection.size > 0;
  const activeItemsToRender = isStacked 
    ? inboxItems.filter(i => stackSelection.has(i.id))
    : (activeItem ? [activeItem] : []);

  useEffect(() => {
    if (!stackMode && stackSelection.size > 0) {
      setStackSelection(new Set());
    }
  }, [stackMode]);

  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  /* ── ACTIONS ── */
  const toggleStackItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(stackSelection);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setStackSelection(next);
  };

  const handleDecision = (decision: "sync" | "provoke") => {
    const idsToProcess = isStacked ? Array.from(stackSelection) : [activeId];
    
    if (decision === "sync") {
      setToastMsg({ title: "Database Synced", desc: isStacked ? `Synced ${idsToProcess.length} lessons to main database.` : "Synced to main database.", type: "success" });
      const newSyncs: SyncItem[] = idsToProcess.map(id => {
        const item = inboxItems.find(i => i.id === id);
        return { id: `sy_${Date.now()}_${id}`, title: item?.title || "Unknown", syncedAt: "Just now", author: item?.author || "Unknown", status: "synced" };
      });
      setSyncHistory(prev => [...newSyncs, ...prev]);
    } else {
      setToastMsg({ title: "Staging Provoked", desc: `Statement sent. Author notified to edit lesson.`, type: "warning" });
    }

    setInboxItems(prev => prev.map(item => idsToProcess.includes(item.id) ? { ...item, status: "completed" } : item));
    
    // Reset selections
    if (isStacked) setStackSelection(new Set());
    
    const nextPending = inboxItems.find(i => !idsToProcess.includes(i.id) && i.status !== "completed");
    if (nextPending) setActiveId(nextPending.id);
  };

  const handleProvokeSubmit = () => {
    if (!provokeStatement.trim()) return;
    setProvokeModalOpen(false);
    setProvokeStatement("");
    handleDecision("provoke");
  };

  const handleRevertSync = (syncId: string, lessonTitle: string) => {
    setSyncHistory(prev => prev.map(s => s.id === syncId ? { ...s, status: "reverted" } : s));
    setToastMsg({ title: "Sync Reverted", desc: `"${lessonTitle}" pulled from database.`, type: "info" });
    // In a real app, this would push the item back into the pending inbox.
  };

  const handleSummarize = () => {
    setSummarizeLoading(true);
    setTimeout(() => {
      setSummarizeLoading(false);
      setSummaryModalOpen(true);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)", overflow: "hidden", fontFamily: "'Inter', -apple-system, sans-serif", background: TOKENS.bgSubtle, position: "relative" }}>
      
      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 50, x: "-50%" }}
            style={{ position: "absolute", bottom: 100, left: "50%", zIndex: 9999, background: "var(--app-card)", border: "1px solid var(--app-border)", padding: "16px 24px", borderRadius: 12, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}
          >
            {toastMsg.type === "success" ? <CheckCircle2 size={24} color={TOKENS.success} /> : toastMsg.type === "info" ? <RotateCcw size={24} color={TOKENS.sync} /> : <AlertCircle size={24} color={TOKENS.warning} />}
            <div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)", letterSpacing: "-0.01em" }}>{toastMsg.title}</p>
              <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", marginTop: 2 }}>{toastMsg.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LEFT PANE: INBOX ── */}
      <div style={{ width: 380, borderRight: "1px solid var(--app-border)", background: TOKENS.bg, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        
        {/* Inbox Header */}
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid var(--app-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h1 style={{ fontSize: "18px", fontWeight: 700, color: TOKENS.textPrimary, letterSpacing: "-0.01em" }}>Review Inbox</h1>
            <button onClick={() => setHistoryOpen(true)} style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "12px", fontWeight: 600, color: TOKENS.textMuted }}>
              <History size={14} /> Sync History
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setFilter("pending")} style={{ padding: "6px 12px", borderRadius: 99, background: filter === "pending" ? "var(--app-text-primary)" : "var(--app-border)", color: filter === "pending" ? "var(--app-card)" : TOKENS.textPrimary, border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                Needs Review ({inboxItems.filter(i => i.status !== "completed").length})
              </button>
              <button onClick={() => setFilter("completed")} style={{ padding: "6px 12px", borderRadius: 99, background: filter === "completed" ? "var(--app-text-primary)" : "var(--app-border)", color: filter === "completed" ? "var(--app-card)" : TOKENS.textPrimary, border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                Completed
              </button>
            </div>
            
            {filter === "pending" && (
              <button 
                onClick={() => setStackMode(!stackMode)}
                style={{ padding: "6px 10px", borderRadius: 6, background: stackMode ? "rgba(37,99,235,0.1)" : "transparent", color: stackMode ? TOKENS.sync : TOKENS.textMuted, border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                <Layers size={14} /> Stack Mode
              </button>
            )}
          </div>
        </div>

        {/* Inbox List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const isActive = !stackMode && activeId === item.id;
              const isSelectedInStack = stackMode && stackSelection.has(item.id);
              
              return (
                <motion.div 
                  key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                  onClick={() => stackMode ? toggleStackItem(item.id, {stopPropagation:()=> {}} as any) : setActiveId(item.id)}
                  style={{ 
                    padding: "16px", borderRadius: 12, cursor: "pointer", marginBottom: 8, position: "relative",
                    background: (isActive || isSelectedInStack) ? "var(--app-border)" : "transparent",
                    boxShadow: (isActive || isSelectedInStack) ? "inset 0 0 0 1px var(--app-border-glow)" : "none",
                    transition: "all 0.1s ease"
                  }}
                >
                  {stackMode && (
                    <div style={{ position: "absolute", top: 16, right: 16 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 4, border: isSelectedInStack ? "none" : "1px solid var(--app-border)", background: isSelectedInStack ? TOKENS.sync : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isSelectedInStack && <Check size={12} color="var(--app-card)" strokeWidth={3} />}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {item.status === "unread" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: TOKENS.brand }} />}
                      <span style={{ fontSize: "13px", fontWeight: 600, color: TOKENS.textPrimary }}>{item.author}</span>
                    </div>
                    <span style={{ fontSize: "11px", color: TOKENS.textMuted, fontFamily: TOKENS.fontMono, paddingRight: stackMode ? 24 : 0 }}>{item.time}</span>
                  </div>
                  
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: TOKENS.textPrimary, marginBottom: 8, lineHeight: 1.4, letterSpacing: "-0.01em", paddingRight: stackMode ? 24 : 0 }}>{item.title}</h3>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {item.tags.map(tag => (
                        <span key={tag} style={{ fontSize: "10px", fontWeight: 650, color: TOKENS.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", padding: "2px 6px", background: "var(--app-border)", borderRadius: 4 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    {item.priority === "urgent" && item.status !== "completed" && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: TOKENS.danger }}>
                        <AlertCircle size={12} strokeWidth={2.5} />
                        <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Urgent</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT PANE: DETAIL VIEW ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        
        {activeItemsToRender.length > 0 ? (
          <>
            {/* Detail Header */}
            <div style={{ padding: "32px 40px 24px", borderBottom: "1px solid var(--app-border)", background: TOKENS.bg, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                {isStacked ? (
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: TOKENS.sync, textTransform: "uppercase", letterSpacing: "0.06em" }}>Stack Review Mode</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--app-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: TOKENS.textPrimary }}>
                      {activeItemsToRender[0].initials}
                    </div>
                    <div>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: TOKENS.textPrimary, display: "block" }}>{activeItemsToRender[0].author}</span>
                      <span style={{ fontSize: "12px", color: TOKENS.textMuted }}>{activeItemsToRender[0].status === "completed" ? "Review Completed" : `Requested review ${activeItemsToRender[0].time}`}</span>
                    </div>
                  </div>
                )}
                <h2 style={{ fontSize: "28px", fontWeight: 750, color: TOKENS.textPrimary, letterSpacing: "-0.02em" }}>
                  {isStacked ? `Auditing ${activeItemsToRender.length} Lessons` : activeItemsToRender[0].title}
                </h2>
              </div>
              
              {!isStacked && (
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {activeItemsToRender[0].status !== "completed" && (
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "11px", fontWeight: 650, color: TOKENS.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", display: "block" }}>Deadline</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: activeItemsToRender[0].priority === "urgent" ? TOKENS.danger : TOKENS.textPrimary }}>{activeItemsToRender[0].deadline}</span>
                    </div>
                  )}
                  <button onClick={() => setPreviewModalOpen(true)} style={{ padding: "8px 16px", borderRadius: 8, background: "var(--app-border)", border: "none", fontSize: "13px", fontWeight: 600, color: TOKENS.textPrimary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "background 0.2s" }}>
                    <Maximize2 size={14} /> Full Preview
                  </button>
                </div>
              )}
            </div>

            {/* Static Slide Matrix (Scrollable) */}
            <div style={{ flex: 1, overflowY: "auto", padding: "40px", paddingBottom: "160px" }}>
              <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
                
                {activeItemsToRender.map((lesson, lIdx) => (
                  <div key={lesson.id} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {isStacked && (
                      <div style={{ paddingBottom: 16, borderBottom: "2px solid var(--app-border-glow)", marginBottom: 8 }}>
                        <h3 style={{ fontSize: "18px", fontWeight: 750, color: TOKENS.textPrimary }}>{lesson.title}</h3>
                        <span style={{ fontSize: "13px", color: TOKENS.textMuted }}>by {lesson.author}</span>
                      </div>
                    )}
                    
                    {MOCK_SLIDES.map((slide, index) => {
                      const uid = `${lesson.id}_${slide.id}`;
                      const isSelected = selectedSlide === uid;
                      return (
                        <div key={uid} style={{ display: "flex", gap: 24 }}>
                          <div style={{ width: 40, textAlign: "right", paddingTop: 16 }}>
                            <span style={{ fontFamily: TOKENS.fontMono, fontSize: "12px", color: TOKENS.textMuted }}>{(index + 1).toString().padStart(2, '0')}</span>
                          </div>
                          
                          {/* Slide Card */}
                          <motion.div 
                            onClick={() => lesson.status !== "completed" && setSelectedSlide(isSelected ? null : uid)}
                            whileHover={lesson.status !== "completed" ? { y: -2 } : {}}
                            style={{ 
                              flex: 1, background: TOKENS.bg, borderRadius: 12, padding: "24px", cursor: lesson.status !== "completed" ? "pointer" : "default",
                              boxShadow: isSelected ? "0 0 0 2px #141210" : TOKENS.border,
                              transition: "box-shadow 0.2s ease"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                              <span style={{ fontSize: "11px", fontWeight: 700, color: TOKENS.brand, textTransform: "uppercase", letterSpacing: "0.04em", padding: "4px 8px", background: "rgba(255,107,0,0.08)", borderRadius: 4 }}>{slide.type}</span>
                              {lesson.status !== "completed" && (
                                <button style={{ background: "transparent", border: "none", cursor: "pointer", color: TOKENS.textMuted }}>
                                  <Flag size={14} />
                                </button>
                              )}
                            </div>
                            <h4 style={{ fontSize: "16px", fontWeight: 700, color: TOKENS.textPrimary, marginBottom: 8, letterSpacing: "-0.01em" }}>{slide.title}</h4>
                            <p style={{ fontSize: "14px", color: TOKENS.textMuted, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{slide.content}</p>

                            {/* Inline Feedback Panel */}
                            <AnimatePresence>
                              {isSelected && lesson.status !== "completed" && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 24 }} exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                  style={{ overflow: "hidden" }}
                                >
                                  <div style={{ paddingTop: 20, borderTop: "1px solid var(--app-border)" }} onClick={e => e.stopPropagation()}>
                                    <span style={{ fontSize: "12px", fontWeight: 650, color: TOKENS.textPrimary, display: "block", marginBottom: 8 }}>Leave feedback on this slide:</span>
                                    <textarea 
                                      placeholder="E.g., The explanation in step 2 might be confusing..."
                                      style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-bg)", fontSize: "13px", fontFamily: "inherit", minHeight: 80, resize: "vertical" }}
                                    />
                                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                                      <button style={{ padding: "6px 12px", borderRadius: 6, background: "var(--app-card)", border: "1px solid var(--app-border)", color: "var(--app-text-primary)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Save Note</button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky Action Bar */}
            {activeItemsToRender.some(i => i.status !== "completed") && (
              <motion.div 
                initial={{ y: 100 }} animate={{ y: 0 }}
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 40px", background: "var(--app-bg)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderTop: "1px solid var(--app-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 650, color: TOKENS.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>Quality Rating</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <button 
                          key={n} onClick={() => setScore(n)}
                          style={{ width: 28, height: 28, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, fontFamily: TOKENS.fontMono, border: "none", cursor: "pointer", background: score === n ? "var(--app-text-primary)" : "transparent", color: score === n ? "var(--app-card)" : TOKENS.textMuted }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={handleSummarize} disabled={summarizeLoading} style={{ padding: "12px 20px", borderRadius: 8, background: "var(--app-card)", border: "1px solid var(--app-border)", fontSize: "14px", fontWeight: 600, color: TOKENS.textPrimary, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                    {summarizeLoading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
                    {summarizeLoading ? "Analyzing..." : "Summarize Feedback"}
                  </button>
                  <div style={{ width: 1, height: 44, background: "var(--app-border)", margin: "0 4px" }} />
                  <button onClick={() => setProvokeModalOpen(true)} style={{ padding: "12px 20px", borderRadius: 8, background: TOKENS.provoke, border: "none", fontSize: "14px", fontWeight: 600, color: "var(--app-text-primary)", cursor: "pointer" }}>
                    Provoke Staging
                  </button>
                  <button onClick={() => handleDecision("sync")} style={{ padding: "12px 20px", borderRadius: 8, background: TOKENS.sync, border: "none", fontSize: "14px", fontWeight: 600, color: "var(--app-text-primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} /> Approve & Sync
                  </button>
                </div>
              </motion.div>
            )}

          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: TOKENS.textMuted }}>
            <Layers size={48} strokeWidth={1} style={{ marginBottom: 16, opacity: 0.5 }} />
            <p style={{ fontSize: "14px", fontWeight: 500 }}>Select lessons to review.</p>
          </div>
        )}
      </div>

      {/* ── SYNC HISTORY PANEL ── */}
      <AnimatePresence>
        {historyOpen && (
          <motion.div 
            initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 420, background: TOKENS.bg, boxShadow: "-24px 0 64px rgba(0,0,0,0.1)", zIndex: 1000, borderLeft: "1px solid var(--app-border)", display: "flex", flexDirection: "column" }}
          >
            <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--app-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: TOKENS.textPrimary, letterSpacing: "-0.01em" }}>Sync History</h2>
              <button onClick={() => setHistoryOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: TOKENS.textMuted }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {syncHistory.length === 0 ? (
                <p style={{ fontSize: "13px", color: TOKENS.textMuted, textAlign: "center", marginTop: 40 }}>No sync history available.</p>
              ) : syncHistory.map(sync => (
                <div key={sync.id} style={{ padding: "20px", borderRadius: 12, border: "1px solid var(--app-border)", background: sync.status === "reverted" ? "var(--app-border)" : "var(--app-card)", opacity: sync.status === "reverted" ? 0.6 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {sync.status === "synced" ? <CheckCircle2 size={14} color={TOKENS.sync} /> : <RotateCcw size={14} color={TOKENS.textMuted} />}
                      <span style={{ fontSize: "11px", fontWeight: 700, color: sync.status === "synced" ? TOKENS.sync : TOKENS.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        {sync.status === "synced" ? "Synced to DB" : "Reverted"}
                      </span>
                    </div>
                    <span style={{ fontSize: "11px", color: TOKENS.textMuted, fontFamily: TOKENS.fontMono }}>{sync.syncedAt}</span>
                  </div>
                  <h4 style={{ fontSize: "15px", fontWeight: 700, color: TOKENS.textPrimary, marginBottom: 4 }}>{sync.title}</h4>
                  <p style={{ fontSize: "13px", color: TOKENS.textMuted, marginBottom: 16 }}>Author: {sync.author}</p>
                  
                  {sync.status === "synced" && (
                    <button 
                      onClick={() => handleRevertSync(sync.id, sync.title)}
                      style={{ padding: "6px 12px", borderRadius: 6, background: "rgba(220,38,38,0.1)", color: TOKENS.danger, border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <RotateCcw size={14} /> Revert Sync
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SUMMARIZE FEEDBACK MODAL ── */}
      <AnimatePresence>
        {summaryModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--app-text-secondary)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} style={{ width: "100%", maxWidth: 600, background: "var(--app-card)", borderRadius: 24, boxShadow: "0 24px 48px rgba(0,0,0,0.1)", overflow: "hidden" }}>
              <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--app-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,107,0,0.1)", color: TOKENS.brand, display: "flex", alignItems: "center", justifyContent: "center" }}><Brain size={20} /></div>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: TOKENS.textPrimary }}>AI Feedback Summary</h3>
                    <p style={{ fontSize: "13px", color: TOKENS.textMuted }}>Synthesizing your slide notes...</p>
                  </div>
                </div>
                <button onClick={() => setSummaryModalOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: TOKENS.textMuted }}><X size={20} /></button>
              </div>
              <div style={{ padding: 32 }}>
                <textarea defaultValue={`Overall, the lesson is strong, but there are a few areas that need refinement before staging:\n\n1. Slide 2: The explanation of the formula coefficients is slightly confusing. Please reword to clarify the difference between 'b' and 'c'.\n2. Slide 4: The distractor options in the MCQ are too obvious. Make them mathematically plausible mistakes.\n\nOnce these are addressed, I'm happy to approve.`} style={{ width: "100%", height: 160, padding: 16, borderRadius: 12, border: "1px solid var(--app-border)", background: "var(--app-bg)", fontSize: "14px", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }} />
              </div>
              <div style={{ padding: "20px 32px", background: "var(--app-bg)", borderTop: "1px solid var(--app-border)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button onClick={() => setSummaryModalOpen(false)} style={{ padding: "10px 16px", borderRadius: 8, background: "transparent", border: "none", fontSize: "13px", fontWeight: 600, color: TOKENS.textPrimary, cursor: "pointer" }}>Cancel</button>
                <button onClick={() => { setSummaryModalOpen(false); setProvokeStatement("Overall, the lesson is strong, but there are a few areas that need refinement before staging:\n\n1. Slide 2: The explanation of the formula coefficients is slightly confusing. Please reword to clarify the difference between 'b' and 'c'.\n2. Slide 4: The distractor options in the MCQ are too obvious. Make them mathematically plausible mistakes.\n\nOnce these are addressed, I'm happy to approve."); setProvokeModalOpen(true); }} style={{ padding: "10px 16px", borderRadius: 8, background: TOKENS.provoke, border: "none", fontSize: "13px", fontWeight: 600, color: "var(--app-text-primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  <Send size={14} /> Provoke Staging
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PROVOKE STATEMENT MODAL ── */}
      <AnimatePresence>
        {provokeModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--app-text-secondary)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} style={{ width: "100%", maxWidth: 520, background: "var(--app-card)", borderRadius: 24, boxShadow: "0 24px 48px rgba(0,0,0,0.1)", overflow: "hidden" }}>
              <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--app-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: TOKENS.danger, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertCircle size={18} /> Provoke Staging
                  </h3>
                  <p style={{ fontSize: "13px", color: TOKENS.textMuted, marginTop: 4 }}>A statement is required to explain what needs editing.</p>
                </div>
                <button onClick={() => setProvokeModalOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: TOKENS.textMuted }}><X size={20} /></button>
              </div>
              <div style={{ padding: 32 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: TOKENS.textPrimary, marginBottom: 8 }}>Provoke Statement *</label>
                <textarea 
                  value={provokeStatement}
                  onChange={(e) => setProvokeStatement(e.target.value)}
                  placeholder="Explain exactly what the problem is and how to fix it..."
                  style={{ width: "100%", height: 140, padding: 16, color: TOKENS.textPrimary, borderRadius: 12, border: "1px solid var(--app-border)", background: "var(--app-bg)", fontSize: "14px", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }} 
                  required
                />
              </div>
              <div style={{ padding: "20px 32px", background: "var(--app-bg)", borderTop: "1px solid var(--app-border)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button onClick={() => setProvokeModalOpen(false)} style={{ padding: "10px 16px", borderRadius: 8, background: "transparent", border: "none", fontSize: "13px", fontWeight: 600, color: TOKENS.textPrimary, cursor: "pointer" }}>Cancel</button>
                <button 
                  onClick={handleProvokeSubmit} 
                  disabled={!provokeStatement.trim()}
                  style={{ padding: "10px 16px", borderRadius: 8, background: TOKENS.provoke, border: "none", fontSize: "13px", fontWeight: 600, color: "var(--app-text-primary)", cursor: provokeStatement.trim() ? "pointer" : "not-allowed", opacity: provokeStatement.trim() ? 1 : 0.5, display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Send size={14} /> Send Statement & Provoke
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ── FULL PREVIEW MODAL ── */}
      <AnimatePresence>
        {previewModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--app-card)", border: "1px solid var(--app-border)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--app-text-primary)" }}>
              <div>
                <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.5)" }}>Full Preview</span>
                <h2 style={{ fontSize: "20px", fontWeight: 700, marginTop: 4 }}>{activeItemsToRender[0]?.title}</h2>
              </div>
              <button onClick={() => setPreviewModalOpen(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", width: 40, height: 40, borderRadius: "50%", color: "var(--app-text-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, position: "relative" }}>
              <button onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))} style={{ position: "absolute", left: 40, background: "rgba(255,255,255,0.1)", border: "none", width: 56, height: 56, borderRadius: "50%", color: previewIndex === 0 ? "rgba(255,255,255,0.2)" : "var(--app-card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: previewIndex === 0 ? "default" : "pointer" }}><ChevronRight size={32} style={{ transform: "rotate(180deg)" }} /></button>
              <AnimatePresence mode="wait">
                <motion.div key={previewIndex} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.2 }} style={{ width: 900, height: 560, background: "var(--app-card)", borderRadius: 24, padding: 60, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
                  <span style={{ fontSize: "13px", fontWeight: 750, color: TOKENS.brand, textTransform: "uppercase", letterSpacing: "0.06em", padding: "6px 12px", background: "rgba(255,107,0,0.08)", borderRadius: 6, marginBottom: 24 }}>{MOCK_SLIDES[previewIndex].type}</span>
                  <h3 style={{ fontSize: "36px", fontWeight: 750, color: TOKENS.textPrimary, marginBottom: 24, letterSpacing: "-0.02em" }}>{MOCK_SLIDES[previewIndex].title}</h3>
                  <p style={{ fontSize: "22px", color: TOKENS.textMuted, lineHeight: 1.6, maxWidth: 700 }}>{MOCK_SLIDES[previewIndex].content}</p>
                  <div style={{ marginTop: 80, display: "flex", gap: 8 }}>{MOCK_SLIDES.map((_, i) => (<div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === previewIndex ? TOKENS.brand : "var(--app-border)", transition: "background 0.3s" }} />))}</div>
                </motion.div>
              </AnimatePresence>
              <button onClick={() => setPreviewIndex(Math.min(MOCK_SLIDES.length - 1, previewIndex + 1))} style={{ position: "absolute", right: 40, background: "rgba(255,255,255,0.1)", border: "none", width: 56, height: 56, borderRadius: "50%", color: previewIndex === MOCK_SLIDES.length - 1 ? "rgba(255,255,255,0.2)" : "var(--app-card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: previewIndex === MOCK_SLIDES.length - 1 ? "default" : "pointer" }}><ChevronRight size={32} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
