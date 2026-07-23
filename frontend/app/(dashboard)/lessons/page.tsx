"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Pen, Search, Plus, ChevronRight, Clock, BarChart2, BookOpen,
  ArrowRight, Target, Layers, Zap, FileText, GraduationCap, CheckCircle2,
  AlertCircle, RefreshCw, X, Check, Eye, Send, Copy, Archive,
  LayoutGrid, List, Star, Sparkles, Filter, MoreHorizontal, Flame,
  Calculator, FlaskConical, Leaf, Globe, BookText, Hash, PenLine,
  TrendingUp, Brain, Trash2, SlidersHorizontal, Command,
} from "lucide-react";

/* ═════════════════════════════════════════════════════════════════
   TYPES
═════════════════════════════════════════════════════════════════ */
type LessonStatus = "published" | "draft" | "review" | "needs_attention";
type Curriculum   = "WAEC" | "JAMB" | "BOTH";

interface BlockStrip { color: string; width: number }
interface LessonCard {
  id: string; title: string; description: string; subject: string;
  topic: string; subtopic?: string; curriculum: "WAEC" | "JAMB";
  status: LessonStatus; health: number; wordCount: number;
  readingTime: number; blockCount: number; lastEdited: string;
  authors: { initials: string; color: string }[];
  strip: BlockStrip[];
}

/* ═════════════════════════════════════════════════════════════════
   SUBJECT PALETTES
═════════════════════════════════════════════════════════════════ */
const SUBJECT_PALETTE: Record<string, { from: string; to: string; text: string; icon: any }> = {
  "Mathematics": { from: "#4F46E5", to: "#818CF8", text: "#4F46E5", icon: Calculator },
  "Physics":     { from: "#EA580C", to: "#FB923C", text: "#EA580C", icon: Zap },
  "Chemistry":   { from: "#059669", to: "#34D399", text: "#059669", icon: FlaskConical },
  "Biology":     { from: "#16A34A", to: "#86EFAC", text: "#16A34A", icon: Leaf },
  "English":     { from: "#E11D48", to: "#FDA4AF", text: "#E11D48", icon: BookText },
  "Geography":   { from: "#0D9488", to: "#2DD4BF", text: "#0D9488", icon: Globe },
};
function subjectPalette(s: string) { return SUBJECT_PALETTE[s] ?? { from: "#6366F1", to: "#A5B4FC", text: "#6366F1", icon: BookOpen }; }

/* ═════════════════════════════════════════════════════════════════
   CURRICULUM DATA (mirrored from curriculum page)
═════════════════════════════════════════════════════════════════ */
const CURRICULUM_TREE: Record<"WAEC" | "JAMB", Record<string, Record<string, string[]>>> = {
  WAEC: {
    "Mathematics": { "Algebraic Processes": ["Linear Equations","Quadratic Equations","Polynomials","Simultaneous Equations"], "Geometry": ["Triangles & Polygons","Circles","Coordinate Geometry"], "Statistics": ["Data Representation","Probability","Mean, Mode, Median"] },
    "Physics":     { "Dynamics": ["Laws of Motion","Circular Motion"], "Thermodynamics": ["Heat Transfer","Gas Laws"], "Waves": ["Sound Waves","Light & Optics"] },
    "Chemistry":   { "Atomic Structure": ["Chemical Bonds","Periodic Table","Isotopes"], "Organic Chemistry": ["Hydrocarbons","Alcohols & Acids"] },
    "Biology":     { "Cell Biology": ["Cell Structure","Metabolism","Mitosis & Meiosis"], "Genetics": ["DNA & RNA","Heredity & Variation"] },
    "English":     { "Comprehension": ["Reading Strategies","Summary Skills"], "Grammar": ["Tenses","Clauses & Phrases"], "Literature": ["Poetry","Prose & Drama"] },
  },
  JAMB: {
    "Mathematics": { "Number Theory": ["Integers","Fractions & Decimals","Number Bases"], "Algebra": ["Quadratic Equations","Logarithms","Indices"], "Trigonometry": ["Sine Rule","Cosine Rule","Identities"] },
    "Physics":     { "Dynamics": ["Laws of Motion","Projectile Motion"], "Electricity": ["Circuits","Capacitors","Electromagnetic Induction"] },
    "Chemistry":   { "Atomic Structure": ["Chemical Bonds","Isotopes"], "Electrochemistry": ["Electrolysis","Galvanic Cells"] },
    "Biology":     { "Cell Biology": ["Metabolism","Mitosis & Meiosis"], "Ecology": ["Food Chains","Population Dynamics"] },
    "Geography":   { "Physical Geography": ["Landforms","Climate Zones"], "Human Geography": ["Population","Urbanisation"] },
  },
};

/* ═════════════════════════════════════════════════════════════════
   MOCK LESSONS
═════════════════════════════════════════════════════════════════ */
const BK: Record<string,string> = { obj:"#2563EB", misc:"#DC2626", ex:"#16A34A", chk:"#FF6B00", h:"#C4C4C4", p:"#E5E7EB", ins:"#0284C7", call:"#F59E0B" };
const MOCK: LessonCard[] = [
  { id:"l1", title:"Quadratic Equations — Factorization Method", description:"Rigorous walkthrough of solving quadratics by factorization, with real WAEC exam patterns and common pitfalls.", subject:"Mathematics", topic:"Algebraic Processes", subtopic:"Quadratic Equations", curriculum:"WAEC", status:"review", health:82, wordCount:1240, readingTime:8, blockCount:9, lastEdited:"2 hours ago", authors:[{initials:"CM",color:"#FF6B00"},{initials:"AO",color:"#2563EB"}], strip:[{color:BK.obj,width:14},{color:BK.h,width:8},{color:BK.p,width:18},{color:BK.misc,width:12},{color:BK.ex,width:20},{color:BK.ins,width:10},{color:BK.chk,width:18}] },
  { id:"l2", title:"Introduction to Polynomials", description:"Foundational concepts of polynomial expressions, degree, and the relationship to real-world modelling.", subject:"Mathematics", topic:"Algebraic Processes", subtopic:"Polynomials", curriculum:"WAEC", status:"published", health:96, wordCount:980, readingTime:6, blockCount:7, lastEdited:"2 days ago", authors:[{initials:"AO",color:"#2563EB"}], strip:[{color:BK.obj,width:12},{color:BK.p,width:22},{color:BK.call,width:10},{color:BK.ex,width:28},{color:BK.chk,width:18},{color:BK.ins,width:10}] },
  { id:"l3", title:"Newton's First Law of Motion", description:"Inertia, reference frames, and the common misapplication of 'objects in motion stay in motion'.", subject:"Physics", topic:"Dynamics", subtopic:"Laws of Motion", curriculum:"JAMB", status:"draft", health:54, wordCount:440, readingTime:3, blockCount:4, lastEdited:"Just now", authors:[{initials:"CM",color:"#FF6B00"}], strip:[{color:BK.obj,width:18},{color:BK.p,width:36},{color:BK.misc,width:24},{color:BK.chk,width:12}] },
  { id:"l4", title:"Cellular Respiration: ATP & Energy Transfer", description:"Complete oxidation pathway — glycolysis, Krebs cycle, and oxidative phosphorylation with diagram walkthroughs.", subject:"Biology", topic:"Cell Biology", subtopic:"Metabolism", curriculum:"WAEC", status:"published", health:91, wordCount:1800, readingTime:11, blockCount:12, lastEdited:"1 week ago", authors:[{initials:"AO",color:"#2563EB"},{initials:"CM",color:"#FF6B00"}], strip:[{color:BK.obj,width:10},{color:BK.p,width:16},{color:BK.call,width:8},{color:BK.ex,width:18},{color:BK.misc,width:10},{color:BK.p,width:14},{color:BK.ins,width:10},{color:BK.chk,width:14}] },
  { id:"l5", title:"Completing the Square", description:"Transforming standard quadratic form to vertex form — algebraic manipulation technique for WAEC.", subject:"Mathematics", topic:"Algebraic Processes", subtopic:"Quadratic Equations", curriculum:"WAEC", status:"needs_attention", health:38, wordCount:210, readingTime:2, blockCount:3, lastEdited:"1 month ago", authors:[{initials:"CM",color:"#FF6B00"}], strip:[{color:BK.p,width:50},{color:BK.ex,width:30},{color:BK.chk,width:20}] },
  { id:"l6", title:"Chemical Bonding: Ionic & Covalent", description:"Electronegativity-driven bond formation, Lewis structures, and molecular geometry basics.", subject:"Chemistry", topic:"Atomic Structure", subtopic:"Chemical Bonds", curriculum:"JAMB", status:"published", health:88, wordCount:1350, readingTime:9, blockCount:10, lastEdited:"3 days ago", authors:[{initials:"AO",color:"#2563EB"}], strip:[{color:BK.obj,width:12},{color:BK.p,width:20},{color:BK.call,width:8},{color:BK.ex,width:24},{color:BK.misc,width:12},{color:BK.chk,width:14},{color:BK.ins,width:10}] },
];

const STATUS_CFG: Record<LessonStatus,{label:string;color:string;bg:string;pulse:boolean}> = {
  published:       {label:"Published",    color:"#16A34A", bg:"rgba(22,163,74,0.08)",   pulse:false},
  draft:           {label:"Draft",        color:"var(--app-text-secondary)", bg:"var(--app-border-glow)", pulse:false},
  review:          {label:"In Review",    color:"#F59E0B", bg:"rgba(245,158,11,0.08)",  pulse:true},
  needs_attention: {label:"Action Needed",color:"#DC2626", bg:"rgba(220,38,38,0.07)",  pulse:true},
};

/* ═════════════════════════════════════════════════════════════════
   LESSON LIBRARY (Main Page)
═════════════════════════════════════════════════════════════════ */
export default function LessonLibrary() {
  const router = useRouter();
  const [search, setSearch]                 = useState("");
  const [searchFocused, setSearchFocused]   = useState(false);
  const [statusFilter, setStatusFilter]     = useState<"all"|LessonStatus>("all");
  const [statusExpanded, setStatusExpanded] = useState(false);
  const [curriculumFilter, setCurriculumFilter] = useState<"all"|"WAEC"|"JAMB">("all");
  const [view, setView]                     = useState<"grid"|"list">("grid");
  const [wizardOpen, setWizardOpen]         = useState(false);

  const filtered = MOCK
    .filter(l => statusFilter === "all" || l.status === statusFilter)
    .filter(l => curriculumFilter === "all" || l.curriculum === curriculumFilter)
    .filter(l => !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.subject.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    published: MOCK.filter(l=>l.status==="published").length,
    review:    MOCK.filter(l=>l.status==="review").length,
    draft:     MOCK.filter(l=>l.status==="draft"||l.status==="needs_attention").length,
    avgHealth: Math.round(MOCK.reduce((s,l)=>s+l.health,0)/MOCK.length),
  };

  const handleStatusClick = (s: "all"|LessonStatus) => {
    if (s === "all") {
      if (statusFilter !== "all") { setStatusFilter("all"); setStatusExpanded(false); }
      else setStatusExpanded(v => !v);
    } else {
      setStatusFilter(s);
      setStatusExpanded(false);
    }
  };

  return (
    <div style={{minHeight:"100%",background:"var(--app-bg)",fontFamily:"var(--font-sans)"}}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div style={{position:"relative",overflow:"hidden",background: "var(--app-card)",borderBottom:"1px solid var(--app-border-glow)",padding:"52px 56px 40px"}}>
        <div style={{position:"absolute",top:-80,right:-60,width:440,height:440,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,0,0.07) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-60,left:160,width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(79,70,229,0.06) 0%,transparent 70%)",pointerEvents:"none"}}/>

        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",position:"relative"}}>
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <p style={{fontSize:"11.5px",fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--color-brand)",marginBottom:10}}>Lesson Builder</p>
            <h1 style={{fontSize:"40px",fontWeight:780,letterSpacing:"-0.04em",color: "var(--app-text-primary)",lineHeight:1.05,marginBottom:10}}>Knowledge Authoring</h1>
            <p style={{fontSize:"15.5px",color:"var(--app-text-secondary)",letterSpacing:"-0.01em",lineHeight:1.6,maxWidth:460}}>
              Every great lesson begins here. Craft experiences that are precise, pedagogically sound, and curriculum-aligned.
            </p>

            {/* Stats */}
            <div style={{display:"flex",gap:36,marginTop:32}}>
              {[
                {label:"Published",   value:stats.published, color:"#16A34A"},
                {label:"In Review",   value:stats.review,    color:"#F59E0B"},
                {label:"Active Drafts",value:stats.draft,    color:"var(--app-text-secondary)"},
                {label:"Avg Health",  value:`${stats.avgHealth}`,color:stats.avgHealth>80?"#16A34A":"#F59E0B"},
              ].map(s=>(
                <div key={s.label}>
                  <p style={{fontSize:"28px",fontWeight:760,letterSpacing:"-0.04em",color:s.color,lineHeight:1}}>{s.value}</p>
                  <p style={{fontSize:"11.5px",fontWeight:520,color:"var(--app-text-secondary)",marginTop:3}}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Shortcut hint */}
            <p style={{marginTop:18,fontSize:"11.5px",color: "var(--app-text-secondary)",display:"flex",alignItems:"center",gap:6}}>
              <kbd style={{fontSize:"10px",fontWeight:700,background:"var(--app-border-glow)",padding:"2px 7px",borderRadius:5}}>⌘ N</kbd>
              to create a new lesson
            </p>
          </motion.div>

          {/* New Lesson CTA */}
          <motion.button
            initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:0.4,delay:0.15}}
            onClick={()=>setWizardOpen(true)}
            style={{display:"flex",alignItems:"center",gap:10,padding:"15px 26px",background:"linear-gradient(135deg,#141210,#2d2a27)",color:"var(--app-card)",border:"none",borderRadius:14,fontSize:"14.5px",fontWeight:640,cursor:"pointer",flexShrink:0,boxShadow:"0 12px 32px rgba(20,18,16,0.2)",letterSpacing:"-0.01em"}}
            whileHover={{scale:1.03,boxShadow:"0 20px 48px rgba(20,18,16,0.26)"}}
            whileTap={{scale:0.97}}
          >
            <PenLine size={17}/>
            New Lesson
          </motion.button>
        </div>
      </div>

      {/* ── CONTROLS ─────────────────────────────────────────── */}
      <div style={{padding:"20px 56px",background:"var(--app-bg)",display:"flex",gap:12,alignItems:"center",borderBottom:"1px solid var(--app-border-glow)",flexWrap:"wrap"}}>

        {/* Search */}
        <motion.div animate={{width:searchFocused?320:240}} transition={{duration:0.3,ease:[0.16,1,0.3,1]}} style={{position:"relative",flexShrink:0}}>
          <Search size={14} style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:searchFocused?"var(--color-brand)":"var(--app-border)",transition:"color 0.2s"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            onFocus={()=>setSearchFocused(true)} onBlur={()=>setSearchFocused(false)}
            placeholder="Search lessons…"
            style={{width:"100%",padding:"10px 13px 10px 38px",background: "var(--app-card)",border:`1px solid ${searchFocused?"var(--color-brand)":"var(--app-border-glow)"}`,borderRadius:10,fontSize:"13.5px",color: "var(--app-text-primary)",outline:"none",boxShadow:searchFocused?"0 0 0 3px rgba(255,107,0,0.08)":"none",transition:"border-color 0.2s,box-shadow 0.2s"}}/>
          {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--app-border)",display:"flex"}}><X size={12}/></button>}
        </motion.div>

        {/* Curriculum filter */}
        <div style={{display:"flex",background:"var(--app-border-glow)",padding:"3px",borderRadius:10,gap:2}}>
          {(["all","WAEC","JAMB"] as const).map(c=>(
            <button key={c} onClick={()=>setCurriculumFilter(c)}
              style={{padding:"7px 14px",borderRadius:8,border:"none",background:curriculumFilter===c?"var(--app-card)":"transparent",boxShadow:curriculumFilter===c?"0 1px 4px var(--app-border-glow)":"none",fontSize:"12.5px",fontWeight:curriculumFilter===c?680:500,color:curriculumFilter===c?"var(--app-text-primary)":"var(--app-text-secondary)",cursor:"pointer",transition:"all 0.18s"}}>
              {c==="all"?"All":c}
            </button>
          ))}
        </div>

        <div style={{width:1,height:20,background:"var(--app-border-glow)"}}/>

        {/* Status filter — collapsible */}
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {/* "All Status" always visible */}
          <button
            onClick={()=>handleStatusClick("all")}
            style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:20,border:`1.5px solid ${statusFilter==="all"&&!statusExpanded?"var(--app-border)":statusFilter==="all"&&statusExpanded?"var(--app-text-secondary)":"var(--app-border)"}`,background:statusFilter==="all"?"var(--app-border-glow)":"transparent",fontSize:"12.5px",fontWeight:statusFilter==="all"?680:500,color:statusFilter==="all"?"var(--app-text-primary)":"var(--app-text-secondary)",cursor:"pointer",transition:"all 0.15s"}}>
            <Filter size={12}/> All Status
            {statusFilter!=="all"&&<X size={10} onClick={e=>{e.stopPropagation();setStatusFilter("all");setStatusExpanded(false);}}/>}
          </button>

          {/* Expanded status pills */}
          <AnimatePresence>
            {(statusExpanded||statusFilter!=="all")&&(["published","review","draft","needs_attention"] as LessonStatus[]).map((s,i)=>{
              const cfg = STATUS_CFG[s];
              const active = statusFilter===s;
              return (
                <motion.button key={s}
                  initial={{opacity:0,x:-10,scale:0.9}} animate={{opacity:1,x:0,scale:1}} exit={{opacity:0,x:-10,scale:0.9}}
                  transition={{duration:0.22,delay:i*0.04,ease:[0.16,1,0.3,1]}}
                  onClick={()=>handleStatusClick(s)}
                  style={{padding:"7px 14px",  borderRadius:20,border:`1.5px solid ${active?cfg.color:"var(--app-border-glow)"}`,background:active?cfg.bg:"var(--app-card)",fontSize:"12px",fontWeight:active?700:500,color:active?cfg.color:"var(--app-text-secondary)",cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}}>
                  {cfg.pulse&&active&&<span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:cfg.color,marginRight:5,verticalAlign:"middle",animation:"pulse 1.6s ease-in-out infinite"}}/>}
                  {cfg.label}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        <div style={{flex:1}}/>

        {/* View + Count */}
        <p style={{fontSize:"12px",color:"var(--app-border)",flexShrink:0}}>{filtered.length} lesson{filtered.length!==1?"s":""}</p>
        <div style={{display:"flex",background:"var(--app-border-glow)",padding:"3px",borderRadius:8}}>
          {(["grid","list"] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{width:28,height:28,border:"none",borderRadius:6,background:view===v?"var(--app-card)":"transparent",boxShadow:view===v?"0 1px 3px var(--app-border-glow)":"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:view===v?"var(--app-text-primary)":"var(--app-border)"}}>
              {v==="grid"?<LayoutGrid size={13}/>:<List size={13}/>}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <div style={{padding:"36px 56px 120px"}}>
        {filtered.length===0
          ? <EmptyState onCreate={()=>setWizardOpen(true)} hasFilter={statusFilter!=="all"||curriculumFilter!=="all"||!!search} onClear={()=>{setStatusFilter("all");setCurriculumFilter("all");setSearch("");}}/>
          : (
            <motion.div layout style={{display:view==="grid"?"grid":"flex",gridTemplateColumns:view==="grid"?"repeat(auto-fill,minmax(340px,1fr))":undefined,flexDirection:view==="list"?"column":undefined,gap:view==="grid"?24:12}}>
              <AnimatePresence>
                {filtered.map((l,i)=>
                  view==="grid"
                    ? <LessonGridCard key={l.id} lesson={l} index={i} onOpen={()=>router.push(`/lessons/${l.id}`)}/>
                    : <LessonListRow  key={l.id} lesson={l} index={i} onOpen={()=>router.push(`/lessons/${l.id}`)}/>
                )}
              </AnimatePresence>
            </motion.div>
          )}
      </div>

      {/* ── WIZARD ───────────────────────────────────────────── */}
      <AnimatePresence>
        {wizardOpen&&<CreationWizard onClose={()=>setWizardOpen(false)}/>}
      </AnimatePresence>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   HEALTH RING
═════════════════════════════════════════════════════════════════ */
function HealthRing({score,size,showLabel}:{score:number;size:number;showLabel?:boolean}) {
  const r=(size-4)/2, circ=2*Math.PI*r;
  const color=score>80?"#16A34A":score>60?"#F59E0B":"#DC2626";
  return (
    <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--app-border-glow)" strokeWidth={3} fill="none"/>
        <motion.circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={3} fill="none" strokeLinecap="round"
          initial={{strokeDasharray:`0 ${circ}`}}
          animate={{strokeDasharray:`${(score/100)*circ} ${circ-(score/100)*circ}`}}
          transition={{duration:0.9,ease:[0.16,1,0.3,1]}}/>
      </svg>
      {showLabel&&<span style={{fontSize:"12px",fontWeight:680,color,letterSpacing:"-0.02em"}}>{score}</span>}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   LESSON GRID CARD  — bottom drawer on hover
═════════════════════════════════════════════════════════════════ */

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

function LessonGridCard({lesson:l,index,onOpen}:{lesson:LessonCard;index:number;onOpen:()=>void}) {
  const pal = subjectPalette(l.subject);
  const SI  = pal.icon;
  const sc  = STATUS_CFG[l.status];
  const [hovered, setHovered] = useState(false);
  const Canvas = CANVAS_MAP[l.subject] || MathCanvas;

  const ACTIONS = [
    {icon:Pen,   label:"Edit",     primary:true,  fn:onOpen},
    {icon:Eye,   label:"Preview",  primary:false, fn:()=>{}},
    {icon:Send,  label:"Push",     primary:false, fn:()=>{}},
    {icon:Copy,  label:"Duplicate",primary:false, fn:()=>{}},
    {icon:Archive,label:"Archive", primary:false, fn:()=>{}},
  ];

  return (
    <motion.article
      layout
      initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.96}}
      transition={{duration:0.4,delay:index*0.05,ease:[0.16,1,0.3,1]}}
      onHoverStart={()=>setHovered(true)} onHoverEnd={()=>setHovered(false)}
      style={{background: "var(--app-card)",borderRadius:20,border:"1px solid var(--app-border-glow)",overflow:"hidden",cursor:"pointer",position:"relative",boxShadow:hovered?"0 20px 48px var(--app-border-glow)":"0 2px 8px var(--app-border-glow)",transform:hovered?"translateY(-4px)":"translateY(0)",transition:"transform 0.3s cubic-bezier(0.16,1,0.3,1),box-shadow 0.3s"}}
    >
      {/* Gradient banner */}
      <div style={{height:92,position:"relative",background:`linear-gradient(135deg,${pal.from}18,${pal.to}28)`,borderBottom:`1px solid ${pal.from}18`, overflow:"hidden"}}>
        <Canvas accent={pal.from} />
        <div style={{position:"relative", zIndex:2, padding:"16px 20px", display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,background:`rgba(255,255,255,0.7)`,backdropFilter:"blur(4px)",padding:"5px 10px",borderRadius:20,border:`1px solid ${pal.from}28`}}>
            <SI size={11} style={{color:pal.text}}/><span style={{fontSize:"10.5px",fontWeight:720,color:pal.text}}>{l.subject}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,background:sc.bg,backdropFilter:"blur(4px)",padding:"5px 10px",borderRadius:20, border: `1px solid ${sc.color}20`}}>
            {sc.pulse&&<div style={{width:6,height:6,borderRadius:"50%",background:sc.color,animation:"pulse 1.6s ease-in-out infinite"}}/>}
            <span style={{fontSize:"10px",fontWeight:700,color:sc.color}}>{sc.label}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{padding:"18px 20px 12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7}}>
          <span style={{fontSize:"10.5px",color:"var(--app-text-secondary)"}}>{l.topic}</span>
          {l.subtopic&&<><ChevronRight size={10} style={{color:"var(--app-border)"}}/><span style={{fontSize:"10.5px",color:"var(--app-text-secondary)"}}>{l.subtopic}</span></>}
          <span style={{marginLeft:4,fontSize:"9.5px",fontWeight:720,padding:"1px 6px",background:l.curriculum==="WAEC"?"rgba(37,99,235,0.08)":"rgba(255,107,0,0.08)",borderRadius:4,color:l.curriculum==="WAEC"?"#2563EB":"var(--color-brand)"}}>{l.curriculum}</span>
        </div>
        <h3 style={{fontSize:"17.5px",fontWeight:680,color: "var(--app-text-primary)",letterSpacing:"-0.02em",lineHeight:1.28,marginBottom:9}}>{l.title}</h3>
        <p style={{fontSize:"12.5px",color:"var(--app-text-secondary)",lineHeight:1.55,marginBottom:16,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as any}}>{l.description}</p>

        {/* Strip */}
        <div style={{marginBottom:16}}>
          <p style={{fontSize:"9px",fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--app-border)",marginBottom:5}}>Structure</p>
          <div style={{height:5,borderRadius:99,display:"flex",overflow:"hidden",gap:1.5}}>
            {l.strip.map((seg,i)=>(
              <motion.div key={i} initial={{scaleX:0,opacity:0}} animate={{scaleX:1,opacity:1}} transition={{delay:0.3+i*0.05,duration:0.4,ease:[0.16,1,0.3,1]}}
                style={{height:"100%",width:`${seg.width}%`,background:seg.color,borderRadius:99,transformOrigin:"left"}}/>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:12,borderTop:"1px solid var(--app-border-glow)"}}>
          <div style={{display:"flex"}}>
            {l.authors.map((a,i)=>(
              <div key={i} style={{width:22,height:22,borderRadius:"50%",background:a.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px",fontWeight:800,color:"var(--app-card)",marginLeft:i>0?-6:0,border:"2px solid #fff"}}>{a.initials}</div>
            ))}
          </div>
          <HealthRing score={l.health} size={22}/>
          <div style={{flex:1}}/>
          <span style={{fontSize:"10.5px",color: "var(--app-text-secondary)"}}>{l.blockCount} blocks</span>
          <span style={{fontSize:"10.5px",color:"var(--app-border)"}}>·</span>
          <span style={{fontSize:"10.5px",color: "var(--app-text-secondary)"}}>{l.readingTime} min</span>
          <span style={{fontSize:"10.5px",color:"var(--app-border)"}}>·</span>
          <span style={{fontSize:"10.5px",color: "var(--app-text-secondary)"}}>{l.lastEdited}</span>
        </div>
      </div>

      {/* ── BOTTOM DRAWER ── slides up on hover */}
      <motion.div
        initial={{y:"100%"}} animate={{y:hovered?"0%":"100%"}}
        transition={{duration:0.28,ease:[0.16,1,0.3,1]}}
        style={{position:"absolute",bottom:0,left:0,right:0,background: "var(--app-bg)",backdropFilter:"blur(12px)",borderTop:"1px solid var(--app-border-glow)",padding:"10px 16px",display:"flex",gap:6,alignItems:"center"}}
      >
        {ACTIONS.map(a=>{
          const Icon=a.icon;
          return a.primary
            ? <button key={a.label} onClick={a.fn} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px",background: "var(--app-text-primary)",color:"var(--app-card)",border:"none",borderRadius:10,fontSize:"12.5px",fontWeight:640,cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="#2d2a27"} onMouseLeave={e=>e.currentTarget.style.background="var(--app-text-primary)"}><Icon size={13}/>{a.label}</button>
            : <button key={a.label} onClick={a.fn} title={a.label} style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--app-border-glow)",border:"none",borderRadius:9,cursor:"pointer",color:"var(--app-text-secondary)",transition:"background 0.13s,color 0.13s"}} onMouseEnter={e=>{e.currentTarget.style.background="var(--app-border)";e.currentTarget.style.color="var(--app-text-primary)";}} onMouseLeave={e=>{e.currentTarget.style.background="var(--app-border-glow)";e.currentTarget.style.color="var(--app-text-secondary)"}}><Icon size={14}/></button>
        })}
      </motion.div>
    </motion.article>
  );
}

/* ═════════════════════════════════════════════════════════════════
   LESSON LIST ROW — inline actions on hover
═════════════════════════════════════════════════════════════════ */
function LessonListRow({lesson:l,index,onOpen}:{lesson:LessonCard;index:number;onOpen:()=>void}) {
  const pal = subjectPalette(l.subject);
  const SI  = pal.icon;
  const sc  = STATUS_CFG[l.status];
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div layout
      initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0}} transition={{duration:0.3,delay:index*0.04}}
      onHoverStart={()=>setHovered(true)} onHoverEnd={()=>setHovered(false)}
      style={{background: "var(--app-card)",borderRadius:14,border:"1px solid var(--app-border-glow)",padding:"14px 18px",display:"flex",alignItems:"center",gap:14,position:"relative",overflow:"hidden",transition:"box-shadow 0.2s",boxShadow:hovered?"0 8px 24px var(--app-border-glow)":"none"}}
    >
      {/* Subject icon */}
      <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${pal.from}22,${pal.to}30)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <SI size={18} style={{color:pal.text}}/>
      </div>

      {/* Info */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
          <h3 onClick={onOpen} style={{fontSize:"14.5px",fontWeight:640,color: "var(--app-text-primary)",letterSpacing:"-0.01em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer"}}>{l.title}</h3>
          <span style={{fontSize:"9.5px",fontWeight:720,padding:"2px 6px",background:l.curriculum==="WAEC"?"rgba(37,99,235,0.07)":"rgba(255,107,0,0.07)",borderRadius:4,color:l.curriculum==="WAEC"?"#2563EB":"var(--color-brand)",flexShrink:0}}>{l.curriculum}</span>
        </div>
        <p style={{fontSize:"12px",color: "var(--app-text-secondary)"}}>{l.subject} › {l.topic}{l.subtopic?` › ${l.subtopic}`:""}</p>
      </div>

      {/* Strip */}
      <div style={{width:80,height:5,borderRadius:99,display:"flex",overflow:"hidden",gap:1.5,flexShrink:0}}>
        {l.strip.map((s,i)=><div key={i} style={{height:"100%",width:`${s.width}%`,background:s.color,borderRadius:99}}/>)}
      </div>

      <HealthRing score={l.health} size={32} showLabel/>

      <div style={{padding:"5px 12px",borderRadius:20,background:sc.bg,flexShrink:0}}>
        <span style={{fontSize:"11px",fontWeight:700,color:sc.color}}>{sc.label}</span>
      </div>

      <span style={{fontSize:"12px",color:"var(--app-border)",flexShrink:0}}>{l.lastEdited}</span>

      {/* Sliding action drawer */}
      <motion.div
        initial={{x:"100%",opacity:0}} animate={{x:hovered?"0%":"100%",opacity:hovered?1:0}}
        transition={{duration:0.25,ease:[0.16,1,0.3,1]}}
        style={{position:"absolute",right:0,top:0,bottom:0,display:"flex",alignItems:"center",gap:6,padding:"0 16px",background:"linear-gradient(to left,#fff 70%,transparent)",paddingLeft:40}}
      >
        {[{icon:Pen,label:"Edit",fn:onOpen},{icon:Eye,label:"Preview",fn:()=>{}},{icon:Send,label:"Push",fn:()=>{}},{icon:Copy,label:"Duplicate",fn:()=>{}},{icon:Trash2,label:"Delete",fn:()=>{}}].map(a=>{
          const Icon=a.icon;
          const isDanger=a.label==="Delete";
          return (
            <button key={a.label} onClick={a.fn} title={a.label}
              style={{width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",border:"none",borderRadius:9,cursor:"pointer",background:isDanger?"rgba(220,38,38,0.06)":"var(--app-border-glow)",color:isDanger?"#DC2626":"var(--app-text-secondary)",transition:"background 0.13s,color 0.13s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=isDanger?"rgba(220,38,38,0.12)":"var(--app-border)";e.currentTarget.style.color=isDanger?"#B91C1C":"var(--app-text-primary)";}}
              onMouseLeave={e=>{e.currentTarget.style.background=isDanger?"rgba(220,38,38,0.06)":"var(--app-border-glow)";e.currentTarget.style.color=isDanger?"#DC2626":"var(--app-text-secondary)";}}>
              <Icon size={14}/>
            </button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   EMPTY STATE
═════════════════════════════════════════════════════════════════ */
function EmptyState({onCreate,hasFilter,onClear}:{onCreate:()=>void;hasFilter:boolean;onClear:()=>void}) {
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 0",textAlign:"center"}}>
      {/* Animated illustration */}
      <div style={{position:"relative",width:200,height:180,marginBottom:32}}>
        {/* Floating book */}
        <motion.div animate={{y:[0,-12,0]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}} style={{position:"absolute",top:20,left:"50%",transform:"translateX(-50%)"}}>
          <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
            <rect x="10" y="10" width="80" height="60" rx="6" fill="#F5F5F3" stroke="#E5E4E0" strokeWidth="1.5"/>
            <rect x="10" y="10" width="3" height="60" rx="1.5" fill="#E0DDD8"/>
            <line x1="20" y1="26" x2="80" y2="26" stroke="#E5E4E0" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="36" x2="72" y2="36" stroke="#E5E4E0" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="46" x2="68" y2="46" stroke="#E5E4E0" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="56" x2="60" y2="56" stroke="#F0EFEC" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.div>

        {/* Orbiting sparkle 1 */}
        <motion.div animate={{rotate:360}} transition={{duration:6,repeat:Infinity,ease:"linear"}} style={{position:"absolute",top:"50%",left:"50%",width:140,height:140,marginTop:-70,marginLeft:-70}}>
          <motion.div animate={{scale:[1,1.4,1],opacity:[0.6,1,0.6]}} transition={{duration:2,repeat:Infinity}} style={{position:"absolute",top:0,left:"50%",width:8,height:8,borderRadius:"50%",background:"#FF6B00",marginLeft:-4}}/>
        </motion.div>

        {/* Orbiting sparkle 2 */}
        <motion.div animate={{rotate:-360}} transition={{duration:8,repeat:Infinity,ease:"linear"}} style={{position:"absolute",top:"50%",left:"50%",width:160,height:160,marginTop:-80,marginLeft:-80}}>
          <motion.div animate={{scale:[1,1.3,1],opacity:[0.4,0.8,0.4]}} transition={{duration:2.5,repeat:Infinity,delay:1}} style={{position:"absolute",top:0,left:"50%",width:6,height:6,borderRadius:"50%",background:"#4F46E5",marginLeft:-3}}/>
        </motion.div>

        {/* Pencil floating */}
        <motion.div animate={{y:[0,8,0],rotate:[0,-3,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut",delay:1}} style={{position:"absolute",bottom:10,right:20}}>
          <Pen size={22} style={{color:"var(--app-border)"}}/>
        </motion.div>
      </div>

      {hasFilter
        ? <>
            <p style={{fontSize:"22px",fontWeight:720,color: "var(--app-text-primary)",letterSpacing:"-0.025em",marginBottom:8}}>No lessons match this filter</p>
            <p style={{fontSize:"14.5px",color:"var(--app-text-secondary)",lineHeight:1.6,marginBottom:28,maxWidth:340}}>Try adjusting or clearing your filters to see lessons.</p>
            <button onClick={onClear} style={{padding:"11px 24px",background: "var(--app-text-primary)",color:"var(--app-card)",border:"none",borderRadius:11,fontSize:"14px",fontWeight:640,cursor:"pointer"}}>Clear Filters</button>
          </>
        : <>
            <p style={{fontSize:"24px",fontWeight:740,color: "var(--app-text-primary)",letterSpacing:"-0.03em",marginBottom:8}}>Your studio is empty</p>
            <p style={{fontSize:"15px",color:"var(--app-text-secondary)",lineHeight:1.65,marginBottom:28,maxWidth:380}}>Create your first lesson and start building knowledge experiences that matter.</p>
            <motion.button onClick={onCreate} whileHover={{scale:1.04}} whileTap={{scale:0.97}}
              style={{display:"flex",alignItems:"center",gap:8,padding:"13px 28px",background:"var(--color-brand)",color:"var(--app-card)",border:"none",borderRadius:13,fontSize:"15px",fontWeight:660,cursor:"pointer",boxShadow:"0 8px 24px rgba(255,107,0,0.28)"}}>
              <PenLine size={16}/> Create First Lesson
            </motion.button>
          </>
      }
    </motion.div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   WIZARD INLINE ILLUSTRATIONS (SVG)
═════════════════════════════════════════════════════════════════ */
function IllustrationCurriculum() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="130" r="90" fill="rgba(255,107,0,0.05)"/>
      {/* Person */}
      <circle cx="150" cy="72" r="22" fill="#FFDCCB" stroke="#FFB899" strokeWidth="1.5"/>
      <ellipse cx="150" cy="130" rx="32" ry="40" fill="#FF6B00"/>
      <rect x="118" y="110" width="18" height="42" rx="9" fill="#FFDCCB"/>
      <rect x="164" y="110" width="18" height="42" rx="9" fill="#FFDCCB"/>
      <rect x="122" y="150" width="16" height="36" rx="8" fill="#2D2A27"/>
      <rect x="162" y="150" width="16" height="36" rx="8" fill="#2D2A27"/>
      {/* WAEC book (left) */}
      <motion.g animate={{rotate:[-6,0,-6]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}} style={{transformOrigin:"80px 180px"}}>
        <rect x="42" y="155" width="76" height="58" rx="6" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.5"/>
        <rect x="42" y="155" width="6" height="58" rx="3" fill="#93C5FD"/>
        <text x="55" y="180" fontSize="9" fontWeight="700" fill="#2563EB" fontFamily="system-ui">WAEC</text>
        <line x1="55" y1="190" x2="106" y2="190" stroke="#BFDBFE" strokeWidth="1.5"/>
        <line x1="55" y1="198" x2="98"  y2="198" stroke="#BFDBFE" strokeWidth="1.5"/>
      </motion.g>
      {/* JAMB book (right) */}
      <motion.g animate={{rotate:[6,0,6]}} transition={{duration:3.2,repeat:Infinity,ease:"easeInOut",delay:0.5}} style={{transformOrigin:"220px 180px"}}>
        <rect x="182" y="155" width="76" height="58" rx="6" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1.5"/>
        <rect x="182" y="155" width="6" height="58" rx="3" fill="#FDBA74"/>
        <text x="194" y="180" fontSize="9" fontWeight="700" fill="#EA580C" fontFamily="system-ui">JAMB</text>
        <line x1="194" y1="190" x2="246" y2="190" stroke="#FED7AA" strokeWidth="1.5"/>
        <line x1="194" y1="198" x2="238" y2="198" stroke="#FED7AA" strokeWidth="1.5"/>
      </motion.g>
      {/* Connecting arc */}
      <path d="M 80 155 Q 150 100 220 155" stroke="#FF6B00" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.4"/>
      <circle cx="150" cy="108" r="4" fill="#FF6B00" opacity="0.6"/>
    </svg>
  );
}

function IllustrationKnowledgeMap() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 280" fill="none">
      {/* Root */}
      <circle cx="150" cy="50" r="22" fill="#4F46E5" opacity="0.9"/>
      <text x="150" y="55" textAnchor="middle" fontSize="9" fontWeight="700" fill="white" fontFamily="system-ui">Subject</text>
      {/* Lines to level 2 */}
      <line x1="150" y1="72" x2="80"  y2="120" stroke="#C7D2FE" strokeWidth="1.5"/>
      <line x1="150" y1="72" x2="220" y2="120" stroke="#C7D2FE" strokeWidth="1.5"/>
      {/* Level 2 */}
      <motion.circle animate={{scale:[1,1.08,1]}} transition={{duration:2.5,repeat:Infinity,ease:"easeInOut"}} cx="80"  cy="130" r="18" fill="#6366F1" style={{transformOrigin:"80px 130px"}}/>
      <motion.circle animate={{scale:[1,1.08,1]}} transition={{duration:2.5,repeat:Infinity,ease:"easeInOut",delay:0.6}} cx="220" cy="130" r="18" fill="#6366F1" style={{transformOrigin:"220px 130px"}}/>
      <text x="80"  y="134" textAnchor="middle" fontSize="7" fontWeight="700" fill="white" fontFamily="system-ui">Topic</text>
      <text x="220" y="134" textAnchor="middle" fontSize="7" fontWeight="700" fill="white" fontFamily="system-ui">Topic</text>
      {/* Lines to level 3 */}
      {[[80,148,40,196],[80,148,80,196],[80,148,120,196],[220,148,180,196],[220,148,220,196],[220,148,260,196]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E0E7FF" strokeWidth="1.2"/>
      ))}
      {/* Level 3 */}
      {[40,80,120,180,220,260].map((x,i)=>(
        <motion.g key={i} animate={{y:[0,-3,0]}} transition={{duration:2,repeat:Infinity,ease:"easeInOut",delay:i*0.3}}>
          <rect x={x-20} y="196" width="40" height="22" rx="5" fill={i<3?"#EEF2FF":"#EEF2FF"} stroke="#C7D2FE" strokeWidth="1"/>
          <text x={x} y="211" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#4F46E5" fontFamily="system-ui">Sub {i+1}</text>
        </motion.g>
      ))}
      {/* Selected highlight */}
      <motion.circle animate={{opacity:[0.3,0.8,0.3]}} transition={{duration:1.8,repeat:Infinity}} cx="80" cy="207" r="14" stroke="#FF6B00" strokeWidth="2" fill="none"/>
    </svg>
  );
}

function IllustrationAuthoring() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 280" fill="none">
      {/* Desk */}
      <rect x="30" y="200" width="240" height="12" rx="4" fill="#E5E4E0"/>
      {/* Document */}
      <motion.g animate={{y:[0,-4,0]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}>
        <rect x="75" y="80" width="150" height="120" rx="8" fill="white" stroke="#E5E4E0" strokeWidth="1.5"/>
        <rect x="75" y="80" width="150" height="20" rx="8" fill="#F5F5F3"/>
        <rect x="75" y="92" width="150" height="8" rx="0" fill="#F5F5F3"/>
        {/* Lines */}
        <line x1="95" y1="118" x2="205" y2="118" stroke="#E5E4E0" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="95" y1="128" x2="195" y2="128" stroke="#E5E4E0" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="95" y1="138" x2="200" y2="138" stroke="#E5E4E0" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="95" y1="148" x2="180" y2="148" stroke="#F0EFEC" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Brand block */}
        <rect x="95" y="160" width="110" height="24" rx="4" fill="rgba(255,107,0,0.1)" stroke="rgba(255,107,0,0.3)" strokeWidth="1"/>
        <circle cx="107" cy="172" r="5" fill="rgba(255,107,0,0.5)"/>
        <line x1="117" y1="169" x2="190" y2="169" stroke="rgba(255,107,0,0.3)" strokeWidth="1.5"/>
        <line x1="117" y1="175" x2="175" y2="175" stroke="rgba(255,107,0,0.2)" strokeWidth="1.5"/>
      </motion.g>
      {/* Pen */}
      <motion.g animate={{rotate:[-5,5,-5],x:[0,4,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}} style={{transformOrigin:"210px 140px"}}>
        <rect x="200" y="108" width="8" height="60" rx="4" fill="#2D2A27" transform="rotate(20 204 140)"/>
        <polygon points="200,168 208,168 204,180" fill="#FF6B00" transform="rotate(20 204 168)"/>
      </motion.g>
      {/* Decorative dots */}
      <circle cx="55" cy="130" r="5" fill="rgba(79,70,229,0.15)"/>
      <circle cx="248" cy="100" r="4" fill="rgba(255,107,0,0.15)"/>
      <circle cx="240" cy="220" r="6" fill="rgba(16,185,129,0.15)"/>
    </svg>
  );
}

function IllustrationTemplate() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 280" fill="none">
      {/* 4 template cards arranged in a 2x2 grid */}
      {[{x:50,y:60,color:"#F3F4F6",stroke:"#E5E7EB",accent:"#6B7280"},{x:155,y:60,color:"#EEF2FF",stroke:"#C7D2FE",accent:"#4F46E5"},{x:50,y:160,color:"#ECFDF5",stroke:"#A7F3D0",accent:"#059669"},{x:155,y:160,color:"#FFF7ED",stroke:"#FED7AA",accent:"#EA580C"}].map((c,i)=>(
        <motion.g key={i} animate={{y:[0,-4,0]}} transition={{duration:2.5,repeat:Infinity,ease:"easeInOut",delay:i*0.4}}>
          <rect x={c.x} y={c.y} width="90" height="78" rx="8" fill={c.color} stroke={c.stroke} strokeWidth="1.5"/>
          <rect x={c.x+8} y={c.y+10} width="40" height="5" rx="2.5" fill={c.accent} opacity="0.6"/>
          <rect x={c.x+8} y={c.y+22} width="74" height="3" rx="1.5" fill={c.stroke}/>
          <rect x={c.x+8} y={c.y+30} width="66" height="3" rx="1.5" fill={c.stroke}/>
          <rect x={c.x+8} y={c.y+38} width="70" height="3" rx="1.5" fill={c.stroke}/>
          <rect x={c.x+8} y={c.y+50} width="74" height="16" rx="4" fill={c.accent} opacity="0.15"/>
          {i===1&&<circle cx={c.x+80} cy={c.y+10} r="7" fill="#4F46E5"/>}
        </motion.g>
      ))}
      {/* Selection ring */}
      <motion.rect animate={{opacity:[0.4,1,0.4]}} transition={{duration:1.6,repeat:Infinity}} x="152" y="57" width="96" height="84" rx="10" stroke="#4F46E5" strokeWidth="2.5" fill="none"/>
      {/* Check */}
      <circle cx="242" cy="60" r="10" fill="#4F46E5"/>
      <path d="M236 60 L240 64 L248 56" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ═════════════════════════════════════════════════════════════════
   CREATION WIZARD  (4 steps, split layout)
═════════════════════════════════════════════════════════════════ */
function CreationWizard({onClose}:{onClose:()=>void}) {
  const router = useRouter();
  const [step, setStep]           = useState(1);
  const [curriculum, setCurriculum] = useState<Curriculum|null>(null);
  const [subject, setSubject]     = useState<string|null>(null);
  const [topic, setTopic]         = useState<string|null>(null);
  const [subtopic, setSubtopic]   = useState<string|null>(null);
  const [title, setTitle]         = useState("");
  const [objective, setObjective] = useState("");
  const [template, setTemplate]   = useState<string|null>(null);

  // Get merged subject list for "BOTH" or single curriculum
  const availableSubjects: string[] = (() => {
    if (!curriculum) return [];
    if (curriculum === "BOTH") return Array.from(new Set([...Object.keys(CURRICULUM_TREE.WAEC),...Object.keys(CURRICULUM_TREE.JAMB)]));
    return Object.keys(CURRICULUM_TREE[curriculum]);
  })();

  const availableTopics: string[] = (() => {
    if (!curriculum || !subject) return [];
    const keys = curriculum === "BOTH"
      ? Array.from(new Set([...Object.keys(CURRICULUM_TREE.WAEC[subject]||{}),...Object.keys(CURRICULUM_TREE.JAMB[subject]||{})]))
      : Object.keys(CURRICULUM_TREE[curriculum][subject]||{});
    return keys;
  })();

  const availableSubtopics: string[] = (() => {
    if (!curriculum || !subject || !topic) return [];
    if (curriculum==="BOTH") return Array.from(new Set([...(CURRICULUM_TREE.WAEC[subject]?.[topic]||[]),...(CURRICULUM_TREE.JAMB[subject]?.[topic]||[])]));
    return CURRICULUM_TREE[curriculum][subject]?.[topic] || [];
  })();

  const canNext = () => {
    if (step===1) return !!curriculum;
    if (step===2) return !!(subject&&topic&&subtopic);
    if (step===3) return title.length>0;
    if (step===4) return !!template;
    return false;
  };

  const STEPS = [
    {label:"Curriculum",  icon:GraduationCap, color:"#FF6B00",   Illustration:IllustrationCurriculum},
    {label:"Knowledge",   icon:Layers,        color:"#4F46E5",   Illustration:IllustrationKnowledgeMap},
    {label:"Identity",    icon:Target,        color:"#10B981",   Illustration:IllustrationAuthoring},
    {label:"Template",    icon:Zap,           color:"#0284C7",   Illustration:IllustrationTemplate},
  ];

  const currentStepCfg = STEPS[step-1];
  const IllustComp = currentStepCfg.Illustration;

  const TEMPLATES = [
    {id:"blank",    icon:FileText,   label:"Blank Canvas",      desc:"Start with total creative freedom.", color:"var(--app-text-secondary)",bg:"var(--app-border-glow)"},
    {id:"scaffold", icon:Sparkles,   label:"AI Scaffold",       desc:"AI generates objectives & block structure.", color:"#7C3AED",bg:"rgba(124,58,237,0.06)",badge:"Recommended"},
    {id:"exam",     icon:Star,       label:"Exam-Ready",        desc:"Pre-filled JAMB/WAEC exam insight blocks.", color:"#0284C7",bg:"rgba(2,132,199,0.06)"},
    {id:"worked",   icon:BookOpen,   label:"Worked Examples",   desc:"Built around example-explanation cycles.", color:"#16A34A",bg:"rgba(22,163,74,0.06)"},
  ];

  return (
    <>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.25}}
        onClick={onClose} style={{position:"fixed",inset:0,background:"var(--app-text-secondary)",backdropFilter:"blur(12px)",zIndex:200}}/>

      <div style={{position:"fixed",inset:0,zIndex:201,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <motion.div initial={{opacity:0,y:28,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:16,scale:0.97}}
          transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
          style={{width:"100%",maxWidth:920,background: "var(--app-card)",borderRadius:28,boxShadow:"0 40px 100px rgba(0,0,0,0.24)",overflow:"hidden",display:"flex",flexDirection:"column",maxHeight:"92vh"}}>

          {/* Header */}
          <div style={{padding:"22px 32px",borderBottom:"1px solid var(--app-border-glow)",display:"flex",alignItems:"center",gap:0,flexShrink:0}}>
            {STEPS.map((s,i)=>{
              const n=i+1,done=step>n,active=step===n;
              const Icon=s.icon;
              return (
                <div key={n} style={{display:"flex",alignItems:"center",gap:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <motion.div animate={{background:done?"var(--app-text-primary)":active?s.color:"var(--app-border-glow)"}} style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.3s"}}>
                      {done?<Check size={13} color="var(--app-card)"/>:<Icon size={13} color={active?"var(--app-card)":"var(--app-border)"}/>}
                    </motion.div>
                    <span style={{fontSize:"12.5px",fontWeight:active||done?680:500,color:active?"var(--app-text-primary)":done?"var(--app-text-secondary)":"var(--app-border)",transition:"color 0.2s"}}>{s.label}</span>
                  </div>
                  {i<STEPS.length-1&&<div style={{width:32,height:1,margin:"0 10px",background:step>n?"var(--app-text-primary)":"var(--app-border)",transition:"background 0.3s"}}/>}
                </div>
              );
            })}
            <div style={{flex:1}}/>
            <button onClick={onClose} style={{width:28,height:28,borderRadius:7,background:"var(--app-border-glow)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color: "var(--app-text-secondary)"}}>
              <X size={15}/>
            </button>
          </div>

          {/* Split body */}
          <div style={{display:"flex",flex:1,overflow:"hidden"}}>

            {/* LEFT: Form */}
            <div style={{flex:1,overflowY:"auto",padding:"40px 44px"}}>
              <AnimatePresence mode="wait">

                {/* STEP 1 — Curriculum */}
                {step===1&&(
                  <motion.div key="s1" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.3,ease:[0.16,1,0.3,1]}}>
                    <p style={{fontSize:"11.5px",fontWeight:750,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--color-brand)",marginBottom:10}}>Step 1 of 4</p>
                    <h2 style={{fontSize:"26px",fontWeight:750,color: "var(--app-text-primary)",letterSpacing:"-0.03em",marginBottom:8}}>Which exam are you building for?</h2>
                    <p style={{fontSize:"14px",color:"var(--app-text-secondary)",marginBottom:30,lineHeight:1.6}}>Your choice shapes the curriculum structure and what subjects are available.</p>

                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      {([
                        {id:"WAEC",title:"WAEC",sub:"West African Examinations Council",desc:"Build for Senior Secondary students across all WAEC subjects.",color:"#2563EB",bg:"#EFF6FF"},
                        {id:"JAMB",title:"JAMB",sub:"Joint Admissions & Matriculation Board",desc:"Target university entrance exam students with JAMB-specific framing.",color:"#EA580C",bg:"#FFF7ED"},
                        {id:"BOTH",title:"WAEC + JAMB",sub:"Cross-curriculum lesson",desc:"One lesson, both contexts. AI will automatically add JAMB-specific annotation blocks alongside the WAEC structure.",color:"#7C3AED",bg:"#F5F3FF",badge:"Adds JAMB Context"},
                      ] as const).map(c=>{
                        const selected=curriculum===c.id;
                        return (
                          <button key={c.id} onClick={()=>{setCurriculum(c.id);setSubject(null);setTopic(null);setSubtopic(null);}}
                            style={{padding:"18px 20px",borderRadius:14,border:`2px solid ${selected?c.color:"var(--app-border-glow)"}`,background:selected?c.bg:"var(--app-card)",textAlign:"left",cursor:"pointer",position:"relative",transition:"all 0.2s",boxShadow:selected?`0 0 0 4px ${c.color}14`:"none"}}>
                            {c.badge&&<div style={{position:"absolute",top:14,right:14,fontSize:"9px",fontWeight:800,color:selected?"var(--app-card)":c.color,background:selected?c.color:`${c.color}18`,padding:"3px 8px",borderRadius:20,transition:"all 0.2s"}}>{c.badge}</div>}
                            <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                              <div style={{width:36,height:36,borderRadius:10,background:selected?c.color:`${c.color}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background 0.2s"}}>
                                <GraduationCap size={18} color={selected?"var(--app-card)":c.color}/>
                              </div>
                              <div>
                                <p style={{fontSize:"15.5px",fontWeight:680,color:selected?c.color: "var(--app-text-primary)",transition:"color 0.2s"}}>{c.title}</p>
                                <p style={{fontSize:"11.5px",color:"var(--app-text-secondary)",marginTop:1}}>{c.sub}</p>
                                <p style={{fontSize:"12.5px",color: "var(--app-text-primary)",marginTop:6,lineHeight:1.5}}>{c.desc}</p>
                              </div>
                              {selected&&<CheckCircle2 size={18} color={c.color} style={{marginLeft:"auto",flexShrink:0,marginTop:2}}/>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 — Subject / Topic / Subtopic */}
                {step===2&&(
                  <motion.div key="s2" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.3,ease:[0.16,1,0.3,1]}}>
                    <p style={{fontSize:"11.5px",fontWeight:750,letterSpacing:"0.08em",textTransform:"uppercase",color:"#4F46E5",marginBottom:10}}>Step 2 of 4</p>
                    <h2 style={{fontSize:"26px",fontWeight:750,color: "var(--app-text-primary)",letterSpacing:"-0.03em",marginBottom:8}}>Map to the Knowledge Tree</h2>
                    <p style={{fontSize:"14px",color:"var(--app-text-secondary)",marginBottom:28,lineHeight:1.6}}>
                      Drill down from subject to the exact subtopic your lesson covers.
                    </p>

                    {/* Subject */}
                    <div style={{marginBottom:24}}>
                      <label style={{fontSize:"11px",fontWeight:750,letterSpacing:"0.06em",textTransform:"uppercase",color: "var(--app-text-secondary)",display:"block",marginBottom:10}}>Subject</label>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        {availableSubjects.map(s=>{
                          const p=subjectPalette(s),SI=p.icon;
                          return (
                            <button key={s} onClick={()=>{setSubject(s);setTopic(null);setSubtopic(null);}}
                              style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:10,border:`1.5px solid ${subject===s?p.text:"var(--app-border-glow)"}`,background:subject===s?`${p.from}0A`:"var(--app-card)",cursor:"pointer",fontSize:"13px",fontWeight:subject===s?660:460,color:subject===s?p.text:"var(--app-text-primary)",transition:"all 0.15s"}}>
                              <SI size={13}/>{s}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Topic */}
                    <AnimatePresence>
                      {subject&&availableTopics.length>0&&(
                        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} style={{overflow:"hidden",marginBottom:24}}>
                          <label style={{fontSize:"11px",fontWeight:750,letterSpacing:"0.06em",textTransform:"uppercase",color: "var(--app-text-secondary)",display:"block",marginBottom:10}}>Topic</label>
                          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                            {availableTopics.map(t=>(
                              <button key={t} onClick={()=>{setTopic(t);setSubtopic(null);}}
                                style={{padding:"8px 16px",borderRadius:10,border:`1.5px solid ${topic===t?"#4F46E5":"var(--app-border-glow)"}`,background:topic===t?"rgba(79,70,229,0.07)":"var(--app-card)",cursor:"pointer",fontSize:"13px",fontWeight:topic===t?640:450,color:topic===t?"#4F46E5":"var(--app-text-primary)",transition:"all 0.15s"}}>
                                {t}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Subtopic */}
                    <AnimatePresence>
                      {topic&&availableSubtopics.length>0&&(
                        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} style={{overflow:"hidden"}}>
                          <label style={{fontSize:"11px",fontWeight:750,letterSpacing:"0.06em",textTransform:"uppercase",color: "var(--app-text-secondary)",display:"block",marginBottom:10}}>Subtopic</label>
                          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                            {availableSubtopics.map(st=>(
                              <button key={st} onClick={()=>setSubtopic(st)}
                                style={{padding:"8px 16px",borderRadius:10,border:`1.5px solid ${subtopic===st?"var(--app-text-primary)":"var(--app-border-glow)"}`,background:subtopic===st?"var(--app-text-primary)":"var(--app-card)",cursor:"pointer",fontSize:"13px",fontWeight:subtopic===st?640:450,color:subtopic===st?"var(--app-card)":"var(--app-text-primary)",transition:"all 0.15s"}}>
                                {st}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* STEP 3 — Identity */}
                {step===3&&(
                  <motion.div key="s3" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.3,ease:[0.16,1,0.3,1]}}>
                    <p style={{fontSize:"11.5px",fontWeight:750,letterSpacing:"0.08em",textTransform:"uppercase",color:"#10B981",marginBottom:10}}>Step 3 of 4</p>
                    <h2 style={{fontSize:"26px",fontWeight:750,color: "var(--app-text-primary)",letterSpacing:"-0.03em",marginBottom:8}}>Name your lesson</h2>
                    <p style={{fontSize:"14px",color:"var(--app-text-secondary)",marginBottom:28,lineHeight:1.6}}>
                      Give your lesson a title that clearly tells learners what they'll understand by the end.
                    </p>

                    {/* Breadcrumb preview */}
                    <div style={{display:"flex",alignItems:"center",gap:6,padding:"10px 14px",background:"var(--app-border-glow)",borderRadius:10,marginBottom:28}}>
                      <span style={{fontSize:"11.5px",fontWeight:700,padding:"2px 7px",borderRadius:4,background:curriculum==="WAEC"?"rgba(37,99,235,0.1)":curriculum==="JAMB"?"rgba(255,107,0,0.1)":"rgba(124,58,237,0.1)",color:curriculum==="WAEC"?"#2563EB":curriculum==="JAMB"?"#EA580C":"#7C3AED"}}>{curriculum}</span>
                      <ChevronRight size={12} style={{color: "var(--app-text-secondary)"}}/>
                      <span style={{fontSize:"12px",color:"var(--app-text-secondary)"}}>{subject}</span>
                      <ChevronRight size={12} style={{color: "var(--app-text-secondary)"}}/>
                      <span style={{fontSize:"12px",color:"var(--app-text-secondary)"}}>{topic}</span>
                      <ChevronRight size={12} style={{color: "var(--app-text-secondary)"}}/>
                      <span style={{fontSize:"12px",fontWeight:600,color: "var(--app-text-primary)"}}>{subtopic}</span>
                    </div>

                    <div style={{marginBottom:22}}>
                      <label style={{fontSize:"11px",fontWeight:750,letterSpacing:"0.06em",textTransform:"uppercase",color: "var(--app-text-secondary)",display:"block",marginBottom:10}}>Lesson Title</label>
                      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder={`e.g. Understanding ${subtopic||"Concepts"}`} autoFocus
                        style={{width:"100%",padding:"15px 18px",fontSize:"18px",fontWeight:520,background:"var(--app-border-glow)",border:"1.5px solid var(--app-border-glow)",borderRadius:13,outline:"none",color: "var(--app-text-primary)",transition:"border-color 0.2s,box-shadow 0.2s",letterSpacing:"-0.015em"}}
                        onFocus={e=>{e.currentTarget.style.borderColor="#10B981";e.currentTarget.style.boxShadow="0 0 0 3px rgba(16,185,129,0.1)";}}
                        onBlur={e=>{e.currentTarget.style.borderColor="var(--app-border-glow)";e.currentTarget.style.boxShadow="none";}}/>
                    </div>

                    <div>
                      <label style={{fontSize:"11px",fontWeight:750,letterSpacing:"0.06em",textTransform:"uppercase",color: "var(--app-text-secondary)",display:"block",marginBottom:10}}>
                        Primary Objective <span style={{textTransform:"none",fontWeight:400,fontSize:"10.5px",color: "var(--app-text-secondary)"}}>— optional</span>
                      </label>
                      <textarea value={objective} onChange={e=>setObjective(e.target.value)} placeholder="By the end of this lesson, learners will be able to…" rows={3}
                        style={{width:"100%",padding:"13px 16px",fontSize:"14px",background:"var(--app-border-glow)",border:"1.5px solid var(--app-border-glow)",borderRadius:12,outline:"none",color: "var(--app-text-primary)",resize:"none",fontFamily:"inherit",lineHeight:1.65,transition:"border-color 0.2s"}}
                        onFocus={e=>e.currentTarget.style.borderColor="#10B981"} onBlur={e=>e.currentTarget.style.borderColor="var(--app-border-glow)"}/>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4 — Template */}
                {step===4&&(
                  <motion.div key="s4" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.3,ease:[0.16,1,0.3,1]}}>
                    <p style={{fontSize:"11.5px",fontWeight:750,letterSpacing:"0.08em",textTransform:"uppercase",color:"#0284C7",marginBottom:10}}>Step 4 of 4</p>
                    <h2 style={{fontSize:"26px",fontWeight:750,color: "var(--app-text-primary)",letterSpacing:"-0.03em",marginBottom:8}}>Choose your canvas</h2>
                    <p style={{fontSize:"14px",color:"var(--app-text-secondary)",marginBottom:28,lineHeight:1.6}}>
                      How do you want to open "<strong style={{color: "var(--app-text-primary)"}}>{title}</strong>"?
                    </p>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      {TEMPLATES.map(t=>{
                        const Icon=t.icon,selected=template===t.id;
                        return (
                          <button key={t.id} onClick={()=>setTemplate(t.id)}
                            style={{padding:"20px",borderRadius:16,border:`2px solid ${selected?t.color:"var(--app-border-glow)"}`,background:selected?t.bg:"var(--app-card)",textAlign:"left",cursor:"pointer",position:"relative",transition:"all 0.18s",boxShadow:selected?`0 0 0 4px ${t.color}14`:"none"}}>
                            {t.badge&&<div style={{position:"absolute",top:10,right:10,fontSize:"8.5px",fontWeight:800,color:"var(--app-card)",background:t.color,padding:"3px 7px",borderRadius:20}}>{t.badge}</div>}
                            {selected&&<div style={{position:"absolute",top:10,left:10,width:16,height:16,borderRadius:"50%",background:t.color,display:"flex",alignItems:"center",justifyContent:"center"}}><Check size={9} color="var(--app-card)"/></div>}
                            <Icon size={22} style={{color:t.color,marginBottom:12}}/>
                            <p style={{fontSize:"14.5px",fontWeight:670,color: "var(--app-text-primary)",marginBottom:4}}>{t.label}</p>
                            <p style={{fontSize:"12px",color:"var(--app-text-secondary)",lineHeight:1.55}}>{t.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT: Illustration panel */}
            <div style={{width:310,background:`linear-gradient(160deg,${currentStepCfg.color}10,${currentStepCfg.color}04)`,borderLeft:"1px solid var(--app-border-glow)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",flexShrink:0,overflow:"hidden",position:"relative"}}>
              {/* Decorative bg circle */}
              <div style={{position:"absolute",bottom:-60,right:-60,width:240,height:240,borderRadius:"50%",background:`${currentStepCfg.color}08`,pointerEvents:"none"}}/>
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{opacity:0,scale:0.92}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}} transition={{duration:0.35,ease:[0.16,1,0.3,1]}}
                  style={{width:"100%",height:260}}>
                  <IllustComp/>
                </motion.div>
              </AnimatePresence>
              <div style={{textAlign:"center",marginTop:16}}>
                <p style={{fontSize:"13.5px",fontWeight:680,color: "var(--app-text-primary)",marginBottom:4}}>{currentStepCfg.label}</p>
                <p style={{fontSize:"12px",color:"var(--app-text-secondary)",lineHeight:1.5,maxWidth:220}}>
                  {step===1&&"Choose the exam framework that defines your curriculum structure."}
                  {step===2&&"Drill down to the exact concept your lesson covers in the knowledge tree."}
                  {step===3&&"A clear title is the first learning signal your students receive."}
                  {step===4&&"Your starting point shapes the lesson's first draft quality."}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{padding:"18px 32px",borderTop:"1px solid var(--app-border-glow)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,background:"var(--app-border-glow)"}}>
            <button onClick={()=>step>1?setStep(s=>s-1):onClose()}
              style={{padding:"11px 22px",background:"none",border:"none",fontSize:"14px",fontWeight:600,color:"var(--app-text-secondary)",cursor:"pointer",borderRadius:10,transition:"background 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="var(--app-border-glow)"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
              {step>1?"Back":"Cancel"}
            </button>

            {step<4
              ? <button onClick={()=>{if(canNext())setStep(s=>s+1);}} disabled={!canNext()}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"12px 30px",background:canNext()?"var(--app-text-primary)":"var(--app-border-glow)",color:canNext()?"var(--app-card)":"var(--app-border)",border:"none",borderRadius:12,fontSize:"14px",fontWeight:660,cursor:canNext()?"pointer":"not-allowed",transition:"all 0.2s"}}>
                  Continue <ArrowRight size={14}/>
                </button>
              : <motion.button onClick={()=>router.push("/lessons/new")} disabled={!canNext()}
                  whileHover={canNext()?{scale:1.04}:{}} whileTap={canNext()?{scale:0.97}:{}}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"12px 32px",background:canNext()?"var(--color-brand)":"var(--app-border-glow)",color:canNext()?"var(--app-card)":"var(--app-border)",border:"none",borderRadius:12,fontSize:"14.5px",fontWeight:700,cursor:canNext()?"pointer":"not-allowed",transition:"all 0.2s",boxShadow:canNext()?"0 8px 24px rgba(255,107,0,0.3)":"none"}}>
                  <Sparkles size={16}/> Create Lesson
                </motion.button>
            }
          </div>
        </motion.div>
      </div>
    </>
  );
}
