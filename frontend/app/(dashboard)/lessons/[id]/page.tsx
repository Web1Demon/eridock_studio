"use client";

import { StudentSimulatorModal } from "@/components/dashboard/StudentSimulatorModal";
import { AiCoTeacherPanel } from "@/components/dashboard/AiCoTeacherPanel";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Plus, Eye, Check, BookOpen, Globe, Star, CheckSquare,
  Type, Shuffle, CheckCircle2, List, Zap, Flag, X, Trash2, Copy,
  ChevronDown, ChevronRight, Clock, AlertCircle, UploadCloud,
  Layers, RefreshCw, Sparkles, History, Hash, MoreHorizontal,
  FolderOpen, File, Image, Lightbulb, Target, AlignLeft,
  Video, Link2, Table2, Quote, Award, Clipboard, Mic,
  Brain, MessageCircle, PenLine, GitBranch, Users, Send,
  CheckCheck, Ellipsis, ChevronUp, Lock, Unlock, Play
} from "lucide-react";

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */
type SlideType =
  | "concept" | "local_context" | "spotlight" | "formula"
  | "worked_example" | "analogy" | "teacher_note"
  | "multiple_choice" | "fill_blank" | "match_it"
  | "true_false" | "order_it" | "knowledge_burst";

type Theme = "minimal" | "midnight" | "sunset" | "ocean" | "forest";

interface MCQOption { id: string; text: string; isCorrect: boolean; explanation: string; }
interface MatchPair { id: string; left: string; right: string; }
interface OrderStep { id: string; text: string; }

interface Slide {
  id: string; type: SlideType; title: string;
  subtitle?: string; duration?: number;
  content?: string; highlight?: string; imageUrl?: string;
  question?: string; options?: MCQOption[];
  hint?: string; hintAiSuggestion?: string;
  difficulty?: "easy" | "medium" | "hard";
  sentence?: string; blankAnswer?: string; blankExplanation?: string;
  pairs?: MatchPair[]; steps?: OrderStep[];
  theme?: Theme; accentColor?: string;
  learningObjectives?: string[];
  teacherNotes?: string;
  aiProofread?: "clean" | "issues" | null;
  aiIssues?: string[];
}

interface TopicLesson {
  id: string; type: "lesson";
  title: string; slides: Slide[]; isExpanded?: boolean;
}
interface TopicCheckpoint {
  id: string; type: "checkpoint";
  title: string; slides: Slide[]; isExpanded?: boolean;
}
type LevelItem = TopicLesson | TopicCheckpoint;

interface TopicLevel {
  id: string; title: string;
  items: LevelItem[]; isExpanded?: boolean;
}

type WorkflowStatus = "draft" | "staged" | "published";

interface Collaborator {
  id: string; name: string; initials: string; color: string; isMe: boolean;
  lastAction?: string;
}

type ActiveSelection = {
  type: "level" | "lesson" | "checkpoint" | "slide" | null;
  levelId?: string; itemId?: string; slideId?: string;
};

/* ═══════════════════════════════════════════════
   SLIDE CONFIGURATION
═══════════════════════════════════════════════ */
const SLIDE_CONF: Record<SlideType, {
  label: string; desc: string; icon: any;
  isActive: boolean; color: string; bg: string;
  category: "passive" | "active";
}> = {
  concept:         { label: "Concept Card",     desc: "Introduce a key idea or definition",         icon: BookOpen,     isActive: false, color: "#FF6B00", bg: "rgba(255,107,0,0.07)",  category: "passive" },
  local_context:   { label: "Local Context",    desc: "Nigerian real-world application",             icon: Globe,        isActive: false, color: "#16A34A", bg: "rgba(22,163,74,0.07)",  category: "passive" },
  spotlight:       { label: "Formula Spotlight",desc: "Highlight a formula or key rule",             icon: Star,         isActive: false, color: "#7C3AED", bg: "rgba(124,58,237,0.07)", category: "passive" },
  formula:         { label: "Formula Card",     desc: "Step-by-step formula breakdown",              icon: Hash,         isActive: false, color: "#0891B2", bg: "rgba(8,145,178,0.07)",  category: "passive" },
  worked_example:  { label: "Worked Example",   desc: "Walk through a solved problem",               icon: PenLine,      isActive: false, color: "#D97706", bg: "rgba(217,119,6,0.07)",  category: "passive" },
  analogy:         { label: "Analogy",          desc: "Connect new concept to familiar idea",        icon: Brain,        isActive: false, color: "#DB2777", bg: "rgba(219,39,119,0.07)", category: "passive" },
  teacher_note:    { label: "Teacher Note",     desc: "Pedagogy tips & classroom guidance",          icon: MessageCircle,isActive: false, color: "#6B7280", bg: "rgba(107,114,128,0.07)", category: "passive" },
  multiple_choice: { label: "Multiple Choice",  desc: "4-option MCQ with explanations",             icon: CheckSquare,  isActive: true,  color: "#2563EB", bg: "rgba(37,99,235,0.07)",  category: "active" },
  fill_blank:      { label: "Fill the Blank",   desc: "Complete the sentence",                       icon: Type,         isActive: true,  color: "#0891B2", bg: "rgba(8,145,178,0.07)",  category: "active" },
  match_it:        { label: "Match It",         desc: "Drag and connect concepts",                   icon: Shuffle,      isActive: true,  color: "#D97706", bg: "rgba(217,119,6,0.07)",  category: "active" },
  true_false:      { label: "True or False",    desc: "Binary decision question",                    icon: CheckCircle2, isActive: true,  color: "#059669", bg: "rgba(5,150,105,0.07)",  category: "active" },
  order_it:        { label: "Order It",         desc: "Arrange steps in correct sequence",           icon: List,         isActive: true,  color: "#EA580C", bg: "rgba(234,88,12,0.07)",  category: "active" },
  knowledge_burst: { label: "Knowledge Burst",  desc: "3-question rapid-fire mini quiz",             icon: Zap,          isActive: true,  color: "#7C3AED", bg: "rgba(124,58,237,0.07)", category: "active" },
};

const CHECKPOINT_SLIDE_TYPES: SlideType[] = ["multiple_choice", "true_false", "fill_blank", "match_it", "order_it", "knowledge_burst"];

const MOCK_COLLABORATORS: Collaborator[] = [
  { id: "u1", name: "Chidi Madu", initials: "CM", color: "#FF6B00", isMe: true, lastAction: "editing slide 3" },
  { id: "u2", name: "Sarah James", initials: "SJ", color: "#818CF8", isMe: false, lastAction: "viewing Level 2" },
];

function uid() { return `id_${Date.now()}_${Math.random().toString(36).slice(2,6)}`; }
function oid() { return `o_${Date.now()}_${Math.random().toString(36).slice(2,6)}`; }

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function TopicBuilderPage() {
  const router = useRouter();
  const [levels, setLevels] = useState<TopicLevel[]>([]);
  const [activeSelection, setActiveSelection] = useState<ActiveSelection>({ type: null });
  const [collaborators] = useState<Collaborator[]>(MOCK_COLLABORATORS);
  const [showCollabToast, setShowCollabToast] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [stageModal, setStageModal] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [status, setStatus] = useState<WorkflowStatus>("draft");
  const [saved, setSaved] = useState(true);
  const [showCollabNames, setShowCollabNames] = useState(false);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{title: string, desc: string, type: "error"|"success"} | null>(null);
  
  // Live Cursors Mock
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);


  useEffect(() => {
    if (showCollabToast) {
      const t = setTimeout(() => setShowCollabToast(false), 6000);
      return () => clearTimeout(t);
    }
  }, [showCollabToast]);

  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  const allSlides = levels.flatMap(l => l.items.flatMap(i => i.slides));
  const activeSlideCount = allSlides.filter(s => SLIDE_CONF[s.type]?.isActive).length;
  const activePct = allSlides.length ? Math.round((activeSlideCount / allSlides.length) * 100) : 0;
  const ratioOk = activePct >= 65 && activePct <= 80;

  const triggerSave = () => { setSaved(false); setTimeout(() => setSaved(true), 900); };

  /* --- State Mutators --- */
  const addLevel = () => {
    const l: TopicLevel = { id: uid(), title: `Level ${levels.length + 1}`, items: [], isExpanded: true };
    setLevels(p => [...p, l]);
    setActiveSelection({ type: "level", levelId: l.id });
    triggerSave();
  };

  const addItem = (levelId: string, type: "lesson" | "checkpoint") => {
    const item: LevelItem = type === "lesson"
      ? { id: uid(), type: "lesson", title: "New Lesson", slides: [], isExpanded: true }
      : { id: uid(), type: "checkpoint", title: `Checkpoint`, slides: [], isExpanded: true };
    setLevels(p => p.map(l => l.id === levelId ? { ...l, isExpanded: true, items: [...l.items, item] } : l));
    setActiveSelection({ type, levelId, itemId: item.id });
    triggerSave();
  };

  const addSlide = (type: SlideType) => {
    setPickerOpen(false);
    if (!activeSelection.levelId || !activeSelection.itemId) return;
    const slide: Slide = {
      id: uid(), type, title: "",
      options: (type === "multiple_choice") ? [
        { id: oid(), text: "", isCorrect: false, explanation: "" },
        { id: oid(), text: "", isCorrect: false, explanation: "" },
        { id: oid(), text: "", isCorrect: false, explanation: "" },
        { id: oid(), text: "", isCorrect: false, explanation: "" },
      ] : (type === "true_false") ? [
        { id: oid(), text: "True", isCorrect: false, explanation: "" },
        { id: oid(), text: "False", isCorrect: false, explanation: "" },
      ] : undefined,
      pairs: type === "match_it" ? [
        { id: oid(), left: "", right: "" },
        { id: oid(), left: "", right: "" },
        { id: oid(), left: "", right: "" },
      ] : undefined,
      steps: type === "order_it" ? [
        { id: oid(), text: "First step" },
        { id: oid(), text: "Second step" },
        { id: oid(), text: "Third step" },
      ] : undefined,
      difficulty: "medium",
    };
    setLevels(p => p.map(l => l.id === activeSelection.levelId ? {
      ...l, items: l.items.map(i => i.id === activeSelection.itemId ? {
        ...i, isExpanded: true, slides: [...i.slides, slide]
      } : i)
    } : l));
    setActiveSelection({ type: "slide", levelId: activeSelection.levelId, itemId: activeSelection.itemId, slideId: slide.id });
    triggerSave();
  };

  const updateLevel = (id: string, patch: Partial<TopicLevel>) => {
    setLevels(p => p.map(l => l.id === id ? { ...l, ...patch } : l)); triggerSave();
  };
  const updateItem = (lId: string, iId: string, patch: Partial<LevelItem>) => {
    setLevels(p => p.map(l => l.id === lId ? { ...l, items: l.items.map(i => i.id === iId ? { ...i, ...patch } as LevelItem : i) } : l)); triggerSave();
  };
  const updateSlide = (lId: string, iId: string, sId: string, patch: Partial<Slide>) => {
    setLevels(p => p.map(l => l.id === lId ? { ...l, items: l.items.map(i => i.id === iId ? { ...i, slides: i.slides.map(s => s.id === sId ? { ...s, ...patch } : s) } : i) } : l)); triggerSave();
  };

  const deleteSelection = () => {
    if (activeSelection.type === "slide") {
      setLevels(p => p.map(l => l.id === activeSelection.levelId ? { ...l, items: l.items.map(i => i.id === activeSelection.itemId ? { ...i, slides: i.slides.filter(s => s.id !== activeSelection.slideId) } : i) } : l));
      const parent = levels.find(l => l.id === activeSelection.levelId)?.items.find(i => i.id === activeSelection.itemId);
      setActiveSelection({ type: parent?.type as any, levelId: activeSelection.levelId, itemId: activeSelection.itemId });
    } else if (activeSelection.type === "lesson" || activeSelection.type === "checkpoint") {
      setLevels(p => p.map(l => l.id === activeSelection.levelId ? { ...l, items: l.items.filter(i => i.id !== activeSelection.itemId) } : l));
      setActiveSelection({ type: "level", levelId: activeSelection.levelId });
    } else if (activeSelection.type === "level") {
      setLevels(p => p.filter(l => l.id !== activeSelection.levelId));
      setActiveSelection({ type: null });
    }
    triggerSave();
  };

  const duplicateSlide = (lId: string, iId: string, sId: string) => {
    setLevels(p => p.map(l => l.id !== lId ? l : { ...l, items: l.items.map(i => {
      if (i.id !== iId) return i;
      const idx = i.slides.findIndex(s => s.id === sId);
      if (idx === -1) return i;
      const dup = { ...i.slides[idx], id: uid(), title: i.slides[idx].title + " (copy)" };
      const next = [...i.slides]; next.splice(idx + 1, 0, dup);
      return { ...i, slides: next };
    })}));
  };

  const activeLevel = levels.find(l => l.id === activeSelection.levelId);
  const activeItem = activeLevel?.items.find(i => i.id === activeSelection.itemId);
  const activeSlide = activeItem?.slides.find(s => s.id === activeSelection.slideId);
  const isCheckpoint = activeItem?.type === "checkpoint";

  const me = collaborators.find(c => c.isMe)!;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--app-bg)", fontFamily: "'Inter', -apple-system, sans-serif", overflow: "hidden", position: "relative" }}>
      
      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 50, x: "-50%" }}
            style={{ position: "fixed", bottom: 100, left: "50%", zIndex: 9999, background: "var(--app-card)", border: "1px solid var(--app-border)", padding: "16px 24px", borderRadius: 12, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}
          >
            {toastMsg.type === "success" ? <CheckCircle2 size={24} color="#16A34A" /> : <AlertCircle size={24} color="#DC2626" />}
            <div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)", letterSpacing: "-0.01em" }}>{toastMsg.title}</p>
              <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", marginTop: 2 }}>{toastMsg.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Cursors Mock */}
      <div id="live-cursors" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
        {collaborators.filter(c => !c.isMe).map((c, i) => (
          <motion.div
            key={c.id}
            animate={{ x: mousePos.x + (i + 1) * 40, y: mousePos.y + (i + 1) * 30 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.5 }}
            style={{ position: "absolute", top: 0, left: 0, display: "flex", flexDirection: "column" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={c.color} xmlns="http://www.w3.org/2000/svg">
              <path d="M5.5 3L18.5 13L12 14L10 20L5.5 3Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <div style={{ background: c.color, color: "var(--app-text-primary)", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: 4, marginTop: -4, marginLeft: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              {c.name.split(' ')[0]}
            </div>
          </motion.div>
        ))}
      </div>

      {/* COLLABORATOR TOAST */}
      <AnimatePresence>
        {showCollabToast && (
          <motion.div initial={{ opacity: 0, y: -24, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -24, x: "-50%" }}
            style={{ position: "fixed", top: 64, left: "50%", zIndex: 2000, background: "var(--app-card)", border: "1px solid var(--app-border)", color: "var(--app-text-primary)", padding: "10px 18px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#818CF8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>SJ</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: 1 }}>Sarah James joined</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>Now editing Level 2 → Lesson 1</p>
            </div>
            <button onClick={() => setShowCollabToast(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", marginLeft: 4 }}><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP BAR */}
      <TopBar
        onSimulate={() => setSimulatorOpen(true)}
        onToggleAi={() => setAiPanelOpen(v => !v)}
        status={status} saved={saved} activePct={activePct} ratioOk={ratioOk}
        collaborators={collaborators} showCollabNames={showCollabNames}
        onToggleCollabNames={() => setShowCollabNames(v => !v)}
        onHistory={() => setHistoryOpen(v => !v)}
        onStage={() => {
          if (allSlides.length === 0) {
            setToastMsg({ title: "Validation Error", desc: "Cannot stage an empty lesson. Add at least one slide.", type: "error" });
            return;
          }
          setStageModal(true);
        }}
        onBack={() => router.push("/lessons")}
      />

      {/* 3-PANEL LAYOUT */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        
        {/* LEFT NAVIGATOR */}
        <TreeNavigator
          levels={levels} sel={activeSelection}
          onSelect={setActiveSelection}
          onToggleLevel={(id: string) => updateLevel(id, { isExpanded: !levels.find(l => l.id === id)?.isExpanded })}
          onToggleItem={(lId: string, iId: string) => updateItem(lId, iId, { isExpanded: !levels.find(l => l.id === lId)?.items.find(i => i.id === iId)?.isExpanded })}
          onAddLevel={addLevel}
          onAddItem={addItem}
          onPickSlide={(lId: string, iId: string) => {
            const item = levels.find(l => l.id === lId)?.items.find(i => i.id === iId);
            setActiveSelection({ type: item?.type as any, levelId: lId, itemId: iId });
            setPickerOpen(true);
          }}
        />

        {/* CENTER CANVAS */}
        <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          {/* LIVE CURSOR: Other collaborator */}
          <motion.div
            animate={{ x: [120, 180, 140, 220, 150], y: [90, 60, 140, 100, 80] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            style={{ position: "absolute", zIndex: 100, pointerEvents: "none" }}>
            <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
              <path d="M0 0L18 12L10 13L6 22L0 0Z" fill="#818CF8"/>
            </svg>
            <div style={{ background: "#818CF8", color: "var(--app-text-primary)", fontSize: "10px", padding: "2px 7px", borderRadius: 4, fontWeight: 700, marginTop: 2, whiteSpace: "nowrap" }}>Sarah</div>
          </motion.div>

          <AnimatePresence mode="wait">
            {levels.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ height: "100%" }}>
                <BuilderEmptyState onAddLevel={addLevel} />
              </motion.div>
            ) : activeSelection.type === "level" && activeLevel ? (
              <motion.div key={`level-${activeLevel.id}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: "32px 28px", maxWidth: 780, margin: "0 auto" }}>
                <LevelOverviewPanel level={activeLevel} onUpdate={(p: Partial<TopicLevel>) => updateLevel(activeLevel.id, p)} onAddItem={(t: "lesson" | "checkpoint") => addItem(activeLevel.id, t)} onDelete={deleteSelection} />
              </motion.div>
            ) : (activeSelection.type === "lesson" || activeSelection.type === "checkpoint") && activeItem ? (
              <motion.div key={`item-${activeItem.id}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: "32px 28px", maxWidth: 780, margin: "0 auto" }}>
                <ItemOverviewPanel item={activeItem} onUpdate={(p: Partial<LevelItem>) => updateItem(activeSelection.levelId!, activeItem.id, p)} onAddSlide={() => setPickerOpen(true)} onDelete={deleteSelection} />
              </motion.div>
            ) : activeSelection.type === "slide" && activeSlide ? (
              <motion.div key={`slide-${activeSlide.id}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: "32px 28px", maxWidth: 800, margin: "0 auto" }}>
                <SlideEditorPanel
                  slide={activeSlide}
                  isInCheckpoint={isCheckpoint}
                  onUpdate={(p: Partial<Slide>) => updateSlide(activeSelection.levelId!, activeSelection.itemId!, activeSlide.id, p)}
                />
              </motion.div>
            ) : (
              <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", color: "var(--app-text-secondary)" }}>
                  <Layers size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
                  <p style={{ fontSize: "14px" }}>Select an item from the sidebar</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT PROPERTIES */}
        <AnimatePresence>
          {aiPanelOpen && (
            <AiCoTeacherPanel 
              slide={activeSelection.type === "slide" ? activeSlide : null} 
              onClose={() => setAiPanelOpen(false)} 
              onApplySuggestion={(s) => console.log("Applied", s)} 
            />
          )}
        </AnimatePresence>
{/* RIGHT PROPERTIES */}
        <AnimatePresence>
          {activeSelection.type === "slide" && activeSlide && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <PropertiesPanel
                slide={activeSlide}
                onUpdate={(p: Partial<Slide>) => updateSlide(activeSelection.levelId!, activeSelection.itemId!, activeSlide.id, p)}
                onDelete={deleteSelection}
                onDuplicate={() => duplicateSlide(activeSelection.levelId!, activeSelection.itemId!, activeSlide.id)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* OVERLAYS */}
      <AnimatePresence>
        {pickerOpen && (
          <SlideTypePicker
            isCheckpoint={isCheckpoint}
            onSelect={addSlide}
            onClose={() => setPickerOpen(false)}
          />
        )}
        {stageModal && (
          <StageConfirmModal
            me={me}
            onStage={() => { setStatus("staged"); setStageModal(false); }}
            onClose={() => setStageModal(false)}
          />
        )}
        {historyOpen && (
          <HistoryPanel me={me} onClose={() => setHistoryOpen(false)} />
        )}
        {simulatorOpen && (
          <StudentSimulatorModal activeSlides={allSlides} onClose={() => setSimulatorOpen(false)} />
        )}

      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TOP BAR
═══════════════════════════════════════════════ */
function TopBar({ status, saved, activePct, ratioOk, collaborators, showCollabNames, onToggleCollabNames, onHistory, onStage, onBack, onSimulate, onToggleAi }: any) {
  const statusColors: Record<string, string> = { draft: "#6B7280", staged: "#D97706", published: "#16A34A" };
  return (
    <div style={{ height: 52, background: "var(--app-card)", borderBottom: "1px solid var(--app-border)", display: "flex", alignItems: "center", padding: "0 14px", gap: 0, flexShrink: 0, zIndex: 50 }}>
      {/* Back */}
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)", fontSize: "13px", borderRadius: 8 }}>
        <ChevronLeft size={14} /> Lessons
      </button>
      <div style={{ width: 1, height: 20, background: "var(--app-border)", margin: "0 10px" }} />

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1 }}>
        <span style={{ fontSize: "12px", color: "var(--app-text-secondary)" }}>Mathematics</span>
        <ChevronRight size={10} style={{ color: "var(--app-border)" }} />
        <span style={{ fontSize: "13px", fontWeight: 650, color: "var(--app-text-primary)" }}>Quadratic Equations</span>
        <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: `${statusColors[status]}15`, color: statusColors[status], marginLeft: 4, textTransform: "uppercase", letterSpacing: "0.03em" }}>{status}</span>
      </div>

      {/* Activity Ratio */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: ratioOk ? "rgba(22,163,74,0.07)" : "rgba(245,158,11,0.08)", borderRadius: 8, marginRight: 12 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: ratioOk ? "#16A34A" : "#F59E0B" }} />
        <span style={{ fontSize: "12px", fontWeight: 650, color: ratioOk ? "#16A34A" : "#D97706" }}>{activePct}% interactive</span>
      </div>

      {/* Collaborators */}
      <div style={{ position: "relative", marginRight: 12 }}>
        <button onClick={onToggleCollabNames} style={{ display: "flex", alignItems: "center", gap: 0, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {collaborators.map((c: any, i: number) => (
            <div key={c.id} style={{ width: 28, height: 28, borderRadius: "50%", background: c.color, border: "2px solid #fff", marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--app-text-primary)", fontSize: "10px", fontWeight: 800, zIndex: i }}>
              {c.initials}
            </div>
          ))}
          <span style={{ marginLeft: 8, fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 600 }}>{collaborators.length}</span>
        </button>

        <AnimatePresence>
          {showCollabNames && (
            <motion.div initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.96 }}
              style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "var(--app-card)", border: "1px solid var(--app-border)", borderRadius: 14, padding: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: 220, zIndex: 100 }}>
              <p style={{ fontSize: "10px", fontWeight: 750, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Active Collaborators</p>
              {collaborators.map((c: any) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--app-border)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--app-text-primary)", fontSize: "11px", fontWeight: 800, flexShrink: 0 }}>{c.initials}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 650, color: "var(--app-text-primary)" }}>{c.name} {c.isMe && <span style={{ fontSize: "10px", color: "var(--app-text-secondary)" }}>(you)</span>}</p>
                    <p style={{ fontSize: "11px", color: "var(--app-text-secondary)" }}>{c.lastAction}</p>
                  </div>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A", flexShrink: 0 }} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Save + Actions */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "var(--app-text-secondary)", marginRight: 4 }}>{saved ? "Saved" : "Saving..."}</span>

        <button onClick={onSimulate} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px", height: 34, background: "rgba(124,58,237,0.08)", color: "#7C3AED", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 8, cursor: "pointer", fontSize: "13px", fontWeight: 650 }}><Play size={13} fill="currentColor" /> Simulate</button>
        <button onClick={onToggleAi} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px", height: 34, background: "rgba(147,51,234,0.08)", color: "#9333EA", border: "1px solid rgba(147,51,234,0.2)", borderRadius: 8, cursor: "pointer", fontSize: "13px", fontWeight: 650 }}><Sparkles size={13} /> AI Co-Teacher</button>
        <div style={{ width: 1, height: 20, background: "var(--app-border)", margin: "0 4px" }} />
        <button onClick={onHistory} style={{ width: 34, height: 34, border: "1px solid var(--app-border)", borderRadius: 8, background: "var(--app-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--app-text-secondary)" }}><History size={14} /></button>
        <button onClick={onStage} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", height: 34, background: "#FF6B00", color: "var(--app-text-primary)", border: "none", borderRadius: 8, cursor: "pointer", fontSize: "13px", fontWeight: 650 }}><UploadCloud size={13} /> Stage</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TREE NAVIGATOR
═══════════════════════════════════════════════ */
function TreeNavigator({ levels, sel, onSelect, onToggleLevel, onToggleItem, onAddLevel, onAddItem, onPickSlide }: any) {
  return (
    <div style={{ width: 256, background: "var(--app-card)", borderRight: "1px solid var(--app-border)", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
      {/* Header */}
      <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid var(--app-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "10.5px", fontWeight: 750, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--app-text-secondary)" }}>Content Tree</span>
        <button onClick={onAddLevel} style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6B00", padding: 2 }}><Plus size={14} /></button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
        {levels.length === 0 && (
          <div style={{ textAlign: "center", padding: "24px 12px", color: "var(--app-text-secondary)" }}>
            <Layers size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
            <p style={{ fontSize: "12px" }}>No levels yet</p>
          </div>
        )}
        {levels.map((lvl: TopicLevel) => (
          <div key={lvl.id} style={{ marginBottom: 4 }}>
            {/* Level Row */}
            <div
              onClick={() => onSelect({ type: "level", levelId: lvl.id })}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 8px", borderRadius: 9, cursor: "pointer", background: sel.levelId === lvl.id && sel.type === "level" ? "var(--app-border)" : "transparent", transition: "background 0.1s" }}>
              <button onClick={e => { e.stopPropagation(); onToggleLevel(lvl.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)", padding: 0, flexShrink: 0 }}>
                {lvl.isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
              <FolderOpen size={13} style={{ color: "var(--app-text-secondary)", flexShrink: 0 }} />
              <span style={{ fontSize: "12.5px", fontWeight: 650, color: "var(--app-text-primary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lvl.title}</span>
              <button onClick={e => { e.stopPropagation(); onAddItem(lvl.id, "lesson"); }} title="Add Lesson" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)", padding: 1 }}><Plus size={11} /></button>
            </div>

            {/* Items */}
            {lvl.isExpanded && (
              <div style={{ marginLeft: 20, borderLeft: "1px solid var(--app-border)", paddingLeft: 6, marginTop: 2 }}>
                {lvl.items.map(item => (
                  <div key={item.id} style={{ marginBottom: 2 }}>
                    <div
                      onClick={() => onSelect({ type: item.type, levelId: lvl.id, itemId: item.id })}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 6px", borderRadius: 7, cursor: "pointer", background: sel.itemId === item.id && (sel.type === "lesson" || sel.type === "checkpoint") ? (item.type === "checkpoint" ? "rgba(220,38,38,0.08)" : "rgba(37,99,235,0.08)") : "transparent" }}>
                      <button onClick={e => { e.stopPropagation(); onToggleItem(lvl.id, item.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)", padding: 0 }}>
                        {item.isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                      </button>
                      {item.type === "checkpoint"
                        ? <Flag size={12} style={{ color: sel.itemId === item.id ? "#DC2626" : "var(--app-text-secondary)", flexShrink: 0 }} />
                        : <File size={12} style={{ color: sel.itemId === item.id ? "#2563EB" : "var(--app-text-secondary)", flexShrink: 0 }} />}
                      <span style={{ fontSize: "12px", fontWeight: 600, color: sel.itemId === item.id ? (item.type === "checkpoint" ? "#DC2626" : "#2563EB") : "var(--app-text-primary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</span>
                      <button onClick={e => { e.stopPropagation(); onPickSlide(lvl.id, item.id); }} title="Add Slide" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)", padding: 1 }}><Plus size={11} /></button>
                    </div>

                    {/* Slides */}
                    {item.isExpanded && item.slides.length > 0 && (
                      <div style={{ marginLeft: 18, borderLeft: "1px solid var(--app-border)", paddingLeft: 6, marginTop: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                        {item.slides.map((slide, idx) => {
                          const cfg = SLIDE_CONF[slide.type];
                          const isSlideActive = sel.slideId === slide.id;
                          return (
                            <div key={slide.id} onClick={() => onSelect({ type: "slide", levelId: lvl.id, itemId: item.id, slideId: slide.id })}
                              style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 5px", borderRadius: 6, cursor: "pointer", background: isSlideActive ? `${cfg.color}14` : "transparent" }}>
                              <div style={{ width: 16, height: 16, borderRadius: 4, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <cfg.icon size={9} style={{ color: cfg.color }} />
                              </div>
                              <span style={{ fontSize: "11.5px", fontWeight: isSlideActive ? 650 : 500, color: isSlideActive ? "var(--app-text-primary)" : "var(--app-text-secondary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {idx + 1}. {slide.title || cfg.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
                {/* Add Checkpoint button at end of level */}
                <button onClick={() => onAddItem(lvl.id, "checkpoint")} style={{ display: "flex", alignItems: "center", gap: 4, margin: "6px 0 2px 4px", padding: "4px 8px", fontSize: "11px", fontWeight: 650, color: "#DC2626", background: "rgba(220,38,38,0.07)", border: "none", borderRadius: 6, cursor: "pointer" }}>
                  <Flag size={10} /> Add Checkpoint
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   EMPTY STATE
═══════════════════════════════════════════════ */
function BuilderEmptyState({ onAddLevel }: any) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{ width: 120, height: 120, borderRadius: 32, background: "rgba(255,107,0,0.06)", border: "2px dashed rgba(255,107,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
        <Layers size={48} style={{ color: "#FF6B00", opacity: 0.7 }} />
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: "28px", fontWeight: 800, color: "var(--app-text-primary)", letterSpacing: "-0.03em", marginBottom: 12 }}>
        Start Building Your Topic
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ fontSize: "15px", color: "var(--app-text-secondary)", maxWidth: 420, lineHeight: 1.65, marginBottom: 36 }}>
        Organise your topic into <strong>Levels</strong>, inside each level add <strong>Lessons</strong> and <strong>Checkpoints</strong>. Each lesson holds interactive slides you design.
      </motion.p>
      <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onClick={onAddLevel}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: "#FF6B00", color: "var(--app-text-primary)", border: "none", borderRadius: 14, fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 28px rgba(255,107,0,0.3)" }}>
        <Plus size={18} /> Create Level 1
      </motion.button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LEVEL OVERVIEW
═══════════════════════════════════════════════ */
function LevelOverviewPanel({ level, onUpdate, onAddItem, onDelete }: any) {
  const totalSlides = level.items.reduce((a: number, i: any) => a + i.slides.length, 0);
  return (
    <div>
      <p style={{ fontSize: "11px", fontWeight: 750, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Level Overview</p>
      <input value={level.title} onChange={(e: any) => onUpdate({ title: e.target.value })} style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--app-text-primary)", border: "none", background: "transparent", outline: "none", width: "100%", marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}>
        {[["Lessons", level.items.filter((i: any) => i.type === "lesson").length], ["Checkpoints", level.items.filter((i: any) => i.type === "checkpoint").length], ["Total Slides", totalSlides]].map(([label, count]) => (
          <div key={label as string} style={{ padding: "20px", background: "var(--app-card)", borderRadius: 14, border: "1px solid var(--app-border)" }}>
            <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 600, marginBottom: 8 }}>{label}</p>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--app-text-primary)" }}>{count}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => onAddItem("lesson")} style={{ padding: "11px 20px", background: "var(--app-card)", border: "1px solid var(--app-border)", color: "var(--app-text-primary)", borderRadius: 11, fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}>+ Lesson</button>
        <button onClick={() => onAddItem("checkpoint")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 20px", background: "rgba(220,38,38,0.08)", color: "#DC2626", borderRadius: 11, fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}><Flag size={13} /> Checkpoint</button>
        <button onClick={onDelete} style={{ marginLeft: "auto", padding: "11px 20px", background: "rgba(220,38,38,0.06)", color: "#DC2626", borderRadius: 11, fontSize: "13px", fontWeight: 700, border: "1px solid rgba(220,38,38,0.12)", cursor: "pointer" }}>Delete Level</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ITEM (LESSON / CHECKPOINT) OVERVIEW
═══════════════════════════════════════════════ */
function ItemOverviewPanel({ item, onUpdate, onAddSlide, onDelete }: any) {
  const isCpt = item.type === "checkpoint";
  const activeSlides = item.slides.filter((s: any) => SLIDE_CONF[s.type as SlideType]?.isActive).length;
  const pct = item.slides.length ? Math.round((activeSlides / item.slides.length) * 100) : 0;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ padding: "3px 10px", borderRadius: 20, background: isCpt ? "rgba(220,38,38,0.1)" : "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", gap: 5 }}>
          {isCpt ? <Flag size={11} style={{ color: "#DC2626" }} /> : <File size={11} style={{ color: "#2563EB" }} />}
          <span style={{ fontSize: "10.5px", fontWeight: 750, color: isCpt ? "#DC2626" : "#2563EB", textTransform: "uppercase", letterSpacing: "0.05em" }}>{isCpt ? "Checkpoint" : "Lesson"}</span>
        </div>
      </div>
      <input value={item.title} onChange={(e: any) => onUpdate({ title: e.target.value })} style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--app-text-primary)", border: "none", background: "transparent", outline: "none", width: "100%", marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
        <div style={{ padding: "20px", background: "var(--app-card)", borderRadius: 14, border: "1px solid var(--app-border)" }}>
          <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 600, marginBottom: 8 }}>Slides</p>
          <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--app-text-primary)" }}>{item.slides.length}</p>
        </div>
        {!isCpt && (
          <div style={{ padding: "20px", background: "var(--app-card)", borderRadius: 14, border: "1px solid var(--app-border)" }}>
            <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 600, marginBottom: 8 }}>Interactivity</p>
            <p style={{ fontSize: "28px", fontWeight: 800, color: pct >= 65 ? "#16A34A" : "#F59E0B" }}>{pct}%</p>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onAddSlide} style={{ padding: "11px 20px", background: isCpt ? "#DC2626" : "#2563EB", color: "var(--app-text-primary)", borderRadius: 11, fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}>+ Add Slide</button>
        <button onClick={onDelete} style={{ marginLeft: "auto", padding: "11px 20px", background: "rgba(220,38,38,0.06)", color: "#DC2626", borderRadius: 11, fontSize: "13px", fontWeight: 700, border: "1px solid rgba(220,38,38,0.12)", cursor: "pointer" }}>Delete</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SLIDE EDITOR PANEL (MAIN DISPATCHER)
═══════════════════════════════════════════════ */
function SlideEditorPanel({ slide, isInCheckpoint, onUpdate }: { slide: Slide; isInCheckpoint?: boolean; onUpdate: (p: Partial<Slide>) => void }) {
  const cfg = SLIDE_CONF[slide.type];
  return (
    <div>
      {/* Slide Type Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 12px", background: cfg.bg, borderRadius: 20 }}>
          <cfg.icon size={13} style={{ color: cfg.color }} />
          <span style={{ fontSize: "11px", fontWeight: 750, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>{cfg.label}</span>
        </div>
        <span style={{ fontSize: "12px", color: "var(--app-text-secondary)", padding: "3px 8px", borderRadius: 6, background: "var(--app-border)" }}>
          {cfg.isActive ? "● Active" : "○ Passive"}
        </span>
      </div>

      {/* Route to correct editor */}
      {slide.type === "concept"         && <ConceptEditor         slide={slide} onUpdate={onUpdate} />}
      {slide.type === "local_context"   && <LocalContextEditor    slide={slide} onUpdate={onUpdate} />}
      {slide.type === "spotlight"       && <SpotlightEditor       slide={slide} onUpdate={onUpdate} />}
      {slide.type === "formula"         && <FormulaEditor         slide={slide} onUpdate={onUpdate} />}
      {slide.type === "worked_example"  && <WorkedExampleEditor   slide={slide} onUpdate={onUpdate} />}
      {slide.type === "analogy"         && <AnalogyEditor         slide={slide} onUpdate={onUpdate} />}
      {slide.type === "teacher_note"    && <TeacherNoteEditor     slide={slide} onUpdate={onUpdate} />}
      {slide.type === "multiple_choice" && <MCQEditor             slide={slide} onUpdate={onUpdate} />}
      {slide.type === "true_false"      && <TrueFalseEditor       slide={slide} onUpdate={onUpdate} />}
      {slide.type === "fill_blank"      && <FillBlankEditor       slide={slide} onUpdate={onUpdate} />}
      {slide.type === "match_it"        && <MatchItEditor         slide={slide} onUpdate={onUpdate} />}
      {slide.type === "order_it"        && <OrderItEditor         slide={slide} onUpdate={onUpdate} />}
      {slide.type === "knowledge_burst" && <KnowledgeBurstEditor  slide={slide} onUpdate={onUpdate} />}
    </div>
  );
}

/* ─── Shared primitives ─────────────────────── */
function EditorCard({ title, children, hint, aiEnabled = false, aiType = "Proofread", onAi }: any) {
  const [aiState, setAiState] = useState<"idle" | "checking" | "ok" | "issues">("idle");
  const handleAi = () => {
    setAiState("checking");
    setTimeout(() => setAiState("ok"), 1600);
    if (onAi) onAi();
  };
  return (
    <div style={{ background: "var(--app-card)", borderRadius: 18, padding: "24px", border: "1px solid var(--app-border)", marginBottom: 14, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          {title && <p style={{ fontSize: "11px", fontWeight: 750, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--app-text-secondary)", marginBottom: 2 }}>{title}</p>}
          {hint && <p style={{ fontSize: "12px", color: "var(--app-text-secondary)" }}>{hint}</p>}
        </div>
        {aiEnabled && (
          <button onClick={handleAi} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 650, background: aiState === "ok" ? "rgba(22,163,74,0.1)" : aiState === "checking" ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.08)", color: aiState === "ok" ? "#16A34A" : "#7C3AED" }}>
            {aiState === "idle" && <><Sparkles size={11} /> AI {aiType}</>}
            {aiState === "checking" && <><RefreshCw size={11} /> Checking...</>}
            {aiState === "ok" && <><CheckCheck size={11} /> All Good!</>}
            {aiState === "issues" && <><AlertCircle size={11} /> Issues Found</>}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function FieldInput({ value, onChange, placeholder, large = false }: any) {
  return (
    <input value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", padding: large ? "14px 16px" : "11px 14px", background: "var(--app-border)", border: "1.5px solid var(--app-border-glow)", borderRadius: 11, outline: "none", fontSize: large ? "22px" : "14px", fontWeight: large ? 700 : 450, color: "var(--app-text-primary)", letterSpacing: large ? "-0.02em" : "normal", fontFamily: "inherit", boxSizing: "border-box" }} />
  );
}

function FieldTextarea({ value, onChange, placeholder, rows = 4 }: any) {
  return (
    <textarea value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ width: "100%", padding: "12px 14px", background: "var(--app-border)", border: "1.5px solid var(--app-border-glow)", borderRadius: 11, outline: "none", resize: "vertical", fontSize: "14px", color: "var(--app-text-primary)", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box" }} />
  );
}

function LearningObjectiveEditor({ slide, onUpdate }: any) {
  const objectives: string[] = slide.learningObjectives ?? [];
  return (
    <EditorCard title="Learning Objectives" hint="What will the learner be able to do?">
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {objectives.map((obj, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <CheckCircle2 size={14} style={{ color: "#16A34A", flexShrink: 0 }} />
            <input value={obj} onChange={e => { const n = [...objectives]; n[i] = e.target.value; onUpdate({ learningObjectives: n }); }}
              style={{ flex: 1, padding: "8px 12px", border: "1.5px solid var(--app-border-glow)", borderRadius: 8, outline: "none", fontSize: "13.5px", fontFamily: "inherit" }} />
            <button onClick={() => { const n = objectives.filter((_, ii) => ii !== i); onUpdate({ learningObjectives: n }); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)" }}><X size={13} /></button>
          </div>
        ))}
        <button onClick={() => onUpdate({ learningObjectives: [...objectives, ""] })}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: "1.5px dashed var(--app-border)", background: "transparent", fontSize: "13px", fontWeight: 600, color: "var(--app-text-secondary)", cursor: "pointer" }}>
          <Plus size={12} /> Add Objective
        </button>
      </div>
    </EditorCard>
  );
}

/* ═══════════════════════════════════════════════
   PASSIVE SLIDE EDITORS
═══════════════════════════════════════════════ */
function ConceptEditor({ slide, onUpdate }: any) {
  const [mediaOpen, setMediaOpen] = useState(false);
  return (
    <>
      <EditorCard title="Title" aiEnabled hint="What is the concept being introduced?" onAi={() => {}}>
        <FieldInput value={slide.title} onChange={(v: string) => onUpdate({ title: v })} placeholder="e.g. What is a Quadratic Equation?" large />
      </EditorCard>

      <EditorCard title="Slide Media" hint="Attach a visual asset from your Media Library.">
        {slide.imageUrl ? (
           <div style={{ position: "relative", width: "100%", height: 160, borderRadius: 12, overflow: "hidden", marginBottom: 12, border: "1px solid var(--app-border)" }}>
             <img src={slide.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
             <button onClick={() => onUpdate({ imageUrl: undefined })} style={{ position: "absolute", top: 8, right: 8, background: "var(--app-text-secondary)", color: "var(--app-text-primary)", border: "none", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14}/></button>
           </div>
        ) : (
           <button onClick={() => setMediaOpen(true)} style={{ width: "100%", padding: "24px", borderRadius: 12, border: "2px dashed var(--app-border)", background: "var(--app-border)", color: "var(--app-text-secondary)", fontWeight: 600, fontSize: "14px", display: "flex", flexDirection: "column", gap: 8, alignItems: "center", cursor: "pointer" }}>
             <Image size={24} style={{ opacity: 0.5 }} />
             Browse Media Library
           </button>
        )}
        
        <AnimatePresence>
          {mediaOpen && (
            <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMediaOpen(false)} style={{ position: "absolute", inset: 0, background: "var(--app-text-secondary)", backdropFilter: "blur(4px)" }} />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: "relative", width: "90%", maxWidth: 800, background: "var(--app-card)", borderRadius: 24, padding: 32, boxShadow: "0 32px 64px rgba(0,0,0,0.2)" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                   <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--app-text-primary)" }}>Select from Media Library</h2>
                   <button onClick={() => setMediaOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer" }}><X size={20}/></button>
                 </div>
                 <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxHeight: 400, overflowY: "auto", paddingRight: 8 }}>
                    {[
                      { id: "m1", url: "https://images.unsplash.com/photo-1530213786676-415b6824fa06?auto=format&fit=crop&q=80&w=400", title: "Plant Cell Mitosis" },
                      { id: "m2", url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400", title: "Quadratic Formula" },
                      { id: "m5", url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=400", title: "Photosynthesis" },
                      { id: "m6", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", title: "Pendulum Motion" }
                    ].map(img => (
                      <div key={img.id} onClick={() => { onUpdate({ imageUrl: img.url }); setMediaOpen(false); }} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--app-border)", cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.02)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
                         <div style={{ height: 120, backgroundImage: `url(${img.url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                         <div style={{ padding: "8px 12px", fontSize: "12px", fontWeight: 600, color: "var(--app-text-primary)" }}>{img.title}</div>
                      </div>
                    ))}
                 </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </EditorCard>
      <EditorCard title="Definition" aiEnabled hint="Clear, concise definition in student-friendly language.">
        <FieldTextarea value={slide.content} onChange={(v: string) => onUpdate({ content: v })} placeholder="A quadratic equation is an equation of the form ax² + bx + c = 0 where a ≠ 0..." />
      </EditorCard>
      <EditorCard title="Key Highlight" hint="One sentence pull-quote the student must remember.">
        <FieldInput value={slide.highlight} onChange={(v: string) => onUpdate({ highlight: v })} placeholder="e.g. The highest power of x in a quadratic equation is 2." />
      </EditorCard>
      <LearningObjectiveEditor slide={slide} onUpdate={onUpdate} />
      <EditorCard title="Teacher Note" hint="Tips for explaining this slide in class. Not shown to students.">
        <FieldTextarea value={slide.teacherNotes} onChange={(v: string) => onUpdate({ teacherNotes: v })} placeholder="Explain using the analogy of a parabola (like a ball thrown in the air)..." rows={3} />
      </EditorCard>
    </>
  );
}

function LocalContextEditor({ slide, onUpdate }: any) {
  return (
    <>
      <EditorCard title="Context Title" aiEnabled hint="State the real-world, Nigerian context.">
        <FieldInput value={slide.title} onChange={(v: string) => onUpdate({ title: v })} placeholder="e.g. Market Pricing Model in Lagos" large />
      </EditorCard>
      <EditorCard title="Scenario Description" aiEnabled hint="Ground the concept in a relatable local context.">
        <FieldTextarea value={slide.content} onChange={(v: string) => onUpdate({ content: v })} placeholder="A trader at Balogun Market sells yams at ₦(2x² + 5x - 3) per bag. How does this model prices?" />
      </EditorCard>
      <EditorCard title="Connection to Concept" hint="Explicitly bridge the local context back to the academic concept.">
        <FieldTextarea value={slide.highlight} onChange={(v: string) => onUpdate({ highlight: v })} placeholder="Here, 2x² + 5x - 3 is a quadratic expression because the highest power of x is 2." rows={3} />
      </EditorCard>
    </>
  );
}

function SpotlightEditor({ slide, onUpdate }: any) {
  return (
    <>
      <EditorCard title="Spotlight Title" aiEnabled hint="Name of the key concept, theorem or rule.">
        <FieldInput value={slide.title} onChange={(v: string) => onUpdate({ title: v })} placeholder="e.g. The Quadratic Formula" large />
      </EditorCard>
      <EditorCard title="Formula / Rule" hint="The exact formula or rule, precisely stated.">
        <FieldTextarea value={slide.highlight} onChange={(v: string) => onUpdate({ highlight: v })} placeholder="x = (-b ± √(b² - 4ac)) / 2a" rows={2} />
      </EditorCard>
      <EditorCard title="Explanation" aiEnabled hint="Walk the student through what each part means.">
        <FieldTextarea value={slide.content} onChange={(v: string) => onUpdate({ content: v })} placeholder="Where a, b and c are coefficients from ax² + bx + c = 0. The ± means there are two possible solutions..." />
      </EditorCard>
      <LearningObjectiveEditor slide={slide} onUpdate={onUpdate} />
    </>
  );
}

function FormulaEditor({ slide, onUpdate }: any) {
  return (
    <>
      <EditorCard title="Formula Name" aiEnabled>
        <FieldInput value={slide.title} onChange={(v: string) => onUpdate({ title: v })} placeholder="e.g. Discriminant" large />
      </EditorCard>
      <EditorCard title="Formula" hint="The formula exactly as it should appear.">
        <FieldInput value={slide.highlight} onChange={(v: string) => onUpdate({ highlight: v })} placeholder="Δ = b² - 4ac" />
      </EditorCard>
      <EditorCard title="Component Breakdown" aiEnabled hint="Describe each variable or term.">
        <FieldTextarea value={slide.content} onChange={(v: string) => onUpdate({ content: v })} placeholder="• a = coefficient of x²\n• b = coefficient of x\n• c = constant term\n• Δ > 0 → two real roots\n• Δ = 0 → one repeated root\n• Δ < 0 → no real roots" />
      </EditorCard>
      <EditorCard title="When to use" hint="Exam tip: when should a student apply this formula?">
        <FieldTextarea value={slide.teacherNotes} onChange={(v: string) => onUpdate({ teacherNotes: v })} placeholder="Use the discriminant to quickly determine the nature of roots before solving." rows={2} />
      </EditorCard>
    </>
  );
}

function WorkedExampleEditor({ slide, onUpdate }: any) {
  const steps: OrderStep[] = slide.steps ?? [{ id: `s${Date.now()}`, text: "" }];
  return (
    <>
      <EditorCard title="Problem Statement" aiEnabled>
        <FieldInput value={slide.title} onChange={(v: string) => onUpdate({ title: v })} placeholder="e.g. Solve: 2x² - 5x + 3 = 0" large />
      </EditorCard>
      <EditorCard title="Step-by-Step Solution" hint="Break down the solution into numbered steps.">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {steps.map((step, i) => (
            <div key={step.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#FF6B00", color: "var(--app-text-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, flexShrink: 0, marginTop: 8 }}>{i + 1}</div>
              <textarea value={step.text} onChange={e => { const n = [...steps]; n[i] = { ...n[i], text: e.target.value }; onUpdate({ steps: n }); }} placeholder={`Step ${i+1}...`} rows={2}
                style={{ flex: 1, padding: "8px 12px", border: "1.5px solid var(--app-border-glow)", borderRadius: 9, outline: "none", fontSize: "13.5px", fontFamily: "inherit", resize: "vertical" }} />
              <button onClick={() => onUpdate({ steps: steps.filter((_, ii) => ii !== i) })} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)", marginTop: 8 }}><X size={13} /></button>
            </div>
          ))}
          <button onClick={() => onUpdate({ steps: [...steps, { id: `s${Date.now()}`, text: "" }] })}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: "1.5px dashed var(--app-border)", background: "transparent", fontSize: "13px", fontWeight: 600, color: "var(--app-text-secondary)", cursor: "pointer" }}>
            <Plus size={12} /> Add Step
          </button>
        </div>
      </EditorCard>
      <EditorCard title="Final Answer" hint="Highlight the answer prominently.">
        <FieldInput value={slide.highlight} onChange={(v: string) => onUpdate({ highlight: v })} placeholder="x = 3/2  or  x = 1" />
      </EditorCard>
    </>
  );
}

function AnalogyEditor({ slide, onUpdate }: any) {
  return (
    <>
      <EditorCard title="Concept Being Explained" aiEnabled>
        <FieldInput value={slide.title} onChange={(v: string) => onUpdate({ title: v })} placeholder="e.g. What is a Quadratic Root?" large />
      </EditorCard>
      <EditorCard title="The Analogy" aiEnabled hint="A relatable, everyday comparison.">
        <FieldTextarea value={slide.content} onChange={(v: string) => onUpdate({ content: v })} placeholder="Think of a quadratic root like the exact moment a ball hits the ground after being thrown up. It's the value of x where the equation 'lands' on zero." />
      </EditorCard>
      <EditorCard title="Bridge Back" hint="Explicitly connect the analogy to the mathematical concept.">
        <FieldTextarea value={slide.highlight} onChange={(v: string) => onUpdate({ highlight: v })} placeholder="Just as the ball can land on two different spots, a quadratic can have up to two roots." rows={2} />
      </EditorCard>
    </>
  );
}

function TeacherNoteEditor({ slide, onUpdate }: any) {
  return (
    <>
      <EditorCard title="Note Title" hint="For the teacher's reference — not visible to students.">
        <FieldInput value={slide.title} onChange={(v: string) => onUpdate({ title: v })} placeholder="e.g. Common Misconception: Sign Errors" large />
      </EditorCard>
      <EditorCard title="Pedagogical Note" aiEnabled>
        <FieldTextarea value={slide.content} onChange={(v: string) => onUpdate({ content: v })} placeholder="Students often make sign errors when substituting into the quadratic formula. Emphasise that -b means we negate the value of b, even if b is already negative..." rows={5} />
      </EditorCard>
      <EditorCard title="Suggested Activity" hint="Optional: recommend a class activity or discussion prompt.">
        <FieldTextarea value={slide.teacherNotes} onChange={(v: string) => onUpdate({ teacherNotes: v })} placeholder="Ask students to work in pairs and cross-check each other's substitution step." rows={2} />
      </EditorCard>
    </>
  );
}

/* ═══════════════════════════════════════════════
   ACTIVE SLIDE EDITORS
═══════════════════════════════════════════════ */
function MCQEditor({ slide, onUpdate }: any) {
  const options: MCQOption[] = slide.options ?? [];
  return (
    <>
      <EditorCard title="Question" aiEnabled hint="Clear, unambiguous question.">
        <FieldTextarea value={slide.question} onChange={(v: string) => onUpdate({ question: v })} placeholder="What is the value of x in: x² - 5x + 6 = 0?" rows={2} />
      </EditorCard>
      <EditorCard title="Answer Options" hint="Mark exactly one correct answer. All wrong options need explanations.">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {options.map((opt, i) => (
            <div key={opt.id} style={{ border: `1.5px solid ${opt.isCorrect ? "#16A34A" : "var(--app-border)"}`, borderRadius: 12, padding: "12px 14px", background: opt.isCorrect ? "rgba(22,163,74,0.04)" : "var(--app-card)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: opt.explanation || !opt.isCorrect ? 8 : 0 }}>
                <button onClick={() => { const n = options.map((o, ii) => ({ ...o, isCorrect: ii === i })); onUpdate({ options: n }); }}
                  style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${opt.isCorrect ? "#16A34A" : "var(--app-border)"}`, background: opt.isCorrect ? "#16A34A" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {opt.isCorrect && <Check size={11} style={{ color: "var(--app-text-primary)" }} />}
                </button>
                <input value={opt.text} onChange={e => { const n = [...options]; n[i] = { ...n[i], text: e.target.value }; onUpdate({ options: n }); }}
                  placeholder={`Option ${["A", "B", "C", "D"][i]}`}
                  style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", fontFamily: "inherit", background: "transparent" }} />
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: opt.isCorrect ? "rgba(22,163,74,0.12)" : "var(--app-border)", color: opt.isCorrect ? "#16A34A" : "var(--app-text-secondary)" }}>{opt.isCorrect ? "CORRECT" : ["A","B","C","D"][i]}</span>
              </div>
              <div style={{ paddingLeft: 28 }}>
                <input value={opt.explanation} onChange={e => { const n = [...options]; n[i] = { ...n[i], explanation: e.target.value }; onUpdate({ options: n }); }}
                  placeholder={opt.isCorrect ? "Why is this the right answer?" : "Why is this wrong? Explain the misconception."}
                  style={{ width: "100%", padding: "6px 10px", border: "1.5px solid var(--app-border-glow)", borderRadius: 8, outline: "none", fontSize: "12.5px", fontFamily: "inherit", background: "var(--app-border)", color: "var(--app-text-secondary)", boxSizing: "border-box" }} />
              </div>
            </div>
          ))}
        </div>
      </EditorCard>
      <EditorCard title="Hint" aiEnabled aiType="Generate Hint" hint="Optional: Give learner a nudge if they're stuck.">
        <FieldInput value={slide.hint} onChange={(v: string) => onUpdate({ hint: v })} placeholder="Try factoring the expression first..." />
      </EditorCard>
    </>
  );
}

function TrueFalseEditor({ slide, onUpdate }: any) {
  const options: MCQOption[] = slide.options ?? [
    { id: "tf_t", text: "True", isCorrect: false, explanation: "" },
    { id: "tf_f", text: "False", isCorrect: false, explanation: "" },
  ];
  return (
    <>
      <EditorCard title="Statement" aiEnabled hint="A statement that is either true or false.">
        <FieldTextarea value={slide.question} onChange={(v: string) => onUpdate({ question: v })} placeholder="The equation x² + 4 = 0 has two real roots." rows={2} />
      </EditorCard>
      <EditorCard title="Answer" hint="Select the correct answer and provide explanations for both.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {options.map((opt, i) => (
            <div key={opt.id} onClick={() => { const n = options.map((o, ii) => ({ ...o, isCorrect: ii === i })); onUpdate({ options: n }); }}
              style={{ padding: 16, borderRadius: 14, border: `2px solid ${opt.isCorrect ? (opt.text === "True" ? "#16A34A" : "#DC2626") : "var(--app-border)"}`, background: opt.isCorrect ? (opt.text === "True" ? "rgba(22,163,74,0.06)" : "rgba(220,38,38,0.06)") : "var(--app-card)", cursor: "pointer", textAlign: "center" }}>
              <p style={{ fontSize: "16px", fontWeight: 800, color: opt.isCorrect ? (opt.text === "True" ? "#16A34A" : "#DC2626") : "var(--app-text-secondary)" }}>{opt.text}</p>
              {opt.isCorrect && <p style={{ fontSize: "10px", fontWeight: 750, color: opt.text === "True" ? "#16A34A" : "#DC2626" }}>CORRECT</p>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {options.map((opt, i) => (
            <div key={opt.id + "ex"}>
              <p style={{ fontSize: "11px", fontWeight: 650, color: "var(--app-text-secondary)", marginBottom: 4 }}>Explanation if student picks "{opt.text}":</p>
              <input value={opt.explanation} onChange={e => { const n = [...options]; n[i] = { ...n[i], explanation: e.target.value }; onUpdate({ options: n }); }}
                placeholder={`Why ${opt.text} is ${opt.isCorrect ? "correct" : "incorrect"}...`}
                style={{ width: "100%", padding: "8px 12px", border: "1.5px solid var(--app-border-glow)", borderRadius: 8, outline: "none", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
          ))}
        </div>
      </EditorCard>
    </>
  );
}

function FillBlankEditor({ slide, onUpdate }: any) {
  return (
    <>
      <EditorCard title="Sentence with Blank" aiEnabled hint="Use ___ to mark where the blank should appear.">
        <FieldTextarea value={slide.sentence} onChange={(v: string) => onUpdate({ sentence: v })} placeholder="In the quadratic formula, the expression b² - 4ac is called the ___." rows={2} />
      </EditorCard>
      <EditorCard title="Correct Answer">
        <FieldInput value={slide.blankAnswer} onChange={(v: string) => onUpdate({ blankAnswer: v })} placeholder="discriminant" />
      </EditorCard>
      <EditorCard title="Explanation" aiEnabled hint="Why is this the correct word/value?">
        <FieldTextarea value={slide.blankExplanation} onChange={(v: string) => onUpdate({ blankExplanation: v })} placeholder="The discriminant (Δ = b² - 4ac) determines the nature of the roots of a quadratic equation." rows={2} />
      </EditorCard>
      <EditorCard title="Hint" aiEnabled aiType="Generate Hint">
        <FieldInput value={slide.hint} onChange={(v: string) => onUpdate({ hint: v })} placeholder="Think about what 'determines' or 'discriminates' between types of roots..." />
      </EditorCard>
    </>
  );
}

function MatchItEditor({ slide, onUpdate }: any) {
  const pairs: MatchPair[] = slide.pairs ?? [];
  return (
    <>
      <EditorCard title="Instruction" aiEnabled hint="What should the learner match?">
        <FieldInput value={slide.title} onChange={(v: string) => onUpdate({ title: v })} placeholder="Match each equation with its solution type." />
      </EditorCard>
      <EditorCard title="Match Pairs" hint="Create pairs — left side is the term/question, right side is the answer.">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", gap: 8, marginBottom: 4 }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase" }}>Left</p>
            <span />
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase" }}>Right</p>
          </div>
          {pairs.map((pair, i) => (
            <div key={pair.id} style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", gap: 8, alignItems: "center" }}>
              <input value={pair.left} onChange={e => { const n = [...pairs]; n[i] = { ...n[i], left: e.target.value }; onUpdate({ pairs: n }); }}
                placeholder={`Left ${i+1}`} style={{ padding: "9px 12px", border: "1.5px solid var(--app-border-glow)", borderRadius: 9, outline: "none", fontSize: "13px", fontFamily: "inherit" }} />
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}><ChevronRight size={14} style={{ color: "var(--app-text-secondary)" }} /></div>
              <input value={pair.right} onChange={e => { const n = [...pairs]; n[i] = { ...n[i], right: e.target.value }; onUpdate({ pairs: n }); }}
                placeholder={`Right ${i+1}`} style={{ padding: "9px 12px", border: "1.5px solid var(--app-border-glow)", borderRadius: 9, outline: "none", fontSize: "13px", fontFamily: "inherit" }} />
            </div>
          ))}
          <button onClick={() => onUpdate({ pairs: [...pairs, { id: oid(), left: "", right: "" }] })}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: "1.5px dashed var(--app-border)", background: "transparent", fontSize: "13px", fontWeight: 600, color: "var(--app-text-secondary)", cursor: "pointer" }}>
            <Plus size={12} /> Add Pair
          </button>
        </div>
      </EditorCard>
    </>
  );
}

function OrderItEditor({ slide, onUpdate }: any) {
  const steps: OrderStep[] = slide.steps ?? [];
  return (
    <>
      <EditorCard title="Instruction" aiEnabled>
        <FieldInput value={slide.title} onChange={(v: string) => onUpdate({ title: v })} placeholder="Arrange the steps for solving a quadratic by factoring in the correct order." />
      </EditorCard>
      <EditorCard title="Steps in Correct Order" hint="Write steps in the correct order — they'll be shuffled for the student.">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {steps.map((step, i) => (
            <div key={step.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--app-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
              <input value={step.text} onChange={e => { const n = [...steps]; n[i] = { ...n[i], text: e.target.value }; onUpdate({ steps: n }); }}
                placeholder={`Step ${i+1}`}
                style={{ flex: 1, padding: "9px 12px", border: "1.5px solid var(--app-border-glow)", borderRadius: 9, outline: "none", fontSize: "13px", fontFamily: "inherit" }} />
              <button onClick={() => onUpdate({ steps: steps.filter((_, ii) => ii !== i) })} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)" }}><X size={13} /></button>
            </div>
          ))}
          <button onClick={() => onUpdate({ steps: [...steps, { id: oid(), text: "" }] })}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: "1.5px dashed var(--app-border)", background: "transparent", fontSize: "13px", fontWeight: 600, color: "var(--app-text-secondary)", cursor: "pointer" }}>
            <Plus size={12} /> Add Step
          </button>
        </div>
      </EditorCard>
    </>
  );
}

function KnowledgeBurstEditor({ slide, onUpdate }: any) {
  return (
    <>
      <EditorCard title="Burst Title" hint="Introduce what this rapid review covers.">
        <FieldInput value={slide.title} onChange={(v: string) => onUpdate({ title: v })} placeholder="Quick Fire: Quadratic Roots" large />
      </EditorCard>
      <div style={{ padding: "16px", background: "rgba(124,58,237,0.05)", border: "1.5px dashed rgba(124,58,237,0.2)", borderRadius: 14, marginBottom: 14 }}>
        <p style={{ fontSize: "13px", color: "#7C3AED", fontWeight: 650, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
          <Zap size={14} /> Knowledge Burst
        </p>
        <p style={{ fontSize: "12.5px", color: "var(--app-text-secondary)", lineHeight: 1.55 }}>
          A Knowledge Burst contains 3 rapid-fire questions pulled from this lesson's MCQ and T/F slides. They appear at the end as a quick review. You don't need to create them separately — the system auto-selects the most appropriate questions from your lesson.
        </p>
      </div>
      <EditorCard title="Custom Intro Message" hint="Optional message shown before the burst starts.">
        <FieldInput value={slide.content} onChange={(v: string) => onUpdate({ content: v })} placeholder="Let's test what you've learned! Answer quickly — trust your instincts!" />
      </EditorCard>
    </>
  );
}

/* ═══════════════════════════════════════════════
   PROPERTIES PANEL (RIGHT)
═══════════════════════════════════════════════ */
function PropertiesPanel({ slide, onUpdate, onDelete, onDuplicate }: { slide: Slide; onUpdate: (p: Partial<Slide>) => void; onDelete: () => void; onDuplicate: () => void }) {
  const cfg = SLIDE_CONF[slide.type];
  return (
    <div style={{ width: 260, background: "var(--app-card)", borderLeft: "1px solid var(--app-border)", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--app-border)" }}>
        <p style={{ fontSize: "10.5px", fontWeight: 750, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Properties</p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {/* Type Badge */}
        <div style={{ padding: "10px 12px", background: cfg.bg, borderRadius: 10, display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <cfg.icon size={15} style={{ color: cfg.color }} />
          <div>
            <p style={{ fontSize: "12.5px", fontWeight: 680, color: cfg.color }}>{cfg.label}</p>
            <p style={{ fontSize: "10.5px", color: `${cfg.color}99` }}>{cfg.category === "active" ? "Active" : "Passive"}</p>
          </div>
        </div>

        {/* Difficulty */}
        {cfg.isActive && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Difficulty</p>
            <div style={{ display: "flex", gap: 6 }}>
              {(["easy", "medium", "hard"] as const).map(d => (
                <button key={d} onClick={() => onUpdate({ difficulty: d })}
                  style={{ flex: 1, padding: "7px 4px", borderRadius: 8, fontSize: "10.5px", fontWeight: 650, border: `1.5px solid`, borderColor: slide.difficulty === d ? (d === "easy" ? "#16A34A" : d === "medium" ? "#D97706" : "#DC2626") : "var(--app-border)", background: slide.difficulty === d ? (d === "easy" ? "rgba(22,163,74,0.08)" : d === "medium" ? "rgba(217,119,6,0.08)" : "rgba(220,38,38,0.08)") : "var(--app-card)", color: slide.difficulty === d ? (d === "easy" ? "#16A34A" : d === "medium" ? "#D97706" : "#DC2626") : "var(--app-text-secondary)", cursor: "pointer", textTransform: "capitalize" }}>{d}</button>
              ))}
            </div>
          </div>
        )}

        {/* Duration */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Duration</p>
          <div style={{ display: "flex", gap: 6 }}>
            {[30, 45, 60, 90].map(s => (
              <button key={s} onClick={() => onUpdate({ duration: s })}
                style={{ flex: 1, padding: "7px 2px", borderRadius: 8, fontSize: "10.5px", fontWeight: 600, border: `1.5px solid ${(slide.duration ?? 45) === s ? "#FF6B00" : "var(--app-border)"}`, background: (slide.duration ?? 45) === s ? "rgba(255,107,0,0.07)" : "var(--app-card)", color: (slide.duration ?? 45) === s ? "#FF6B00" : "var(--app-text-secondary)", cursor: "pointer" }}>{s}s</button>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: "var(--app-border)", marginBottom: 16 }} />

        {/* Actions */}
        <button onClick={onDuplicate} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--app-border)", background: "var(--app-card)", cursor: "pointer", fontSize: "13px", color: "var(--app-text-primary)", fontWeight: 550, width: "100%", marginBottom: 8 }}>
          <Copy size={14} style={{ color: "var(--app-text-secondary)" }} /> Duplicate
        </button>
        <button onClick={onDelete} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(220,38,38,0.15)", background: "rgba(220,38,38,0.04)", cursor: "pointer", fontSize: "13px", color: "#DC2626", fontWeight: 550, width: "100%" }}>
          <Trash2 size={14} /> Delete Slide
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SLIDE TYPE PICKER MODAL
═══════════════════════════════════════════════ */
const PASSIVE_TYPES: SlideType[] = ["concept", "local_context", "spotlight", "formula", "worked_example", "analogy", "teacher_note"];
const ACTIVE_TYPES: SlideType[] = ["multiple_choice", "true_false", "fill_blank", "match_it", "order_it", "knowledge_burst"];

function SlideTypePicker({ onSelect, onClose, isCheckpoint }: { onSelect: (t: SlideType) => void; onClose: () => void; isCheckpoint?: boolean }) {
  const groups = isCheckpoint
    ? [{ label: "Questions", types: ACTIVE_TYPES, desc: "Only questions allowed in Checkpoints" }]
    : [
        { label: "Passive — Teach the content", types: PASSIVE_TYPES, desc: "Learners read and absorb (aim for ~30%)" },
        { label: "Active — Test understanding", types: ACTIVE_TYPES, desc: "Learners interact and respond (aim for ~70%)" },
      ];

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "var(--app-text-secondary)", backdropFilter: "blur(6px)", zIndex: 200 }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
          style={{ background: "var(--app-card)", borderRadius: 24, width: "100%", maxWidth: 860, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}>

          <div style={{ padding: "22px 28px", borderBottom: "1px solid var(--app-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 750, color: "var(--app-text-primary)", letterSpacing: "-0.02em" }}>{isCheckpoint ? "Add a Question" : "Add a Slide"}</h2>
              {!isCheckpoint && <p style={{ fontSize: "12.5px", color: "var(--app-text-secondary)", marginTop: 2 }}>Good lessons are ~70% active (interactive) and ~30% passive (explanatory).</p>}
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid var(--app-border)", background: "var(--app-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={15} /></button>
          </div>

          <div style={{ padding: "20px 28px 28px", overflowY: "auto", maxHeight: "65vh" }}>
            {groups.map(group => (
              <div key={group.label} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <p style={{ fontSize: "10.5px", fontWeight: 750, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--app-text-secondary)" }}>{group.label}</p>
                  <div style={{ flex: 1, height: 1, background: "var(--app-border)" }} />
                  <p style={{ fontSize: "11px", color: "var(--app-text-secondary)" }}>{group.desc}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {group.types.map(t => {
                    const cfg = SLIDE_CONF[t];
                    return (
                      <motion.button key={t} onClick={() => onSelect(t)} whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }} transition={{ duration: 0.12 }}
                        style={{ padding: "16px 14px", borderRadius: 14, border: `1.5px solid ${cfg.color}25`, background: cfg.bg, textAlign: "left", cursor: "pointer" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${cfg.color}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                          <cfg.icon size={18} style={{ color: cfg.color }} />
                        </div>
                        <p style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--app-text-primary)", marginBottom: 3 }}>{cfg.label}</p>
                        <p style={{ fontSize: "11px", color: "var(--app-text-secondary)", lineHeight: 1.4 }}>{cfg.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   STAGE CONFIRM MODAL (me only — no dropdown)
═══════════════════════════════════════════════ */
function StageConfirmModal({ me, onStage, onClose }: { me: Collaborator; onStage: () => void; onClose: () => void }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "var(--app-text-secondary)", backdropFilter: "blur(4px)", zIndex: 200 }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
          style={{ background: "var(--app-card)", borderRadius: 22, width: 420, padding: "28px", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 750, letterSpacing: "-0.02em", marginBottom: 8 }}>Stage for Review</h2>
          <p style={{ fontSize: "14px", color: "var(--app-text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>This lesson will be marked as staged and attributed to you. Other collaborators will be notified.</p>
          <div style={{ padding: "14px 16px", background: "rgba(255,107,0,0.05)", border: "1.5px solid rgba(255,107,0,0.15)", borderRadius: 12, display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: me.color, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--app-text-primary)", fontWeight: 800, fontSize: "13px" }}>{me.initials}</div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)" }}>{me.name}</p>
              <p style={{ fontSize: "12px", color: "var(--app-text-secondary)" }}>Staging as you — the current author</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px", border: "1.5px solid var(--app-border)", borderRadius: 12, background: "var(--app-card)", cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "var(--app-text-secondary)" }}>Cancel</button>
            <button onClick={onStage} style={{ flex: 1, padding: "12px", border: "none", borderRadius: 12, background: "#FF6B00", color: "var(--app-text-primary)", cursor: "pointer", fontSize: "14px", fontWeight: 700 }}>Confirm Stage</button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   HISTORY PANEL
═══════════════════════════════════════════════ */
const HISTORY_ENTRIES = [
  { id: "h1", author: "CM", color: "#FF6B00", action: "Staged Level 1 for review", time: "Just now" },
  { id: "h2", author: "SJ", color: "#818CF8", action: "Added MCQ to Lesson 2", time: "5 min ago" },
  { id: "h3", author: "CM", color: "#FF6B00", action: "Created Checkpoint 1", time: "1 hour ago" },
  { id: "h4", author: "SJ", color: "#818CF8", action: "Edited Concept Card: Quadratic Roots", time: "2 hours ago" },
];

function HistoryPanel({ me, onClose }: any) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "var(--app-border)", zIndex: 200 }} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 340, damping: 32 }}
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 340, background: "var(--app-card)", borderLeft: "1px solid var(--app-border)", zIndex: 201, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--app-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Version History</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)" }}><X size={16} /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {HISTORY_ENTRIES.map(e => (
            <div key={e.id} style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: e.color, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--app-text-primary)", fontSize: "11px", fontWeight: 800, flexShrink: 0 }}>{e.author}</div>
              <div>
                <p style={{ fontSize: "13px", color: "var(--app-text-primary)", lineHeight: 1.5 }}>{e.action}</p>
                <p style={{ fontSize: "11px", color: "var(--app-text-secondary)", marginTop: 2 }}>{e.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
