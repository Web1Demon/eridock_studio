"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, ListTree, Network, Search, Sparkles, ChevronRight,
  ChevronDown, CheckCircle2, AlertCircle, PlayCircle, BookOpen, Hash,
  Lightbulb, PanelRightClose, PanelRightOpen, ArrowUpRight, Lock,
  Plus, X, Calculator, Zap, Leaf, BookText, Landmark, Globe, BarChart2,
  TrendingUp, FlaskConical, Brain, Check, GraduationCap, Target, Atom,
  MessageSquare, Triangle, Pen, Users, ClipboardList, CheckSquare,
  Square, ArrowRight, AlertTriangle
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────── */
type NodeType = "curriculum" | "subject" | "topic" | "concept" | "lesson";
type NodeStatus = "published" | "review" | "draft" | "needs_attention";
interface Objective { id: string; text: string; done: boolean; }
interface CurriculumNode {
  id: string; type: NodeType; title: string; description?: string;
  status?: NodeStatus; quality?: number; aiFlags?: string[];
  children?: CurriculumNode[]; dependencies?: string[];
  objectives?: Objective[];
}

/* ─────────────────────────────────────────────────────────────────
   AI SMART ICON  (keyword → Lucide icon)
───────────────────────────────────────────────────────────────── */
function getSmartIcon(title: string, type: NodeType) {
  const t = title.toLowerCase();
  if (/quadratic|polynomial|algebra|equation|variable|simultaneous|linear/.test(t)) return Calculator;
  if (/geometr|triangle|polygon|trigonometr|circle|angle/.test(t)) return Triangle;
  if (/statistic|probability|data analysis|set/.test(t)) return BarChart2;
  if (/function|graph|curve|differential|integral/.test(t)) return TrendingUp;
  if (/mechanic|force|motion|kinematic|dynamic|newton|thermodynam|wave/.test(t)) return Zap;
  if (/chemist|atom|element|bond|isotop|molecule|organic|reaction/.test(t)) return FlaskConical;
  if (/biolog|cell|organism|genetic|photosynthes|mitosis|ecology|evolution/.test(t)) return Leaf;
  if (/comprehension|reading|english|essay|writing|fiction|grammar|oral/.test(t)) return BookText;
  if (/histor|revolution|war|scramble|colonial|empire|independence/.test(t)) return Landmark;
  if (/geography|earth|climate|continent|map|resource|population/.test(t)) return Globe;
  if (/physic/.test(t)) return Zap;
  if (/math|number|arithmetic/.test(t)) return Calculator;
  if (/atomic|nuclear|quantum/.test(t)) return Atom;
  if (/language|literature|spoken/.test(t)) return MessageSquare;
  if (/logic|critical|thinking|philosophy/.test(t)) return Brain;
  const defaults: Record<NodeType, any> = {
    curriculum: GraduationCap, subject: Hash, topic: LayoutGrid,
    concept: Lightbulb, lesson: PlayCircle,
  };
  return defaults[type] ?? BookOpen;
}

/* ─────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────── */
const WAEC_TREE: CurriculumNode = {
  id: "c_waec", type: "curriculum", title: "WAEC SS1–SS3", quality: 92,
  description: "West African Examinations Council curriculum for Senior Secondary, covering core Science and Arts pathways.",
  children: [
    {
      id: "sub_math_waec", type: "subject", title: "Mathematics", status: "published", quality: 96,
      description: "Pure and applied mathematics at secondary level.",
      objectives: [
        { id: "m1", text: "Build algebraic reasoning from first principles", done: true },
        { id: "m2", text: "Apply geometry to real-world measurement problems", done: true },
        { id: "m3", text: "Introduce probability and statistical interpretation", done: false },
      ],
      children: [
        {
          id: "top_alg_waec", type: "topic", title: "Algebraic Processes", quality: 95,
          description: "Foundation of abstract reasoning through symbols and equations.",
          objectives: [
            { id: "a1", text: "Understand variables and constants", done: true },
            { id: "a2", text: "Solve linear equations with one unknown", done: true },
            { id: "a3", text: "Apply algebraic methods to real-world problems", done: false },
          ],
          children: [
            {
              id: "con_lin_waec", type: "concept", title: "Linear Equations", status: "published", quality: 98,
              objectives: [{ id: "l1", text: "Solve one-variable equations fluently", done: true }, { id: "l2", text: "Translate word problems to equations", done: false }],
              children: [
                { id: "les_lin_1", type: "lesson", title: "Solving one-variable equations", status: "published" },
                { id: "les_lin_2", type: "lesson", title: "Word problems to equations", status: "review", aiFlags: ["Missing visual examples"] },
              ]
            },
            {
              id: "con_quad_waec", type: "concept", title: "Quadratic Equations", status: "review", quality: 82, dependencies: ["con_lin_waec"],
              aiFlags: ["High cognitive load across 3 lessons", "Prerequisite coverage 62%"],
              objectives: [{ id: "q1", text: "Identify quadratic expressions", done: false }, { id: "q2", text: "Solve by factorization", done: false }, { id: "q3", text: "Apply the quadratic formula", done: false }],
              children: [
                { id: "les_poly", type: "lesson", title: "Introduction to Polynomials", status: "published" },
                { id: "les_fact", type: "lesson", title: "Factorization Method", status: "needs_attention", aiFlags: ["Prerequisite gap", "High cognitive load"] },
                { id: "les_comp", type: "lesson", title: "Completing the Square", status: "draft" },
              ]
            },
          ]
        },
        {
          id: "top_geom_waec", type: "topic", title: "Geometry & Trigonometry", quality: 88,
          objectives: [{ id: "g1", text: "Define shapes and their properties", done: true }, { id: "g2", text: "Apply Pythagoras theorem", done: true }, { id: "g3", text: "Use SOH-CAH-TOA", done: false }],
          children: [{ id: "con_tri_waec", type: "concept", title: "Triangles & Polygons", status: "published" }]
        },
      ]
    },
    {
      id: "sub_phy_waec", type: "subject", title: "Physics", status: "review", quality: 85,
      objectives: [{ id: "p1", text: "Describe motion using kinematic equations", done: true }, { id: "p2", text: "Apply Newton's Laws to real scenarios", done: false }],
      children: [
        {
          id: "top_mech_waec", type: "topic", title: "Mechanics", quality: 84,
          objectives: [{ id: "k1", text: "Derive kinematic equations", done: true }, { id: "k2", text: "Distinguish mass from weight", done: false }],
          children: [
            { id: "con_kine_waec", type: "concept", title: "Kinematics", status: "published" },
            { id: "con_dyn_waec", type: "concept", title: "Dynamics (Newton's Laws)", status: "draft", dependencies: ["con_kine_waec"] },
          ]
        }
      ]
    },
  ]
};

const JAMB_TREE: CurriculumNode = {
  id: "c_jamb", type: "curriculum", title: "JAMB UTME", quality: 89,
  description: "Joint Admissions and Matriculation Board UTME syllabus designed for university entrance qualification across Nigeria.",
  children: [
    {
      id: "sub_eng_jamb", type: "subject", title: "Use of English", status: "published", quality: 94,
      objectives: [{ id: "e1", text: "Identify main ideas and supporting details", done: true }, { id: "e2", text: "Summarise passages within word limits", done: true }],
      children: [
        {
          id: "top_comp_jamb", type: "topic", title: "Comprehension & Summary", quality: 90,
          objectives: [{ id: "c1", text: "Read passages with critical awareness", done: true }, { id: "c2", text: "Write precise summaries", done: false }],
          children: [{ id: "con_read_jamb", type: "concept", title: "Reading for Main Idea", status: "published" }]
        }
      ]
    },
    {
      id: "sub_chem_jamb", type: "subject", title: "Chemistry", status: "draft", quality: 78,
      aiFlags: ["Missing 14 core concepts per JAMB syllabus"],
      objectives: [{ id: "ch1", text: "Understand atomic structure and bonding", done: false }, { id: "ch2", text: "Apply IUPAC naming conventions", done: false }],
      children: [
        {
          id: "top_atom_jamb", type: "topic", title: "Atomic Structure", quality: 80,
          objectives: [{ id: "at1", text: "Describe the structure of an atom", done: false }, { id: "at2", text: "Explain isotopes and their significance", done: false }],
          children: [{ id: "con_iso_jamb", type: "concept", title: "Isotopy", status: "draft" }]
        }
      ]
    }
  ]
};

const ALL_CURRICULUMS = [WAEC_TREE, JAMB_TREE];

/* ─────────────────────────────────────────────────────────────────
   TREE UTILITIES
───────────────────────────────────────────────────────────────── */
function findNode(node: CurriculumNode, id: string): CurriculumNode | null {
  if (node.id === id) return node;
  for (const c of node.children ?? []) { const f = findNode(c, id); if (f) return f; }
  return null;
}
function updateNode(root: CurriculumNode, id: string, fn: (n: CurriculumNode) => CurriculumNode): CurriculumNode {
  if (root.id === id) return fn(root);
  return { ...root, children: root.children?.map(c => updateNode(c, id, fn)) };
}

/* ─────────────────────────────────────────────────────────────────
   ANIMATION TOKENS
───────────────────────────────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } };

/* ═════════════════════════════════════════════════════════════════
   MAIN WORKSPACE
═════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────
   KNOWLEDGE MAP EDITOR (Figma-Style SVG Node Graph)
───────────────────────────────────────────────────────────────── */
function KnowledgeMapEditor({ tree, onNodeClick, onGenerateNode }: { tree: CurriculumNode, onNodeClick: (id: string) => void, onGenerateNode: () => void }) {
  const [nodes, setNodes] = useState<{ id: string, title: string, type: NodeType, x: number, y: number, quality: number, status: string, missing?: boolean }[]>([]);
  const [edges, setEdges] = useState<{ source: string, target: string }[]>([]);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  useEffect(() => {
    // Flatten tree into a grid-like structure for the visual map
    const flatNodes: any[] = [];
    const flatEdges: any[] = [];
    
    let yOffset = 50;
    const traverse = (node: CurriculumNode, depth: number, xStart: number) => {
      flatNodes.push({ id: node.id, title: node.title, type: node.type, x: xStart, y: yOffset, quality: node.quality || 0, status: node.status || 'draft' });
      const currentId = node.id;
      
      if (node.children) {
        yOffset += 120;
        let cX = xStart - ((node.children.length - 1) * 200) / 2;
        node.children.forEach(c => {
          flatEdges.push({ source: currentId, target: c.id });
          traverse(c, depth + 1, cX);
          cX += 200;
        });
        yOffset -= 120; // reset for siblings
      }
    };
    traverse(tree, 0, window.innerWidth / 2 - 100);
    
    // AI Recommended Node (Mock)
    if (tree.id === "c_waec") {
      flatNodes.push({ id: "ai_rec_1", title: "Indices & Logarithms", type: "concept", x: (window.innerWidth / 2 - 100) + 200, y: 170, quality: 0, status: "draft", missing: true });
      flatEdges.push({ source: "top_alg_waec", target: "ai_rec_1" });
    }

    setNodes(flatNodes);
    setEdges(flatEdges);
  }, [tree]);

  const handleDrag = (id: string, dx: number, dy: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x: n.x + dx, y: n.y + dy } : n));
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "var(--app-bg)", overflow: "hidden", backgroundImage: "radial-gradient(var(--app-border) 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
      
      <div style={{ position: "absolute", top: 20, left: 20, background: "var(--app-card)", padding: "12px 16px", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid var(--app-border)", zIndex: 10 }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)" }}>Curriculum Map</h3>
        <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", marginTop: 2 }}>Drag nodes to organize. Red nodes are AI suggestions.</p>
      </div>

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {edges.map((e, i) => {
          const s = nodes.find(n => n.id === e.source);
          const t = nodes.find(n => n.id === e.target);
          if (!s || !t) return null;
          const isMissing = t.missing;
          return (
            <path
              key={i}
              d={`M ${s.x + 80} ${s.y + 40} C ${s.x + 80} ${s.y + 100}, ${t.x + 80} ${t.y - 20}, ${t.x + 80} ${t.y}`}
              fill="none"
              stroke={isMissing ? "#DC2626" : "var(--app-border)"}
              strokeWidth={isMissing ? 2 : 1.5}
              strokeDasharray={isMissing ? "4 4" : "none"}
            />
          );
        })}
      </svg>

      {nodes.map(n => {
        const Icon = getSmartIcon(n.title, n.type);
        const typeColors: any = { curriculum: "var(--app-text-primary)", subject: "#2563EB", topic: "#7C3AED", concept: "#FF6B00", lesson: "#16A34A" };
        const color = typeColors[n.type] || "var(--app-text-primary)";
        
        return (
          <motion.div
            key={n.id}
            drag
            dragMomentum={false}
            onDrag={(e, info) => handleDrag(n.id, info.delta.x, info.delta.y)}
            onDragStart={() => setDraggedNode(n.id)}
            onDragEnd={() => setDraggedNode(null)}
            style={{
              position: "absolute", x: n.x, y: n.y, width: 160, background: n.missing ? "rgba(220,38,38,0.05)" : "var(--app-card)",
              border: `1.5px solid ${n.missing ? "#DC2626" : "var(--app-border)"}`, borderRadius: 12, padding: "12px",
              cursor: "grab", boxShadow: draggedNode === n.id ? "0 12px 24px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.04)",
              zIndex: draggedNode === n.id ? 10 : 1
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: `${color}15`, color: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={14} />
              </div>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--app-text-secondary)" }}>{n.type}</span>
            </div>
            <h4 style={{ fontSize: "13px", fontWeight: 650, color: n.missing ? "#DC2626" : "var(--app-text-primary)", lineHeight: 1.3 }}>{n.title}</h4>
            
            {n.missing && (
              <button onClick={onGenerateNode} style={{ marginTop: 10, width: "100%", padding: "6px", background: "#DC2626", color: "var(--app-card)", border: "none", borderRadius: 6, fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <Sparkles size={12} /> Generate Lesson
              </button>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

export default function CurriculumWorkspace() {
  const [mode, setMode]                   = useState<"overview" | "explorer" | "map">("explorer");
  const [activeCurriculumId, setActiveCurId] = useState("c_waec");
  const [selectedNodeId, setSelectedNodeId]  = useState("sub_math_waec");
  const [panelOpen, setPanelOpen]         = useState(true);
  const [searchOpen, setSearchOpen]       = useState(false);
  const [searchVal, setSearchVal]         = useState("");
  const [showNewMenu, setShowNewMenu]     = useState(false);
  const [wizardType, setWizardType]       = useState<"subject" | "topic" | "concept" | null>(null);
  const [editNodeId, setEditNodeId]       = useState<string | null>(null);
  const [trees, setTrees]                 = useState(ALL_CURRICULUMS);

  const searchRef  = useRef<HTMLInputElement>(null);
  const newMenuRef = useRef<HTMLDivElement>(null);

  const activeTree = trees.find(c => c.id === activeCurriculumId) ?? trees[0];
  const selectedNode = findNode(activeTree, selectedNodeId) ?? activeTree;

  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (newMenuRef.current && !newMenuRef.current.contains(e.target as Node)) setShowNewMenu(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const patchTree = (id: string, updates: Partial<CurriculumNode>) =>
    setTrees(prev => prev.map(c => c.id === activeCurriculumId ? updateNode(c, id, n => ({ ...n, ...updates })) : c));

  const addNode = (parentId: string, node: CurriculumNode) =>
    setTrees(prev => prev.map(c => c.id === activeCurriculumId
      ? updateNode(c, parentId, n => ({ ...n, children: [...(n.children ?? []), node] })) : c));

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "var(--font-sans)" }}>

      {/* ── CREATION WIZARD OVERLAY ── */}
      <AnimatePresence>
        {wizardType && (
          <CreationWizard
            type={wizardType}
            tree={activeTree}
            onClose={() => setWizardType(null)}
            onSubmit={(parentId, node) => { addNode(parentId, node); setWizardType(null); }}
          />
        )}
      </AnimatePresence>

      {/* ── MAIN COLUMN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* HEADER */}
        <header style={{ height: 58, borderBottom: "1px solid var(--app-border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0, background: "var(--app-card)", gap: 16 }}>

          {/* LEFT */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>

            {/* Animated WAEC / JAMB Switcher */}
            <div style={{ display: "flex", position: "relative", background: "var(--app-border-glow)", borderRadius: 10, padding: 3 }}>
              {trees.map(c => {
                const active = c.id === activeCurriculumId;
                const hasBug = c.aiFlags && c.aiFlags.length > 0;
                return (
                  <button key={c.id} onClick={() => { setActiveCurId(c.id); setSelectedNodeId(c.id); }}
                    style={{ position: "relative", padding: "5px 16px", borderRadius: 7, border: "none", background: "transparent", cursor: "pointer", zIndex: 1, outline: "none" }}>
                    {active && (
                      <motion.div layoutId="curr-pill"
                        style={{ position: "absolute", inset: 0, background: "var(--app-card)", borderRadius: 7, boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }}
                        transition={{ type: "spring", stiffness: 500, damping: 42 }}
                      />
                    )}
                    <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 5, fontSize: "13px", fontWeight: active ? 650 : 460, color: active ? "var(--app-text-primary)" : "var(--app-text-secondary)", letterSpacing: "-0.01em", transition: "color 0.18s" }}>
                      {c.id === "c_waec" ? "WAEC" : "JAMB"}
                      {hasBug && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#DC2626", display: "inline-block", flexShrink: 0 }} />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ width: 1, height: 18, background: "var(--app-border-glow)" }} />

            {/* + Add Dropdown */}
            <div ref={newMenuRef} style={{ position: "relative" }}>
              <button onClick={() => setShowNewMenu(v => !v)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", background: "rgba(255,107,0,0.08)", color: "#FF6B00", borderRadius: 7, fontSize: "12.5px", fontWeight: 620, border: "1px solid rgba(255,107,0,0.18)", cursor: "pointer" }}>
                <Plus size={13} />
                Add
                <ChevronDown size={11} style={{ transform: showNewMenu ? "rotate(180deg)" : "none", transition: "transform 0.18s" }} />
              </button>
              <AnimatePresence>
                {showNewMenu && (
                  <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.14 }}
                    style={{ position: "absolute", top: "calc(100% + 7px)", left: 0, zIndex: 200, background: "var(--app-card)", border: "1px solid var(--app-border)", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: 210, padding: "6px 0", overflow: "hidden" }}>
                    {([
                      { type: "subject" as const, label: "Add Subject",  desc: "A new subject area",        Icon: Hash },
                      { type: "topic"   as const, label: "Add Topic",    desc: "Under an existing subject", Icon: LayoutGrid },
                      { type: "concept" as const, label: "Add Subtopic", desc: "Under an existing topic",   Icon: Lightbulb },
                    ]).map(({ type, label, desc, Icon }) => (
                      <button key={type} onClick={() => { setWizardType(type); setShowNewMenu(false); }}
                        style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--app-border-glow)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--app-border-glow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={13} color="var(--app-text-secondary)" />
                        </div>
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--app-text-primary)", marginBottom: 1 }}>{label}</p>
                          <p style={{ fontSize: "11px", color: "var(--app-text-secondary)" }}>{desc}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ width: 1, height: 18, background: "var(--app-border-glow)" }} />

            {/* Mode Switcher */}
            <div style={{ display: "flex", background: "var(--app-border-glow)", borderRadius: 8, padding: 3 }}>
              {([
                { id: "overview", label: "Overview",      icon: LayoutGrid },
                { id: "explorer", label: "Explorer",      icon: ListTree },
                { id: "map",      label: "Knowledge Map", icon: Network },
              ] as const).map(m => {
                const active = mode === m.id;
                const Icon = m.icon;
                return (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 6, fontSize: "12px", fontWeight: active ? 620 : 490, color: active ? "var(--app-text-primary)" : "var(--app-text-secondary)", background: active ? "var(--app-card)" : "transparent", boxShadow: active ? "0 1px 4px rgba(0,0,0,0.06)" : "none", border: "none", cursor: "pointer", transition: "all 0.18s" }}>
                    <Icon size={13} strokeWidth={active ? 2 : 1.6} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Animated Search */}
            <motion.div animate={{ width: searchOpen ? 220 : 32 }} transition={{ type: "spring", stiffness: 480, damping: 40 }}
              style={{ position: "relative", height: 32, borderRadius: 8, border: `1px solid ${searchOpen ? "rgba(255,107,0,0.3)" : "var(--app-border-glow)"}`, background: searchOpen ? "var(--app-card)" : "var(--app-border-glow)", display: "flex", alignItems: "center", overflow: "hidden", boxShadow: searchOpen ? "0 0 0 3px rgba(255,107,0,0.08)" : "none", transition: "border-color 0.2s, box-shadow 0.2s" }}>
              <button onClick={() => setSearchOpen(true)} style={{ flexShrink: 0, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
                <Search size={14} style={{ color: searchOpen ? "#FF6B00" : "var(--app-text-secondary)", transition: "color 0.18s" }} />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.input ref={searchRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} value={searchVal}
                    onChange={e => setSearchVal(e.target.value)} onBlur={() => { if (!searchVal) setSearchOpen(false); }}
                    placeholder="Search curriculum…"
                    style={{ flex: 1, height: "100%", background: "none", border: "none", outline: "none", fontSize: "13px", color: "var(--app-text-primary)", paddingRight: 8 }} />
                )}
              </AnimatePresence>
              {searchOpen && searchVal && (
                <button onClick={() => { setSearchVal(""); setSearchOpen(false); }} style={{ flexShrink: 0, width: 24, height: 24, marginRight: 4, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--app-border-glow)", border: "none", cursor: "pointer" }}>
                  <X size={11} color="var(--app-text-secondary)" />
                </button>
              )}
            </motion.div>

            <button onClick={() => setPanelOpen(v => !v)}
              style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--app-border)", background: panelOpen ? "rgba(255,107,0,0.06)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.18s" }}>
              {panelOpen ? <PanelRightClose size={15} color="#FF6B00" /> : <PanelRightOpen size={15} color="var(--app-text-secondary)" />}
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main style={{ flex: 1, overflowY: "auto", padding: "0", background: "var(--app-bg)" }}>
          <AnimatePresence mode="wait">
            {mode === "overview" && <OverviewMode key="ov" data={activeTree} />}
            {mode === "explorer" && <ExplorerMode key="ex" data={activeTree} selected={selectedNodeId} onSelect={setSelectedNodeId} />}
            {mode === "map"      && <KnowledgeMapMode key="km" data={activeTree} onSelect={id => { setSelectedNodeId(id); setMode("explorer"); }} />}
          </AnimatePresence>
        </main>
      </div>

      {/* ── CONTEXT PANEL ── */}
      <AnimatePresence>
        {panelOpen && (
          <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 340, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderLeft: "1px solid var(--app-border-glow)", background: "var(--app-card)", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
            <ContextPanel node={selectedNode} isEditing={editNodeId === selectedNode.id}
              onEdit={() => setEditNodeId(selectedNode.id)}
              onSave={updates => { patchTree(selectedNode.id, updates); setEditNodeId(null); }}
              onCancel={() => setEditNodeId(null)} />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   OVERVIEW MODE
═════════════════════════════════════════════════════════════════ */
function OverviewMode({ data }: { data: CurriculumNode }) {
  const subjects = data.children ?? [];
  const totalTopics = subjects.flatMap(s => s.children ?? []).length;
  const totalConcepts = subjects.flatMap(s => s.children ?? []).flatMap(t => t.children ?? []).length;

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" style={{ padding: "48px 48px 72px" }}>

      {/* Hero */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 48 }}>
        <div style={{ maxWidth: 480 }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#FF6B00", marginBottom: 10 }}>
            {data.id === "c_waec" ? "WAEC SS1–SS3" : "JAMB UTME"}
          </p>
          <h1 style={{ fontSize: "36px", fontWeight: 720, letterSpacing: "-0.035em", lineHeight: 1.12, color: "var(--app-text-primary)", marginBottom: 14 }}>
            Curriculum<br />Health Overview
          </h1>
          <p style={{ fontSize: "15px", lineHeight: 1.65, color: "var(--app-text-secondary)", fontWeight: 430, maxWidth: 380 }}>
            {data.description ?? "A living knowledge system tracking coverage, quality, and learning pathway integrity."}
          </p>
        </div>

        {/* Inline SVG Illustration – knowledge architect */}
        <div style={{ flexShrink: 0, width: 240, height: 180, opacity: 0.85 }}>
          <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            {/* Background blob */}
            <ellipse cx="120" cy="110" rx="110" ry="65" fill="#FFF4ED" />
            {/* Knowledge nodes */}
            <circle cx="60"  cy="80"  r="18" fill="var(--app-card)" stroke="#FF6B00" strokeWidth="2" />
            <circle cx="120" cy="50"  r="22" fill="var(--app-card)" stroke="#FF6B00" strokeWidth="2.5" />
            <circle cx="185" cy="80"  r="16" fill="var(--app-card)" stroke="#E4E2DE" strokeWidth="1.5" />
            <circle cx="150" cy="130" r="14" fill="var(--app-card)" stroke="#E4E2DE" strokeWidth="1.5" />
            <circle cx="80"  cy="140" r="12" fill="var(--app-card)" stroke="#E4E2DE" strokeWidth="1.5" />
            {/* Connecting lines */}
            <line x1="60" y1="80" x2="120" y2="50" stroke="#FF6B00" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="120" y1="50" x2="185" y2="80" stroke="#E4E2DE" strokeWidth="1.5" />
            <line x1="185" y1="80" x2="150" y2="130" stroke="#E4E2DE" strokeWidth="1.5" />
            <line x1="120" y1="50" x2="80"  y2="140" stroke="#E4E2DE" strokeWidth="1.5" />
            {/* Icons inside nodes */}
            <text x="60" y="84" textAnchor="middle" fontSize="11" fill="#FF6B00" fontWeight="700">Σ</text>
            <text x="120" y="55" textAnchor="middle" fontSize="14" fill="#FF6B00" fontWeight="700">∇</text>
            <text x="185" y="84" textAnchor="middle" fontSize="10" fill="#8C8A86">λ</text>
            <text x="150" y="134" textAnchor="middle" fontSize="9" fill="#8C8A86">π</text>
            <text x="80" y="144" textAnchor="middle" fontSize="9" fill="#8C8A86">∞</text>
            {/* Pulse ring */}
            <circle cx="120" cy="50" r="30" stroke="#FF6B00" strokeWidth="1" strokeOpacity="0.25" fill="none">
              <animate attributeName="r" values="24;36;24" dur="3s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.25;0;0.25" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, marginBottom: 52, paddingBottom: 48, borderBottom: "1px solid var(--app-border)" }}>
        {([
          { label: "Subjects",         value: subjects.length,  unit: "",   color: "#FF6B00" },
          { label: "Topics",           value: totalTopics,       unit: "",   color: "#2563EB" },
          { label: "Concepts",         value: totalConcepts,     unit: "",   color: "#16A34A" },
          { label: "AI Quality Score", value: data.quality ?? 89, unit: "/100", color: "#9333EA" },
        ]).map(s => (
          <div key={s.label}>
            <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 500, marginBottom: 6, letterSpacing: "-0.005em" }}>{s.label}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontSize: "36px", fontWeight: 720, letterSpacing: "-0.04em", color: "var(--app-text-primary)", lineHeight: 1 }}>{s.value}</span>
              {s.unit && <span style={{ fontSize: "13px", color: "var(--app-text-secondary)", fontWeight: 450 }}>{s.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Two-column body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>

        {/* Subjects at a Glance */}
        <div>
          <h3 style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--app-text-primary)", marginBottom: 20 }}>Subjects at a Glance</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {subjects.map(s => {
              const q = s.quality ?? 75;
              const StatusIcon = s.status === "published" ? CheckCircle2 : AlertCircle;
              const statusColor = s.status === "published" ? "#16A34A" : "#F59E0B";
              const SmartIcon = getSmartIcon(s.title, "subject");
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--app-card)", borderRadius: 10, border: "1px solid var(--app-border)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--app-border-glow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <SmartIcon size={15} color="var(--app-text-secondary)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--app-text-primary)" }}>{s.title}</p>
                      <span style={{ fontSize: "12px", fontWeight: 650, color: "var(--app-text-primary)" }}>{q}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 99, background: "var(--app-border-glow)", overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${q}%` }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        style={{ height: "100%", borderRadius: 99, background: q > 90 ? "#16A34A" : q > 75 ? "#F59E0B" : "#DC2626" }} />
                    </div>
                  </div>
                  <StatusIcon size={14} color={statusColor} style={{ flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Flags + Attention items */}
        <div>
          <h3 style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--app-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 7 }}>
            <AlertCircle size={14} color="#DC2626" /> Requires Attention
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {subjects.flatMap(s => (s.children ?? []).flatMap(t => [t, ...(t.children ?? [])])).filter(n => n.aiFlags?.length).slice(0, 4).map(node => (
              <div key={node.id} style={{ padding: "12px 14px", background: "var(--app-card)", border: "1px solid rgba(220,38,38,0.12)", borderRadius: 10, borderLeft: "3px solid #DC2626" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--app-text-primary)", marginBottom: 4 }}>{node.title}</p>
                {node.aiFlags!.map((f, i) => (
                  <p key={i} style={{ fontSize: "12px", color: "var(--app-text-secondary)", display: "flex", alignItems: "center", gap: 5 }}>
                    <AlertTriangle size={10} color="#F59E0B" style={{ flexShrink: 0 }} /> {f}
                  </p>
                ))}
              </div>
            ))}

            {/* Publishing pipeline */}
            <div style={{ marginTop: 8, padding: "14px", background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.1)", borderRadius: 10 }}>
              <p style={{ fontSize: "12.5px", fontWeight: 650, color: "#2563EB", marginBottom: 6 }}>Publishing Pipeline</p>
              {([
                { label: "Draft",        count: 3, color: "var(--app-text-secondary)" },
                { label: "In Review",    count: 4, color: "#F59E0B" },
                { label: "Ready",        count: 7, color: "#16A34A" },
              ]).map(p => (
                <div key={p.label} style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: "12px", color: "var(--app-text-secondary)" }}>{p.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: 650, color: p.color }}>{p.count} lessons</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   EXPLORER MODE
═════════════════════════════════════════════════════════════════ */
function ExplorerMode({ data, selected, onSelect }: { data: CurriculumNode, selected: string, onSelect: (id: string) => void }) {
  const hasContent = (data.children?.length ?? 0) > 0;
  
  if (!hasContent) {
    return (
      <motion.div variants={fadeUp} initial="hidden" animate="show"
        style={{ maxWidth: 560, margin: "0 auto", padding: "80px 40px", textAlign: "center" }}>
        {/* Animated illustration */}
        <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 36px" }}>
          <motion.div
            animate={{ y: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            style={{ width: 160, height: 160, borderRadius: 36, background: "rgba(255,107,0,0.06)", border: "2px dashed rgba(255,107,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <rect x="10" y="14" width="52" height="8" rx="4" fill="rgba(255,107,0,0.15)" />
              <rect x="10" y="28" width="36" height="6" rx="3" fill="rgba(255,107,0,0.1)" />
              <rect x="10" y="40" width="44" height="6" rx="3" fill="rgba(255,107,0,0.1)" />
              <rect x="10" y="52" width="28" height="6" rx="3" fill="rgba(255,107,0,0.08)" />
              <circle cx="58" cy="56" r="10" fill="#FF6B00" opacity="0.9"/>
              <path d="M55 56H61M58 53V59" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </motion.div>
        </div>

        <h2 style={{ fontSize: "26px", fontWeight: 800, color: "var(--app-text-primary)", letterSpacing: "-0.03em", marginBottom: 12 }}>
          Build Your Curriculum
        </h2>
        <p style={{ fontSize: "15px", color: "var(--app-text-secondary)", lineHeight: 1.65, marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
          Start by adding subjects, then break them down into topics and concepts.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { icon: "📐", label: "Mathematics", color: "#FF6B00" },
              { icon: "⚗️", label: "Chemistry", color: "#2563EB" },
              { icon: "🌍", label: "Geography", color: "#16A34A" },
            ].map(s => (
              <motion.div key={s.label} whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
                style={{ padding: "14px 18px", background: "var(--app-card)", borderRadius: 14, border: "1.5px solid var(--app-border-glow)", textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: "24px", marginBottom: 6 }}>{s.icon}</div>
                <p style={{ fontSize: "12.5px", fontWeight: 650, color: "var(--app-text-primary)" }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", marginTop: 4 }}>
            Click the <strong>+ New</strong> button in the toolbar to add your first subject
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" style={{ maxWidth: 800, margin: "0 auto", padding: "40px 40px 72px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--app-text-secondary)", marginBottom: 20, paddingLeft: 8 }}>
        Knowledge Hierarchy
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TreeNode node={data} depth={0} selected={selected} onSelect={onSelect} />
      </div>
    </motion.div>
  );
}


function TreeNode({ node, depth, selected, onSelect }: { node: CurriculumNode, depth: number, selected: string, onSelect: (id: string) => void }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isSelected = selected === node.id;
  const hasChildren = (node.children?.length ?? 0) > 0;
  const Icon = getSmartIcon(node.title, node.type);

  const statusDot = node.status === "published"       ? { color: "#16A34A", label: "Published" }
                  : node.status === "review"          ? { color: "#F59E0B", label: "Review" }
                  : node.status === "needs_attention" ? { color: "#DC2626", label: "Attention" }
                  : node.status === "draft"           ? { color: "var(--app-border)", label: "Draft" }
                  : null;

  return (
    <div>
      <div onClick={() => { onSelect(node.id); if (hasChildren) setExpanded(v => !v); }}
        style={{ display: "flex", alignItems: "center", padding: "8px 12px", paddingLeft: 12 + depth * 22, borderRadius: 8, background: isSelected ? "rgba(255,107,0,0.06)" : "transparent", border: isSelected ? "1px solid rgba(255,107,0,0.18)" : "1px solid transparent", cursor: "pointer", transition: "all 0.13s ease" }}>
        
        <div style={{ width: 18, display: "flex", justifyContent: "center", marginRight: 6, color: "var(--app-border)", flexShrink: 0 }}>
          {hasChildren
            ? <ChevronRight size={13} style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.18s" }} />
            : <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--app-border)", display: "inline-block" }} />
          }
        </div>

        <Icon size={13} style={{ color: isSelected ? "#FF6B00" : "var(--app-text-secondary)", marginRight: 9, flexShrink: 0 }} />

        <span style={{ fontSize: "14px", fontWeight: isSelected ? 620 : 480, color: isSelected ? "var(--app-text-primary)" : "var(--app-text-primary)", flex: 1, letterSpacing: "-0.01em" }}>
          {node.title}
        </span>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {node.aiFlags?.length ? (
            <div style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(220,38,38,0.09)", color: "#DC2626", padding: "2px 6px", borderRadius: 4, fontSize: "10px", fontWeight: 700 }}>
              <AlertCircle size={9} /> AI
            </div>
          ) : null}
          {statusDot && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: statusDot.color }} />
            </div>
          )}
          {node.quality != null && (
            <span style={{ fontSize: "11px", fontWeight: 600, color: node.quality > 90 ? "#16A34A" : "var(--app-text-secondary)", minWidth: 26, textAlign: "right" }}>{node.quality}</span>
          )}
        </div>
      </div>

      {expanded && hasChildren && (
        <div>
          {node.children!.map(c => (
            <TreeNode key={c.id} node={c} depth={depth + 1} selected={selected} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   KNOWLEDGE MAP MODE  (Dynamic from data)
═════════════════════════════════════════════════════════════════ */
function KnowledgeMapMode({ data, onSelect }: { data: CurriculumNode, onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Build a flat list of positioned nodes — Subjects → Topics
  const W = 700, H = 440;
  const subjects = data.children ?? [];

  // Compute subject positions (left column, spread vertically)
  const subjH = H / (subjects.length + 1);
  type MapNode = { id: string; label: string; x: number; y: number; type: NodeType; status?: NodeStatus; aiFlags?: string[]; quality?: number; parentId?: string };
  const nodes: MapNode[] = [];
  const edges: { from: string; to: string; broken?: boolean }[] = [];

  subjects.forEach((sub, si) => {
    const sy = subjH * (si + 1);
    nodes.push({ id: sub.id, label: sub.title, x: 90, y: sy, type: "subject", status: sub.status, quality: sub.quality });

    const topics = sub.children ?? [];
    const topicH = H / (topics.length + 1);
    topics.forEach((top, ti) => {
      const ty = topicH * (ti + 1);
      nodes.push({ id: top.id, label: top.title, x: 290, y: ty, type: "topic", status: top.status, aiFlags: top.aiFlags, quality: top.quality, parentId: sub.id });
      edges.push({ from: sub.id, to: top.id });

      (top.children ?? []).forEach((con, ci) => {
        const cx = 490;
        const cy = ty + (ci - (top.children!.length - 1) / 2) * 56;
        nodes.push({ id: con.id, label: con.title, x: cx, y: cy, type: "concept", status: con.status, aiFlags: con.aiFlags, parentId: top.id });
        edges.push({ from: top.id, to: con.id, broken: con.dependencies?.length ? true : false });
      });
    });
  });

  const getNode = (id: string) => nodes.find(n => n.id === id);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show"
      style={{ height: "100%", minHeight: 520, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginBottom: 24, alignSelf: "flex-start", paddingLeft: 24 }}>
        {([
          { color: "#FF6B00", label: "Subject" },
          { color: "#2563EB", label: "Topic" },
          { color: "#16A34A", label: "Concept" },
          { color: "#DC2626", label: "Dependency Gap" },
        ]).map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
            <span style={{ fontSize: "11px", color: "var(--app-text-secondary)", fontWeight: 500 }}>{l.label}</span>
          </div>
        ))}
      </div>

      <div style={{ position: "relative", width: W, maxWidth: "100%" }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
          <defs>
            <filter id="glow2">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--app-border)" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((e, i) => {
            const from = getNode(e.from);
            const to   = getNode(e.to);
            if (!from || !to) return null;
            const isHov = hovered === e.from || hovered === e.to;
            const midX  = (from.x + to.x) / 2;
            return (
              <motion.path key={i}
                d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                fill="none"
                stroke={e.broken ? "#DC2626" : isHov ? "#FF6B00" : "var(--app-border)"}
                strokeWidth={isHov ? 2 : 1.5}
                strokeDasharray={e.broken ? "5 4" : "none"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: "easeInOut" }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(n => {
            const nodeColor = n.type === "subject" ? "#FF6B00" : n.type === "topic" ? "#2563EB" : "#16A34A";
            const r = n.type === "subject" ? 20 : n.type === "topic" ? 16 : 12;
            const isHov = hovered === n.id;
            const SmartIcon = getSmartIcon(n.label, n.type);
            return (
              <g key={n.id} style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect(n.id)}>
                {/* Pulse halo */}
                {isHov && (
                  <circle cx={n.x} cy={n.y} r={r + 10} fill="none" stroke={nodeColor} strokeWidth="1" strokeOpacity="0.25">
                    <animate attributeName="r" values={`${r + 6};${r + 16};${r + 6}`} dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <motion.circle cx={n.x} cy={n.y} r={r} fill="var(--app-card)" stroke={n.aiFlags?.length ? "#DC2626" : nodeColor} strokeWidth={isHov ? 2.5 : 1.8}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  filter={isHov ? "url(#glow2)" : "none"} />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={n.type === "subject" ? 10 : 8} fontWeight="700" fill={n.aiFlags?.length ? "#DC2626" : nodeColor}>
                  {n.type === "subject" ? "S" : n.type === "topic" ? "T" : "C"}
                </text>
                <text x={n.x} y={n.y + r + 14} textAnchor="middle" fontSize={n.type === "subject" ? 11 : 10} fontWeight={isHov ? 700 : 500} fill={isHov ? "var(--app-text-primary)" : "var(--app-text-secondary)"}
                  style={{ maxWidth: 100 }}>
                  {n.label.length > 16 ? n.label.slice(0, 15) + "…" : n.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hovered && (() => {
            const n = nodes.find(nd => nd.id === hovered);
            if (!n) return null;
            return (
              <motion.div key={hovered} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ position: "absolute", top: n.y - 80, left: n.x - 80, width: 160, background: "var(--app-text-primary)", color: "var(--app-card)", padding: "10px 12px", borderRadius: 9, pointerEvents: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.18)", zIndex: 10 }}>
                <p style={{ fontSize: "12px", fontWeight: 650, marginBottom: 3 }}>{n.label}</p>
                {n.quality && <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Quality: {n.quality}/100</p>}
                {n.aiFlags?.map((f, i) => <p key={i} style={{ fontSize: "10px", color: "#F59E0B", marginTop: 2 }}>⚠ {f}</p>)}
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Click to explore →</p>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   CONTEXT PANEL
═════════════════════════════════════════════════════════════════ */
function ContextPanel({ node, isEditing, onEdit, onSave, onCancel }: {
  node: CurriculumNode; isEditing: boolean;
  onEdit: () => void; onSave: (u: Partial<CurriculumNode>) => void; onCancel: () => void;
}) {
  const [editTitle, setEditTitle] = useState(node.title);
  const [editDesc,  setEditDesc]  = useState(node.description ?? "");
  const [editObjs,  setEditObjs]  = useState<Objective[]>(node.objectives ?? []);
  const [newObjTxt, setNewObjTxt] = useState("");

  useEffect(() => {
    setEditTitle(node.title);
    setEditDesc(node.description ?? "");
    setEditObjs(node.objectives ?? []);
    setNewObjTxt("");
  }, [node.id, isEditing]);

  const Icon = getSmartIcon(node.title, node.type);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "22px 22px 16px", borderBottom: "1px solid var(--app-border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(255,107,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={13} color="#FF6B00" />
          </div>
          <p style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#FF6B00" }}>{node.type}</p>
        </div>

        {isEditing ? (
          <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
            style={{ width: "100%", fontSize: "17px", fontWeight: 700, color: "var(--app-text-primary)", border: "none", outline: "none", background: "var(--app-border-glow)", borderRadius: 6, padding: "6px 8px", marginBottom: 10, letterSpacing: "-0.015em" }} />
        ) : (
          <h3 style={{ fontSize: "18px", fontWeight: 720, color: "var(--app-text-primary)", lineHeight: 1.25, marginBottom: 10, letterSpacing: "-0.02em" }}>{node.title}</h3>
        )}

        <div style={{ display: "flex", gap: 6 }}>
          {isEditing ? (
            <>
              <button onClick={() => onSave({ title: editTitle, description: editDesc, objectives: editObjs })}
                style={{ flex: 1, padding: "7px 0", background: "var(--app-text-primary)", color: "var(--app-card)", borderRadius: 6, fontSize: "12px", fontWeight: 620, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <Check size={13} /> Save
              </button>
              <button onClick={onCancel} style={{ padding: "7px 12px", background: "var(--app-border-glow)", color: "var(--app-text-secondary)", borderRadius: 6, fontSize: "12px", fontWeight: 580, border: "none", cursor: "pointer" }}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={onEdit} style={{ flex: 1, padding: "7px 0", background: "var(--app-border-glow)", color: "var(--app-text-primary)", borderRadius: 6, fontSize: "12px", fontWeight: 620, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <Pen size={12} /> Edit Details
              </button>
              <button style={{ width: 32, background: "var(--app-border-glow)", color: "var(--app-text-primary)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
                <ArrowUpRight size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Scrollable Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 26 }}>

        {/* Description */}
        <div>
          <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--app-text-secondary)", marginBottom: 8 }}>Description</h4>
          {isEditing ? (
            <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3}
              style={{ width: "100%", fontSize: "13px", color: "var(--app-text-primary)", lineHeight: 1.55, border: "1px solid var(--app-border)", outline: "none", background: "var(--app-border-glow)", borderRadius: 7, padding: "8px 10px", resize: "vertical", fontFamily: "inherit" }} />
          ) : (
            <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", lineHeight: 1.6 }}>
              {node.description ?? "No description yet. Click Edit Details to add one."}
            </p>
          )}
        </div>

        {/* Learning Objectives */}
        {(node.type === "topic" || node.type === "concept" || node.type === "subject") && (
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--app-text-secondary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Target size={11} /> Learning Objectives
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {(isEditing ? editObjs : node.objectives ?? []).map((obj, i) => (
                <div key={obj.id} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <button onClick={() => isEditing && setEditObjs(prev => prev.map((o, j) => j === i ? { ...o, done: !o.done } : o))}
                    style={{ marginTop: 1, flexShrink: 0, background: "none", border: "none", cursor: isEditing ? "pointer" : "default", padding: 0, color: obj.done ? "#16A34A" : "var(--app-border)" }}>
                    {obj.done ? <CheckSquare size={15} /> : <Square size={15} />}
                  </button>
                  <p style={{ fontSize: "12.5px", color: obj.done ? "var(--app-text-secondary)" : "var(--app-text-primary)", lineHeight: 1.5, textDecoration: obj.done ? "line-through" : "none" }}>{obj.text}</p>
                  {isEditing && (
                    <button onClick={() => setEditObjs(prev => prev.filter((_, j) => j !== i))} style={{ marginLeft: "auto", flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)", padding: 0 }}>
                      <X size={11} />
                    </button>
                  )}
                </div>
              ))}

              {/* Coverage bar */}
              {!isEditing && (node.objectives?.length ?? 0) > 0 && (() => {
                const done = (node.objectives ?? []).filter(o => o.done).length;
                const total = (node.objectives ?? []).length;
                const pct = Math.round((done / total) * 100);
                return (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: "11px", color: "var(--app-text-secondary)" }}>Coverage</span>
                      <span style={{ fontSize: "11px", fontWeight: 650, color: "var(--app-text-primary)" }}>{done}/{total}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 99, background: "var(--app-border-glow)", overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        style={{ height: "100%", borderRadius: 99, background: pct === 100 ? "#16A34A" : "#FF6B00" }} />
                    </div>
                  </div>
                );
              })()}

              {/* Add objective (edit mode) */}
              {isEditing && (
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <input value={newObjTxt} onChange={e => setNewObjTxt(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && newObjTxt.trim()) { setEditObjs(prev => [...prev, { id: Date.now().toString(), text: newObjTxt.trim(), done: false }]); setNewObjTxt(""); } }}
                    placeholder="Add objective…"
                    style={{ flex: 1, fontSize: "12px", padding: "6px 9px", border: "1px solid var(--app-border)", borderRadius: 7, outline: "none", background: "var(--app-border-glow)", color: "var(--app-text-primary)", fontFamily: "inherit" }} />
                  <button onClick={() => { if (newObjTxt.trim()) { setEditObjs(prev => [...prev, { id: Date.now().toString(), text: newObjTxt.trim(), done: false }]); setNewObjTxt(""); } }}
                    style={{ padding: "6px 10px", background: "var(--app-text-primary)", color: "var(--app-card)", borderRadius: 7, fontSize: "12px", border: "none", cursor: "pointer" }}>
                    <Plus size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Insights */}
        {node.aiFlags?.length ? (
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--app-text-secondary)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={11} color="#FF6B00" /> AI Flags
            </h4>
            <div style={{ background: "rgba(255,107,0,0.04)", border: "1px solid rgba(255,107,0,0.14)", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
              {node.aiFlags.map((f, i) => (
                <p key={i} style={{ fontSize: "12px", color: "var(--app-text-primary)", lineHeight: 1.5 }}>• {f}</p>
              ))}
              <button style={{ marginTop: 4, alignSelf: "flex-start", fontSize: "12px", fontWeight: 620, color: "#FF6B00", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                Auto-fix with AI →
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--app-text-secondary)", marginBottom: 8 }}>AI Health</h4>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.14)", borderRadius: 8 }}>
              <CheckCircle2 size={14} color="#16A34A" />
              <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", lineHeight: 1.5 }}>No issues detected. This {node.type} is well structured.</p>
            </div>
          </div>
        )}

        {/* Quality */}
        {node.quality != null && (
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--app-text-secondary)", marginBottom: 10 }}>Quality Score</h4>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", border: `3.5px solid ${node.quality > 90 ? "#16A34A" : node.quality > 75 ? "#F59E0B" : "#DC2626"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 720, color: "var(--app-text-primary)", flexShrink: 0 }}>
                {node.quality}
              </div>
              <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", lineHeight: 1.55 }}>
                {node.quality > 90 ? "Excellent — top 15% of all content." : node.quality > 75 ? "Good. A few improvements recommended." : "Needs attention before publishing."}
              </p>
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {node.dependencies?.length ? (
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--app-text-secondary)", marginBottom: 10 }}>Prerequisites</h4>
            {node.dependencies.map(dep => (
              <div key={dep} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--app-border-glow)", borderRadius: 7, fontSize: "12px", color: "var(--app-text-secondary)", marginBottom: 6 }}>
                <Lock size={11} color="var(--app-text-secondary)" />
                Requires: <strong style={{ color: "var(--app-text-primary)" }}>{dep.replace(/.*_/, "").replace(/_/g, " ")}</strong>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   CREATION WIZARD
═════════════════════════════════════════════════════════════════ */
function CreationWizard({ type, tree, onClose, onSubmit }: {
  type: "subject" | "topic" | "concept";
  tree: CurriculumNode;
  onClose: () => void;
  onSubmit: (parentId: string, node: CurriculumNode) => void;
}) {
  const [step, setStep]         = useState(0);
  const [title, setTitle]       = useState("");
  const [desc, setDesc]         = useState("");
  const [parentId, setParentId] = useState(type === "subject" ? tree.id : "");
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [newObj, setNewObj]     = useState("");

  const getParents = (): CurriculumNode[] => {
    if (type === "subject") return [tree];
    if (type === "topic")   return tree.children ?? [];
    // concept → topics
    return (tree.children ?? []).flatMap(s => s.children ?? []);
  };
  const parents = getParents();

  const stepTitles = ["Type & Parent", "Details", "Objectives", "Review"];

  const canAdvance = () => {
    if (step === 0) return parentId !== "";
    if (step === 1) return title.trim().length >= 3;
    return true;
  };

  const handleSubmit = () => {
    const id = `${type}_${Date.now()}`;
    onSubmit(parentId, { id, type, title: title.trim(), description: desc, objectives, status: "draft" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(20,18,16,0.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <motion.div initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ type: "spring", stiffness: 420, damping: 38 }}
        style={{ width: 520, background: "var(--app-card)", borderRadius: 16, boxShadow: "0 24px 80px rgba(0,0,0,0.18)", overflow: "hidden" }}>

        {/* Wizard Header */}
        <div style={{ padding: "24px 28px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#FF6B00", marginBottom: 4 }}>
                New {type.charAt(0).toUpperCase() + type.slice(1)}
              </p>
              <h2 style={{ fontSize: "20px", fontWeight: 720, color: "var(--app-text-primary)", letterSpacing: "-0.025em" }}>{stepTitles[step]}</h2>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--app-border)", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={15} color="var(--app-text-secondary)" />
            </button>
          </div>

          {/* Step Indicator */}
          <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
            {stepTitles.map((_, i) => (
              <div key={i} style={{ height: 3, flex: 1, borderRadius: 99, background: i <= step ? "#FF6B00" : "var(--app-border)", transition: "background 0.3s" }} />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div style={{ padding: "0 28px 24px", minHeight: 240 }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" variants={fadeUp} initial="hidden" animate="show">
                <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--app-text-secondary)", display: "block", marginBottom: 10 }}>
                  {type === "subject" ? "Adding to curriculum:" : `Select parent ${type === "topic" ? "subject" : "topic"}:`}
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {parents.map(p => {
                    const Icon = getSmartIcon(p.title, p.type);
                    const sel = parentId === p.id;
                    return (
                      <button key={p.id} onClick={() => setParentId(p.id)}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${sel ? "#FF6B00" : "var(--app-border-glow)"}`, background: sel ? "rgba(255,107,0,0.05)" : "var(--app-card)", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: sel ? "rgba(255,107,0,0.12)" : "var(--app-border-glow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={14} color={sel ? "#FF6B00" : "var(--app-text-secondary)"} />
                        </div>
                        <p style={{ fontSize: "13.5px", fontWeight: sel ? 640 : 500, color: sel ? "var(--app-text-primary)" : "var(--app-text-secondary)" }}>{p.title}</p>
                        {sel && <CheckCircle2 size={16} color="#FF6B00" style={{ marginLeft: "auto" }} />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="step1" variants={fadeUp} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--app-text-secondary)", display: "block", marginBottom: 7 }}>Title *</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder={`e.g. ${type === "subject" ? "Biology" : type === "topic" ? "Cell Division" : "Mitosis"}`}
                    autoFocus
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1.5px solid var(--app-border)", fontSize: "14px", color: "var(--app-text-primary)", outline: "none", background: "var(--app-bg)", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--app-text-secondary)", display: "block", marginBottom: 7 }}>Description</label>
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="What will learners understand after this?"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1.5px solid var(--app-border)", fontSize: "13px", color: "var(--app-text-primary)", outline: "none", background: "var(--app-bg)", fontFamily: "inherit", resize: "none", lineHeight: 1.55, boxSizing: "border-box" }} />
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" variants={fadeUp} initial="hidden" animate="show">
                <p style={{ fontSize: "12.5px", color: "var(--app-text-secondary)", marginBottom: 14, lineHeight: 1.5 }}>
                  List what learners should be able to do after completing this {type}.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                  {objectives.map((o, i) => (
                    <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--app-border-glow)", borderRadius: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00", flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: "13px", color: "var(--app-text-primary)" }}>{o.text}</span>
                      <button onClick={() => setObjectives(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)", padding: 0 }}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 7 }}>
                  <input value={newObj} onChange={e => setNewObj(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && newObj.trim()) { setObjectives(prev => [...prev, { id: Date.now().toString(), text: newObj.trim(), done: false }]); setNewObj(""); } }}
                    placeholder="Type an objective, press Enter…"
                    style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1.5px solid var(--app-border)", fontSize: "13px", color: "var(--app-text-primary)", outline: "none", background: "var(--app-bg)", fontFamily: "inherit" }} />
                  <button onClick={() => { if (newObj.trim()) { setObjectives(prev => [...prev, { id: Date.now().toString(), text: newObj.trim(), done: false }]); setNewObj(""); } }}
                    style={{ padding: "9px 14px", background: "var(--app-border-glow)", borderRadius: 8, border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--app-text-primary)" }}>Add</button>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" variants={fadeUp} initial="hidden" animate="show">
                <div style={{ padding: "16px", background: "var(--app-border-glow)", borderRadius: 10, border: "1px solid var(--app-border)", marginBottom: 14 }}>
                  <p style={{ fontSize: "11px", color: "var(--app-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{type}</p>
                  <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--app-text-primary)", marginBottom: 6 }}>{title}</p>
                  {desc && <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", lineHeight: 1.5, marginBottom: 8 }}>{desc}</p>}
                  {objectives.length > 0 && (
                    <div style={{ marginTop: 8, borderTop: "1px solid var(--app-border)", paddingTop: 8 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--app-text-secondary)", marginBottom: 6 }}>OBJECTIVES ({objectives.length})</p>
                      {objectives.map(o => <p key={o.id} style={{ fontSize: "12px", color: "var(--app-text-secondary)", marginBottom: 4 }}>• {o.text}</p>)}
                    </div>
                  )}
                </div>
                <p style={{ fontSize: "12px", color: "var(--app-text-secondary)" }}>Status: <strong style={{ color: "#F59E0B" }}>Draft</strong></p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 28px", borderTop: "1px solid var(--app-border)", background: "var(--app-bg)" }}>
          <button onClick={step === 0 ? onClose : () => setStep(s => s - 1)}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--app-border)", background: "none", fontSize: "13px", fontWeight: 580, color: "var(--app-text-secondary)", cursor: "pointer" }}>
            {step === 0 ? "Cancel" : "← Back"}
          </button>
          <button onClick={step === stepTitles.length - 1 ? handleSubmit : () => setStep(s => s + 1)}
            disabled={!canAdvance()}
            style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: canAdvance() ? "var(--app-text-primary)" : "var(--app-border)", color: canAdvance() ? "var(--app-card)" : "var(--app-border)", fontSize: "13px", fontWeight: 640, cursor: canAdvance() ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
            {step === stepTitles.length - 1 ? "Create" : "Continue →"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
