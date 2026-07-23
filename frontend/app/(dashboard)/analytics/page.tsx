"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Brain, Target, Compass, ServerCrash, Sparkles, Activity, Clock, ShieldAlert, BookOpen, ChevronDown
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────
   DESIGN TOKENS & UTILS
────────────────────────────────────────────────────────────────── */
const TOKENS = {
  fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  border: "0 0 0 1px var(--app-border-glow), 0 2px 12px rgba(0,0,0,0.03)",
  bg: "var(--app-card)",
  textPrimary: "var(--app-text-primary)",
  textMuted: "var(--app-text-secondary)",
  brand: "#FF6B00",
};

/* ──────────────────────────────────────────────────────────────────
   COMPONENTS
────────────────────────────────────────────────────────────────── */

// 1. Executive Briefing
function ExecutiveBriefing() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ 
        padding: "24px 32px", 
        background: "rgba(255, 255, 255, 0.4)", 
        backdropFilter: "blur(24px)", 
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--app-border)",
        display: "flex", gap: 24, alignItems: "flex-start",
        marginBottom: 32,
        borderRadius: 16
      }}
    >
      <div style={{ marginTop: 2 }}>
        <Brain size={20} color={TOKENS.textMuted} strokeWidth={2} />
      </div>
      <div>
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: TOKENS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Morning Intelligence Brief</h2>
        <p style={{ fontSize: "16px", color: TOKENS.textPrimary, lineHeight: 1.6, fontWeight: 450, letterSpacing: "-0.01em", maxWidth: 900 }}>
          Mathematics production is <strong style={{ fontWeight: 600 }}>outperforming targets by 14%</strong>, but Physics reviews have slowed, creating a <strong style={{ color: "#DC2626", fontWeight: 600 }}>48h bottleneck</strong> in the staging queue. 
          AI interventions successfully flagged <span style={{ padding: "2px 6px", background: "rgba(255,107,0,0.1)", color: TOKENS.brand, borderRadius: 4, fontFamily: TOKENS.fontMono, fontSize: "12px", fontWeight: 600 }}>34</span> duplicate questions and saved an estimated <span style={{ padding: "2px 6px", background: "var(--app-border)", color: TOKENS.textPrimary, borderRadius: 4, fontFamily: TOKENS.fontMono, fontSize: "12px", fontWeight: 600 }}>142h</span> in drafting overhead this week.
          Current velocity forecasts Q3 curriculum completion <strong style={{ color: "#16A34A", fontWeight: 600 }}>12 days ahead of schedule</strong>.
        </p>
      </div>
    </motion.div>
  );
}

// 2. Production Velocity (Sparkline)
function VelocitySparkline() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const data = [12, 18, 15, 22, 28, 24, 30, 36, 32, 45, 42, 50, 48, 60];
  const max = Math.max(...data);
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 300},${100 - (d / max) * 100}`).join(" ");

  return (
    <div style={{ background: TOKENS.bg, boxShadow: TOKENS.border, borderRadius: 16, padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: TOKENS.textPrimary, letterSpacing: "-0.01em" }}>Velocity (30d)</h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
          <span style={{ fontFamily: TOKENS.fontMono, fontSize: "28px", fontWeight: 500, color: TOKENS.textPrimary, letterSpacing: "-0.04em" }}>+24.8%</span>
          <span style={{ fontSize: "13px", color: TOKENS.textMuted }}>vs last month</span>
        </div>
      </div>
      
      <div style={{ position: "relative", height: 100, marginTop: 32 }} onMouseLeave={() => setHoveredIdx(null)}>
        <svg viewBox="0 0 300 100" style={{ width: "100%", height: "100%", overflow: "visible" }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TOKENS.brand} stopOpacity="0.15" />
              <stop offset="100%" stopColor={TOKENS.brand} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M 0,100 L ${points} L 300,100 Z`} fill="url(#sparkGradient)" />
          <motion.polyline 
            points={points} 
            fill="none" 
            stroke={TOKENS.brand} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Hover interaction layer */}
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {data.map((d, i) => (
            <div 
              key={i} 
              onMouseEnter={() => setHoveredIdx(i)}
              style={{ flex: 1, height: "100%", cursor: "crosshair", position: "relative" }}
            >
              <AnimatePresence>
                {hoveredIdx === i && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                    style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: "var(--app-border)", transform: "translateX(-50%)", pointerEvents: "none" }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Knowledge Coverage (GitHub-style matrix)
function KnowledgeGrid() {
  // Simulate 12 weeks x 7 days of curriculum module completion status
  const weeks = 14;
  const days = 7;
  const grid = Array.from({ length: weeks }, (_, w) => 
    Array.from({ length: days }, (_, d) => {
      const isPast = w < 10 || (w === 10 && d < 4);
      if (!isPast) return 0; // future/empty
      const rand = Math.random();
      if (rand > 0.8) return 3; // deep orange
      if (rand > 0.5) return 2; // orange
      if (rand > 0.2) return 1; // light orange
      return 0; // missed/gap
    })
  );

  const colors = ["var(--app-border)", "rgba(255,107,0,0.2)", "rgba(255,107,0,0.6)", "#FF6B00"];

  return (
    <div style={{ background: TOKENS.bg, boxShadow: TOKENS.border, borderRadius: 16, padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 600, color: TOKENS.textPrimary, letterSpacing: "-0.01em" }}>Knowledge Coverage</h3>
          <p style={{ fontSize: "13px", color: TOKENS.textMuted, marginTop: 4 }}>Q3 objective mapping density.</p>
        </div>
        <div style={{ fontFamily: TOKENS.fontMono, fontSize: "28px", fontWeight: 500, color: TOKENS.textPrimary, letterSpacing: "-0.04em" }}>
          68%
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, overflow: "hidden" }}>
        {grid.map((week, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {week.map((val, j) => (
              <motion.div 
                key={j}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (i * 0.02) + (j * 0.01) }}
                whileHover={{ scale: 1.2, borderRadius: 2 }}
                style={{ width: 14, height: 14, borderRadius: 3, background: colors[val], cursor: "crosshair" }}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, fontSize: "11px", color: TOKENS.textMuted, fontWeight: 500 }}>
        <span>Missing Prerequisites</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span>Low</span>
          <div style={{ display: "flex", gap: 2 }}>
            {colors.map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />)}
          </div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}

// 4. System Health (Precision Radial)
function PrecisionRadial() {
  const score = 94;
  const ticks = 40;
  
  return (
    <div style={{ background: TOKENS.bg, boxShadow: TOKENS.border, borderRadius: 16, padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      <div style={{ alignSelf: "flex-start", marginBottom: 12 }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: TOKENS.textPrimary, letterSpacing: "-0.01em" }}>System Health</h3>
      </div>
      
      <div style={{ position: "relative", width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 12 }}>
        {/* Ticks */}
        {Array.from({ length: ticks }).map((_, i) => {
          const rotation = (i / ticks) * 360;
          const isFilled = (i / ticks) * 100 < score;
          return (
            <div key={i} style={{ position: "absolute", width: "100%", height: "100%", transform: `rotate(${rotation}deg)` }}>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.015 }}
                style={{ position: "absolute", top: 0, left: "50%", width: 2, height: 8, background: isFilled ? TOKENS.textPrimary : "var(--app-border)", borderRadius: 1, transform: "translateX(-50%)" }}
              />
            </div>
          );
        })}
        {/* Score */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: TOKENS.bg, borderRadius: "50%", width: 120, height: 120, boxShadow: "inset 0 0 20px rgba(0,0,0,0.02)" }}>
          <span style={{ fontFamily: TOKENS.fontMono, fontSize: "36px", fontWeight: 500, color: TOKENS.textPrimary, letterSpacing: "-0.05em", lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: "11px", fontWeight: 600, color: TOKENS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>Score</span>
        </div>
      </div>
    </div>
  );
}

// 5. Operations Pipeline (Node Graph)
function OperationsPipeline() {
  const nodes = [
    { id: "ideas", label: "Ideas", count: 45, status: "normal" },
    { id: "drafting", label: "Drafting", count: 112, status: "active" },
    { id: "review", label: "Review", count: 38, status: "blocked" },
    { id: "qa", label: "Quality Assurance", count: 15, status: "normal" },
    { id: "published", label: "Published", count: 840, status: "normal" },
  ];

  return (
    <div style={{ background: TOKENS.bg, boxShadow: TOKENS.border, borderRadius: 16, padding: "32px", marginTop: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 600, color: TOKENS.textPrimary, letterSpacing: "-0.01em" }}>Operations Pipeline</h3>
          <p style={{ fontSize: "13px", color: TOKENS.textMuted, marginTop: 4 }}>Real-time curriculum throughput.</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        
        {/* Glowing Path for Blocked State */}
        <div style={{ position: "absolute", top: "50%", left: "10%", right: "10%", height: 1, background: "var(--app-border)", zIndex: 0 }} />
        <motion.div 
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "50%", left: "30%", width: "20%", height: 2, background: "#DC2626", boxShadow: "0 0 12px #DC2626", zIndex: 0 }}
        />

        {nodes.map((node, i) => {
          const isBlocked = node.status === "blocked";
          return (
            <div key={node.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1, width: 120 }}>
              <motion.div 
                whileHover={{ y: -2 }}
                style={{ 
                  background: TOKENS.bg, 
                  border: isBlocked ? "1px solid rgba(220,38,38,0.5)" : "1px solid var(--app-border)", 
                  boxShadow: isBlocked ? "0 4px 16px rgba(220,38,38,0.1)" : "0 4px 12px rgba(0,0,0,0.03)",
                  borderRadius: 8, padding: "12px", width: "100%", display: "flex", flexDirection: "column", gap: 8, cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: TOKENS.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>{node.label}</span>
                  {isBlocked && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#DC2626" }} />}
                </div>
                <span style={{ fontFamily: TOKENS.fontMono, fontSize: "20px", fontWeight: 500, color: TOKENS.textPrimary, letterSpacing: "-0.04em" }}>{node.count}</span>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ──────────────────────────────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");

  const ranges = ["Today", "Last 7 Days", "Last 30 Days", "This Quarter", "Year to Date"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--app-bg)", padding: "40px", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, position: "relative" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: TOKENS.textPrimary, letterSpacing: "-0.02em" }}>Analytics</h1>
            <p style={{ fontSize: "14px", color: TOKENS.textMuted, marginTop: 4, fontWeight: 500 }}>Operational intelligence & curriculum health.</p>
          </div>
          <div style={{ display: "flex", gap: 12, position: "relative" }}>
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              style={{ padding: "8px 14px", borderRadius: 6, background: TOKENS.bg, boxShadow: TOKENS.border, border: "none", fontSize: "13px", fontWeight: 500, color: TOKENS.textPrimary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <Clock size={14} color={TOKENS.textMuted} /> {selectedRange}
            </button>

            <AnimatePresence>
              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute", top: "100%", right: 0, marginTop: 8,
                    background: TOKENS.bg, boxShadow: "0 12px 32px rgba(0,0,0,0.08), 0 0 0 1px var(--app-border-glow)",
                    borderRadius: 8, padding: 6, zIndex: 100, minWidth: 160
                  }}
                >
                  {ranges.map(r => (
                    <button
                      key={r}
                      onClick={() => { setSelectedRange(r); setShowCalendar(false); }}
                      style={{
                        width: "100%", textAlign: "left", padding: "8px 12px", background: selectedRange === r ? "var(--app-border)" : "transparent",
                        border: "none", borderRadius: 6, fontSize: "13px", fontWeight: selectedRange === r ? 600 : 450, color: TOKENS.textPrimary, cursor: "pointer",
                        display: "flex", justifyContent: "space-between", alignItems: "center"
                      }}
                    >
                      {r}
                      {selectedRange === r && <Target size={14} color={TOKENS.brand} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 1. Executive Briefing */}
        <ExecutiveBriefing />

        {/* 2. Bento Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: 24 }}>
          <VelocitySparkline />
          <KnowledgeGrid />
          <PrecisionRadial />
        </div>

        {/* 3. Pipeline */}
        <OperationsPipeline />

      </div>
    </div>
  );
}
