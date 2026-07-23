"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Brain, CheckCircle2, AlertCircle, ChevronRight, User, Zap, Globe } from "lucide-react";

const PERSONAS = [
  { id: "p1", name: "Alex (Visual Learner)", desc: "Struggles with text walls, needs diagrams", icon: Brain, color: "#7C3AED", bg: "rgba(124,58,237,0.1)" },
  { id: "p2", name: "Sarah (Advanced)", desc: "Quickly grasps concepts, needs challenge", icon: Zap, color: "#16A34A", bg: "rgba(22,163,74,0.1)" },
  { id: "p3", name: "David (Needs Context)", desc: "Asks 'why am I learning this?'", icon: Globe, color: "#FF6B00", bg: "rgba(255,107,0,0.1)" },
];

export function StudentSimulatorModal({ onClose, activeSlides = [] }: { onClose: () => void, activeSlides?: any[] }) {
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setResults({
        score: 72,
        feedback: "I got a bit lost on Slide 3 because the formula was introduced without a visual breakdown. The quiz at the end was good, but maybe add a hint for Question 2?",
        strengths: ["Great introductory hook", "Good pacing on early slides"],
        weaknesses: ["Text-heavy middle section", "Missing real-world context for formula"]
      });
    }, 2500);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--app-text-secondary)",
        backdropFilter: "blur(4px)",
        padding: 20
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 640,
          background: "var(--app-card)",
          borderRadius: 24,
          boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "85vh"
        }}
      >
        <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--app-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--app-text-primary)", letterSpacing: "-0.02em" }}>Test Drive Lesson</h2>
            <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", marginTop: 4 }}>Simulate this lesson against an AI student persona.</p>
          </div>
          <button onClick={onClose} style={{ background: "var(--app-border-glow)", border: "none", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "32px", flex: 1, overflowY: "auto", maxHeight: "70vh" }}>
          {!results && !isSimulating && (
            <>
              <h3 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--app-text-secondary)", marginBottom: 12 }}>Select Persona</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PERSONAS.map(p => {
                  const Icon = p.icon || User;
                  const active = selectedPersona.id === p.id;
                  return (
                    <div key={p.id} onClick={() => setSelectedPersona(p)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px", borderRadius: 16, border: `1.5px solid ${active ? p.color : "var(--app-border-glow)"}`, background: active ? p.bg : "var(--app-card)", cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: active ? p.color : "var(--app-border-glow)", color: active ? "var(--app-card)" : "var(--app-text-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "15px", fontWeight: 650, color: active ? p.color : "var(--app-text-primary)" }}>{p.name}</p>
                        <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", marginTop: 2 }}>{p.desc}</p>
                      </div>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${active ? p.color : "var(--app-border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {active && <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.color }} />}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}>
                <button onClick={handleSimulate} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "var(--app-text-primary)", color: "var(--app-card)", borderRadius: 12, border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                  <Play size={16} fill="currentColor" /> Run Simulation
                </button>
              </div>
            </>
          )}

          {isSimulating && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 0" }}>
               <div style={{ width: 64, height: 64, borderRadius: "50%", border: "4px solid rgba(124,58,237,0.1)", borderTopColor: "#7C3AED", animation: "spin 1s linear infinite", marginBottom: 24 }} />
               <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--app-text-primary)" }}>Simulating lesson with {selectedPersona.name}...</p>
               <p style={{ fontSize: "13px", color: "var(--app-text-secondary)", marginTop: 8 }}>Analyzing {activeSlides.length} slides for cognitive load and pacing.</p>
               <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {results && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                 <div style={{ position: "relative", width: 80, height: 80 }}>
                   <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                     <circle cx="50" cy="50" r="45" fill="none" stroke="var(--app-border-glow)" strokeWidth="10" />
                     <circle cx="50" cy="50" r="45" fill="none" stroke={selectedPersona.color} strokeWidth="10" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * results.score) / 100} style={{ transition: "stroke-dashoffset 1s ease-in-out" }} />
                   </svg>
                   <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 800, color: selectedPersona.color }}>
                     {results.score}%
                   </div>
                 </div>
                 <div>
                   <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--app-text-primary)" }}>Simulation Complete</h3>
                   <p style={{ fontSize: "14px", color: "var(--app-text-secondary)", marginTop: 4 }}>{selectedPersona.name}'s comprehension score.</p>
                 </div>
              </div>
              
              <div style={{ background: selectedPersona.bg, padding: 20, borderRadius: 16, marginBottom: 24 }}>
                <p style={{ fontSize: "14.5px", color: selectedPersona.color, lineHeight: 1.6, fontWeight: 500 }}>"{results.feedback}"</p>
              </div>

              <div style={{ display: "flex", gap: 24 }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--app-text-secondary)", marginBottom: 12 }}>Strengths</h4>
                  {results.strengths.map((s: string, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
                      <CheckCircle2 size={16} color="#16A34A" style={{ marginTop: 2 }} />
                      <span style={{ fontSize: "13.5px", color: "var(--app-text-secondary)" }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--app-text-secondary)", marginBottom: 12 }}>Areas for Improvement</h4>
                  {results.weaknesses.map((w: string, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
                      <AlertCircle size={16} color="#DC2626" style={{ marginTop: 2 }} />
                      <span style={{ fontSize: "13.5px", color: "var(--app-text-secondary)" }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
