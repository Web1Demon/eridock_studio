"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, AlertCircle, X, ChevronRight, Check } from "lucide-react";
import { useState, useEffect } from "react";

export function AiCoTeacherPanel({ slide, onApplySuggestion, onClose }: { slide: any, onApplySuggestion: (suggestion: string) => void, onClose: () => void }) {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    // Mock analysis based on the slide type
    if (slide) {
      if (slide.type === "concept") {
        setSuggestions([
          { id: "s1", type: "warning", text: "Cognitive Overload Detected", desc: "This concept card is text-heavy. Consider adding an analogy slide next to break it down.", action: "Add Analogy Slide" },
          { id: "s2", type: "tip", text: "Accessibility", desc: "You haven't added alt text to the media on this slide.", action: "Auto-generate Alt Text" }
        ]);
      } else if (slide.type === "formula") {
        setSuggestions([
          { id: "s1", type: "warning", text: "Missing Context", desc: "Formulas are hard to grasp without real-world context.", action: "Add Local Context Slide" }
        ]);
      } else if (slide.type === "multiple_choice") {
        setSuggestions([
          { id: "s1", type: "tip", text: "Difficulty Spike", desc: "This question seems significantly harder than the previous concepts.", action: "Generate Hint" }
        ]);
      } else {
        setSuggestions([
          { id: "s1", type: "tip", text: "Pacing looks good", desc: "The current flow of slides is well balanced.", action: null }
        ]);
      }
    }
  }, [slide]);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{
        width: 320, background: "var(--app-card)", borderLeft: "1px solid var(--app-border-glow)",
        display: "flex", flexDirection: "column", height: "100%", zIndex: 40,
        boxShadow: "-10px 0 30px rgba(0,0,0,0.02)"
      }}
    >
      <div style={{ padding: "20px", borderBottom: "1px solid var(--app-border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(180deg, rgba(147,51,234,0.05) 0%, rgba(255,255,255,0) 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #F3E8FF, #E9D5FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={16} color="#9333EA" />
          </div>
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)" }}>AI Co-Teacher</h3>
            <p style={{ fontSize: "11px", color: "var(--app-text-secondary)" }}>Analyzing in real-time...</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)" }}><X size={16} /></button>
      </div>

      <div style={{ padding: "20px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {suggestions.map((s) => {
          const isWarning = s.type === "warning";
          const color = isWarning ? "#DC2626" : "#16A34A";
          const bg = isWarning ? "rgba(220,38,38,0.05)" : "rgba(22,163,74,0.05)";
          const Icon = isWarning ? AlertCircle : Brain;

          return (
            <div key={s.id} style={{ background: bg, border: `1px solid ${color}20`, borderRadius: 16, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Icon size={16} color={color} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: color }}>{s.text}</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", lineHeight: 1.5, marginBottom: s.action ? 16 : 0 }}>
                {s.desc}
              </p>
              {s.action && (
                <button
                  onClick={() => onApplySuggestion(s.action)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px", background: "var(--app-card)", border: `1px solid ${color}30`, borderRadius: 10,
                    cursor: "pointer", fontSize: "12.5px", fontWeight: 650, color: "var(--app-text-primary)", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                  }}
                >
                  <span>{s.action}</span>
                  <ChevronRight size={14} color={color} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
