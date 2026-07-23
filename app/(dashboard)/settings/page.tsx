"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Bell, Shield, Paintbrush, Monitor, Lock, 
  Smartphone, Upload, Save, EyeOff, Zap, Image as ImageIcon
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", fontFamily: "'Inter', -apple-system, sans-serif", background: "var(--app-bg)", color: "var(--app-text-primary)", transition: "background 0.3s, color 0.3s" }}>
      
      {/* ── HEADER ── */}
      <div style={{ padding: "32px 40px 24px", borderBottom: "1px solid var(--app-border)", background: "var(--app-bg)", transition: "background 0.3s, border-color 0.3s" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.02em" }}>Settings</h1>
        <p style={{ fontSize: "14px", color: "var(--app-text-secondary)", marginTop: 4, fontWeight: 500 }}>Manage your Eridock Studio identity and workspace preferences.</p>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        
        {/* SIDEBAR NAVIGATION */}
        <div style={{ width: 240, borderRight: "1px solid var(--app-border)", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 4, transition: "border-color 0.3s" }}>
          <TabButton id="profile" icon={User} label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <TabButton id="appearance" icon={Paintbrush} label="Appearance" active={activeTab === "appearance"} onClick={() => setActiveTab("appearance")} />
          <TabButton id="notifications" icon={Bell} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
          <TabButton id="security" icon={Shield} label="Security" active={activeTab === "security"} onClick={() => setActiveTab("security")} />
        </div>

        {/* CONTENT AREA */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
          <div style={{ maxWidth: 640 }}>
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: 24 }}>Public Profile</h2>
                  
                  {/* Avatar Section */}
                  <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 32, padding: 24, background: "var(--app-card)", borderRadius: 16, border: "1px solid var(--app-border)", boxShadow: "var(--app-shadow)" }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B00 0%,#FF9840 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--app-card)", fontSize: "28px", fontWeight: 700 }}>
                      AO
                    </div>
                    <div>
                      <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                        <button style={{ padding: "8px 16px", borderRadius: 8, background: "var(--app-text-primary)", color: "var(--app-bg)", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                          <Upload size={14} /> Upload Avatar
                        </button>
                        <button style={{ padding: "8px 16px", borderRadius: 8, background: "transparent", color: "var(--app-danger)", border: "1px solid var(--app-border)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                          Remove
                        </button>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--app-text-secondary)" }}>Recommended size is 256x256px.</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 650, color: "var(--app-text-primary)", marginBottom: 8 }}>First Name</label>
                        <input type="text" defaultValue="Amara" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-bg)", color: "var(--app-text-primary)", fontSize: "14px", fontFamily: "inherit", outline: "none", transition: "border 0.2s" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 650, color: "var(--app-text-primary)", marginBottom: 8 }}>Last Name</label>
                        <input type="text" defaultValue="Osei" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-bg)", color: "var(--app-text-primary)", fontSize: "14px", fontFamily: "inherit", outline: "none" }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 650, color: "var(--app-text-primary)", marginBottom: 8 }}>Role</label>
                      <input type="text" defaultValue="Content Lead" disabled style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-border-glow)", color: "var(--app-text-secondary)", fontSize: "14px", fontFamily: "inherit", cursor: "not-allowed" }} />
                      <p style={{ fontSize: "11px", color: "var(--app-text-secondary)", marginTop: 6 }}>Your role is managed by Workspace Admins.</p>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 650, color: "var(--app-text-primary)", marginBottom: 8 }}>Bio</label>
                      <textarea defaultValue="Curriculum Director specializing in STEM topics. Passionate about interactive learning." style={{ width: "100%", height: 100, padding: "12px 14px", borderRadius: 8, border: "1px solid var(--app-border)", background: "var(--app-bg)", color: "var(--app-text-primary)", fontSize: "14px", fontFamily: "inherit", outline: "none", resize: "vertical" }} />
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <button style={{ padding: "10px 20px", borderRadius: 8, background: "var(--app-brand)", color: "var(--app-card)", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "var(--app-brand-glow) 0 8px 24px" }}>
                        <Save size={14} /> Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "appearance" && (
                <motion.div key="appearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: 8 }}>Appearance</h2>
                  <p style={{ fontSize: "14px", color: "var(--app-text-secondary)", marginBottom: 24 }}>Customize how Eridock Studio looks on this device.</p>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <ThemeCard mode="light" title="Light" active={false} />
                    <ThemeCard mode="dark" title="Studio Dark" active={true} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 8,
        background: active ? "var(--app-border-glow)" : "transparent",
        border: "none",
        cursor: "pointer",
        color: active ? "var(--app-text-primary)" : "var(--app-text-secondary)",
        fontSize: "13px",
        fontWeight: active ? 600 : 500,
        transition: "all 0.2s"
      }}
    >
      <Icon size={16} /> {label}
    </button>
  );
}

function ThemeCard({ mode, title, active }: any) {
  const isDark = mode === "dark";
  return (
    <div style={{ 
      border: `2px solid ${active ? 'var(--app-brand)' : 'var(--app-border)'}`, 
      borderRadius: 16, 
      overflow: "hidden", 
      cursor: "pointer", 
      background: "var(--app-card)",
      boxShadow: active ? "var(--app-brand-glow) 0 4px 24px" : "none"
    }}>
      <div style={{ 
        height: 120, 
        background: isDark ? "#050505" : "#F7F6F3", 
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        borderBottom: "1px solid var(--app-border)"
      }}>
        {/* Mock Window */}
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: isDark ? "#333" : "#E5E5E5" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: isDark ? "#333" : "#E5E5E5" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: isDark ? "#333" : "#E5E5E5" }} />
        </div>
        <div style={{ height: 12, width: "60%", borderRadius: 4, background: isDark ? "#FF6B00" : "#FF6B00" }} />
        <div style={{ height: 8, width: "40%", borderRadius: 4, background: isDark ? "#222" : "#E5E5E5" }} />
        <div style={{ height: 8, width: "80%", borderRadius: 4, background: isDark ? "#222" : "#E5E5E5" }} />
      </div>
      <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--app-text-primary)" }}>{title}</span>
        {active && <div style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--app-brand)", border: "3px solid var(--app-card)" }} />}
      </div>
    </div>
  );
}
