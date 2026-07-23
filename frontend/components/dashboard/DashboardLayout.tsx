"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, PenLine, FolderOpen, BarChart2, Users,
  Settings, ChevronDown, ChevronRight, Bell, Search, Plus,
  CheckCircle2, Circle, Clock, AlertCircle, GitPullRequest,
  Layers, MessageSquare, X, Sparkles, PanelLeft, PanelRight,
  FileText, Target, History, Link2, Brain, Gauge, ListChecks,
  TrendingUp, Zap, BookOpen, Eye, Moon, Sun, LogOut
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

/* ─── Types ────────────────────────────────────────────────────── */
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

/* ─── Nav Config ───────────────────────────────────────────────── */
const PRIMARY_NAV: NavItem[] = [
  { label: "Home",      href: "/dashboard",  icon: LayoutDashboard },
  { label: "Curriculum",     href: "/curriculum", icon: Layers },
  { label: "Lesson Builder", href: "/lessons",    icon: PenLine },
  { label: "Questions",      href: "/questions",  icon: MessageSquare },
  { label: "Media Library",  href: "/media",      icon: FolderOpen },
  { label: "Analytics",      href: "/analytics",  icon: BarChart2 },
];

const SECONDARY_NAV: NavItem[] = [
  { label: "My Reviews",     href: "/reviews",    icon: GitPullRequest, badge: 4 },
  { label: "Pending Drafts", href: "/drafts",     icon: Circle,         badge: 7 },
];

const FOOTER_NAV: NavItem[] = [
  { label: "Team",     href: "/team",     icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
];

/* ─── NavLink ──────────────────────────────────────────────────── */
function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const active   = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon     = item.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: collapsed ? 0 : 9,
        justifyContent: collapsed ? "center" : "flex-start",
        height: 36,
        padding: collapsed ? "0 10px" : "0 10px",
        borderRadius: 8,
        textDecoration: "none",
        fontSize: "13px",
        fontWeight: active ? 550 : 430,
        letterSpacing: "-0.01em",
        color: active ? "var(--app-text-primary)" : hovered ? "var(--app-text-primary)" : "var(--app-text-secondary)",
        background: active
          ? "var(--app-card)"
          : hovered ? "var(--app-border)" : "transparent",
        boxShadow: active ? "var(--shadow-xs)" : "none",
        border: active ? "1px solid var(--app-border)" : "1px solid transparent",
        transition: "all 0.15s ease",
        position: "relative",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {/* Active accent bar */}
      {active && !collapsed && (
        <motion.div
          layoutId="nav-accent"
          style={{
            position: "absolute",
            left: 0,
            top: "18%",
            bottom: "18%",
            width: 2.5,
            borderRadius: 9999,
            background: "var(--color-brand)",
          }}
        />
      )}

      {/* Icon */}
      <motion.div
        animate={{ x: hovered && !active && !collapsed ? 1.5 : 0 }}
        transition={{ duration: 0.14, ease: "easeOut" }}
        style={{ flexShrink: 0, display: "flex" }}
      >
        <Icon
          size={15}
          strokeWidth={active ? 2 : 1.7}
          style={{
            color: active
              ? "var(--color-mild-blue)"
              : hovered ? "var(--app-text-secondary)" : "var(--app-text-secondary)",
            transition: "color 0.15s ease",
          }}
        />
      </motion.div>

      {/* Label */}
      {!collapsed && (
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.label}
        </span>
      )}

      {/* Badge – expanded */}
      {!collapsed && item.badge != null && (
        <span
          style={{
            minWidth: 18,
            height: 18,
            borderRadius: 9999,
            background: active ? "var(--color-brand)" : "var(--app-border)",
            color: active ? "var(--app-card)" : "var(--app-text-secondary)",
            fontSize: "10px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 5px",
            transition: "background 0.15s, color 0.15s",
          }}
        >
          {item.badge}
        </span>
      )}

      {/* Badge dot – collapsed */}
      {collapsed && item.badge != null && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 8,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--color-brand)",
            border: "1.5px solid #EFEDE9",
          }}
        />
      )}
    </Link>
  );
}

/* ─── User Row ─────────────────────────────────────────────────── */
function UserRow({ collapsed }: { collapsed: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: collapsed ? "8px 0" : "7px 10px",
          borderRadius: 9,
          cursor: "pointer",
          justifyContent: collapsed ? "center" : "flex-start",
          background: hovered || menuOpen ? "var(--app-border)" : "transparent",
          transition: "background 0.15s ease",
        }}
      >
        {/* Avatar + presence */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#FF6B00 0%,#FF9840 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--app-card)",
              fontSize: "10.5px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              boxShadow: hovered || menuOpen ? "0 0 0 2px rgba(255,107,0,0.28)" : "none",
              transition: "box-shadow 0.2s ease",
            }}
          >
            AO
          </div>
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#16A34A",
              border: "1.5px solid var(--app-bg)",
            }}
          />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ flex: 1, overflow: "hidden" }}
            >
              <p style={{ fontSize: "12.5px", fontWeight: 580, letterSpacing: "-0.01em", color: "var(--app-text-primary)", whiteSpace: "nowrap" }}>
                Dr. Amara Osei
              </p>
              <p style={{ fontSize: "10.5px", color: "var(--app-text-secondary)", fontWeight: 430 }}>
                Content Lead
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <motion.div animate={{ rotate: menuOpen ? 180 : (hovered ? 180 : 0) }} transition={{ duration: 0.2 }}>
            <ChevronDown size={12} style={{ color: "var(--app-text-secondary)", flexShrink: 0 }} />
          </motion.div>
        )}
      </div>

      {/* DROPUP MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 12px)",
              left: collapsed ? 0 : 0,
              width: 260,
              background: theme === "dark" ? "rgba(10, 10, 10, 0.75)" : "rgba(255, 255, 255, 0.85)",
              borderRadius: 20,
              boxShadow: theme === "dark" 
                ? "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.08)"
                : "0 32px 64px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.5)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              padding: 8,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              gap: 4
            }}
          >
            {/* Header Profile Info */}
            <div style={{ padding: "16px 12px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid var(--app-border)", marginBottom: 4 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B00 0%,#FF9840 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--app-card)", fontSize: "14px", fontWeight: 700, boxShadow: "0 4px 12px rgba(255,107,0,0.3)" }}>
                AO
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)", letterSpacing: "-0.01em" }}>Dr. Amara Osei</p>
                <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 500, marginTop: 2 }}>amara.o@eridock.edu</p>
              </div>
            </div>

            <motion.div whileHover={{ backgroundColor: "var(--app-border-glow)" }} style={{ borderRadius: 12 }}>
              <Link href="/settings" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", color: "var(--app-text-primary)", textDecoration: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                <Settings size={16} style={{ color: "var(--app-text-secondary)" }} /> Profile Settings
              </Link>
            </motion.div>
            
            {/* Dark Mode Toggle */}
            <motion.div 
              whileHover={{ backgroundColor: "var(--app-border-glow)" }}
              onClick={toggleTheme}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 12, cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--app-text-primary)", fontSize: "13px", fontWeight: 600 }}>
                {theme === "dark" ? <Moon size={16} style={{ color: "var(--app-brand)" }} /> : <Sun size={16} style={{ color: "var(--app-text-secondary)" }} />} 
                Studio Dark Mode
              </div>
              <div style={{ width: 36, height: 20, borderRadius: 20, background: theme === "dark" ? "var(--app-brand)" : "var(--app-border)", position: "relative", transition: "background 0.3s ease" }}>
                <motion.div 
                  animate={{ x: theme === "dark" ? 18 : 2 }} 
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--app-card)", position: "absolute", top: 2, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} 
                />
              </div>
            </motion.div>

            <div style={{ height: 1, background: "var(--app-border)", margin: "4px 0" }} />
            
            <motion.div whileHover={{ backgroundColor: "var(--app-border-glow)" }} style={{ borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", color: "var(--app-danger)", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
                <LogOut size={16} /> Log out
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sidebar ──────────────────────────────────────────────────── */
function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const w = collapsed ? 56 : 240;

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ type: "spring", stiffness: 360, damping: 32 }}
      style={{
        width: w,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--app-bg)",
        borderRight: "1px solid var(--app-border)",
        overflow: "visible",
        zIndex: 9999,
        willChange: "width",
      }}
    >
      {/* Workspace header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          height: 60,
          padding: "0 16px",
          borderBottom: "1px solid var(--app-border)",
          overflow: "hidden",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: "var(--app-text-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.35, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--color-brand)",
            }}
          />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              style={{ flex: 1, overflow: "hidden" }}
            >
            <div style={{ display: "flex", alignItems: "center" }}>
                <svg width="115" height="32" viewBox="0 0 115 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="signature-grad" x1="0" y1="0" x2="115" y2="32" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FF6B00" />
                      <stop offset="50%" stopColor="#FF9840" />
                      <stop offset="100%" stopColor="#FF6B00" />
                      <animate attributeName="x1" values="0;-115;0" dur="4s" repeatCount="indefinite" />
                      <animate attributeName="x2" values="115;0;115" dur="4s" repeatCount="indefinite" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M5 20 C10 10, 15 5, 20 18 C25 28, 30 18, 35 15 C45 10, 50 25, 60 20 C70 15, 75 8, 85 12 C95 18, 105 25, 110 20"
                    stroke="url(#signature-grad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <motion.circle
                    cx="25" cy="8" r="1.5" fill="#FF6B00"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }}
                  />
                  <motion.circle
                    cx="88" cy="8" r="1.5" fill="#FF6B00"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4 }}
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <button
            onClick={onToggle}
            title="Collapse sidebar"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              borderRadius: 6,
              color: "var(--app-text-secondary)",
              display: "flex",
              flexShrink: 0,
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--app-border)";
              e.currentTarget.style.color = "var(--app-text-secondary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--app-text-secondary)";
            }}
          >
            <PanelLeft size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <div
        style={{
          flex: 1,
          padding: "10px 8px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} />
          ))}
        </nav>

        <div style={{ margin: "12px 2px" }}>
          {!collapsed ? (
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "var(--app-border)",
                textTransform: "uppercase",
                marginBottom: 6,
                paddingLeft: 10,
              }}
            >
              My Work
            </p>
          ) : (
            <div style={{ height: 1, background: "var(--app-border)", margin: "4px 8px" }} />
          )}
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {SECONDARY_NAV.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "8px",
          borderTop: "1px solid var(--app-border)",
          flexShrink: 0,
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 8 }}>
          {FOOTER_NAV.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} />
          ))}
        </nav>
        <UserRow collapsed={collapsed} />
      </div>
    </motion.aside>
  );
}

/* ─── Command Palette ──────────────────────────────────────────── */
const CMD_GROUPS = [
  {
    label: "Recent",
    items: [
      { label: "Intro to Quadratic Equations", icon: PenLine,       shortcut: "" },
      { label: "Chemical Bonding — Review",    icon: GitPullRequest, shortcut: "" },
    ],
  },
  {
    label: "Create",
    items: [
      { label: "New Lesson",    icon: PenLine,       shortcut: "N" },
      { label: "New Question",  icon: MessageSquare, shortcut: "Q" },
      { label: "Upload Media",  icon: FolderOpen,    shortcut: "U" },
    ],
  },
  {
    label: "Navigate",
    items: [
      { label: "Dashboard",     icon: LayoutDashboard, shortcut: "" },
      { label: "Curriculum",    icon: Layers,           shortcut: "" },
      { label: "My Reviews",    icon: GitPullRequest,   shortcut: "" },
      { label: "Analytics",     icon: BarChart2,        shortcut: "" },
      { label: "Settings",      icon: Settings,         shortcut: "" },
    ],
  },
];

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery]       = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allItems = CMD_GROUPS.flatMap((g) => g.items);
  const filtered = query
    ? allItems.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  useEffect(() => {
    if (open) { setQuery(""); setActiveIdx(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter") { onClose(); }
  };

  const groups = query ? [{ label: "Results", items: filtered }] : CMD_GROUPS;
  let gIdx = 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "var(--app-text-secondary)",
              zIndex: 80,
              backdropFilter: "blur(4px)",
            }}
          />

          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            style={{
              position: "fixed",
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: 560,
              zIndex: 90,
              background: "var(--app-card)",
              borderRadius: 18,
              border: "1px solid var(--app-border)",
              boxShadow: "0 32px 80px var(--app-border), 0 4px 16px var(--app-border-glow)",
              overflow: "hidden",
            }}
          >
            {/* Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 18px",
                borderBottom: "1px solid var(--app-border)",
              }}
            >
              <Search size={15} style={{ color: "var(--app-text-secondary)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
                onKeyDown={handleKey}
                placeholder="Search or jump to…"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  color: "var(--app-text-primary)",
                  background: "transparent",
                  letterSpacing: "-0.015em",
                  fontWeight: 430,
                }}
              />
              <button
                onClick={onClose}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 3, color: "var(--app-text-secondary)", display: "flex" }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Results */}
            <div style={{ padding: "8px", maxHeight: 360, overflowY: "auto" }}>
              {groups.map((group) => (
                <div key={group.label}>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--app-text-secondary)",
                      padding: "6px 10px 4px",
                    }}
                  >
                    {group.label}
                  </p>
                  {group.items.map((cmd) => {
                    const idx = gIdx++;
                    const isActive = idx === activeIdx;
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.label + idx}
                        onClick={onClose}
                        onMouseEnter={() => setActiveIdx(idx)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 10px",
                          borderRadius: 9,
                          border: "none",
                          background: isActive ? "rgba(255,107,0,0.07)" : "none",
                          cursor: "pointer",
                          fontSize: "13.5px",
                          color: isActive ? "var(--app-text-primary)" : "var(--app-text-primary)",
                          fontWeight: isActive ? 520 : 430,
                          letterSpacing: "-0.01em",
                          textAlign: "left",
                          transition: "background 0.1s, color 0.1s",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 7,
                              background: isActive ? "rgba(255,107,0,0.10)" : "var(--app-border)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              transition: "background 0.1s",
                            }}
                          >
                            <Icon size={13} style={{ color: isActive ? "var(--color-brand)" : "var(--app-text-secondary)", transition: "color 0.1s" }} />
                          </div>
                          {cmd.label}
                        </div>
                        {cmd.shortcut && (
                          <kbd
                            style={{
                              fontSize: "10px",
                              fontWeight: 600,
                              color: "var(--app-text-secondary)",
                              background: "var(--app-border)",
                              padding: "2px 6px",
                              borderRadius: 5,
                              letterSpacing: "0.02em",
                            }}
                          >
                            ⌘{cmd.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}

              {/* AI row */}
              <div style={{ margin: "6px 0 2px", height: 1, background: "var(--app-border)" }} />
              <button
                onClick={onClose}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 9,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--app-text-secondary)",
                  fontWeight: 430,
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--app-border)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <Sparkles size={13} style={{ color: "var(--color-brand)" }} />
                Ask AI about &ldquo;{query || "anything"}&rdquo;
              </button>
            </div>

            {/* Footer hints */}
            <div style={{ padding: "8px 16px", borderTop: "1px solid var(--app-border)", display: "flex", gap: 14 }}>
              {([["↑↓", "Navigate"], ["↵", "Select"], ["Esc", "Close"]] as const).map(([k, l]) => (
                <span key={k} style={{ fontSize: "11px", color: "var(--app-text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                  <kbd style={{ background: "var(--app-border)", padding: "1px 5px", borderRadius: 4, fontWeight: 600 }}>{k}</kbd>
                  {l}
                </span>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Notification Panel ───────────────────────────────────────── */
const NOTIFS = [
  { id: 1, type: "review",   title: "Chemical Bonding submitted",  desc: "Kwame Asante requested your review", ago: "30 min ago",  unread: true  },
  { id: 2, type: "publish",  title: "Algebra Ch. 2 published",     desc: "Successfully live for learners",      ago: "1 hour ago",  unread: true  },
  { id: 3, type: "comment",  title: "Comment on Essay Structure",  desc: "Sara Mensah left a note",             ago: "3 hours ago", unread: false },
  { id: 4, type: "system",   title: "Quality check complete",      desc: "96.4% — above target threshold",      ago: "Yesterday",   unread: false },
];

const NOTIF_ICONS: Record<string, React.ElementType> = {
  review: GitPullRequest, publish: CheckCircle2, comment: MessageSquare, system: AlertCircle,
};
const NOTIF_COLORS: Record<string, string> = {
  review: "#F59E0B", publish: "#16A34A", comment: "#2563EB", system: "#78716C",
};

function NotificationPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 44 }} onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          width: 320,
          zIndex: 50,
          background: "var(--app-card)",
          borderRadius: 14,
          border: "1px solid var(--app-border)",
          boxShadow: "0 20px 56px var(--app-border), 0 4px 12px var(--app-border-glow)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--app-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "13px", fontWeight: 640, color: "var(--app-text-primary)", letterSpacing: "-0.015em" }}>
            Notifications
          </p>
          <span style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--color-brand)", cursor: "pointer" }}>
            Mark all read
          </span>
        </div>

        {NOTIFS.map((n, i) => {
          const Icon  = NOTIF_ICONS[n.type];
          const color = NOTIF_COLORS[n.type];
          return (
            <div
              key={n.id}
              style={{
                padding: "11px 16px",
                display: "flex",
                gap: 11,
                alignItems: "flex-start",
                borderBottom: i < NOTIFS.length - 1 ? "1px solid var(--app-border-glow)" : "none",
                background: n.unread ? "rgba(255,107,0,0.022)" : "transparent",
                cursor: "pointer",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--app-border)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = n.unread ? "rgba(255,107,0,0.022)" : "transparent")}
            >
              <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={13} style={{ color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                  <p style={{ fontSize: "12.5px", fontWeight: n.unread ? 580 : 450, color: "var(--app-text-primary)", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                    {n.title}
                  </p>
                  {n.unread && (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-brand)", flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
                <p style={{ fontSize: "11.5px", color: "var(--app-text-secondary)", marginTop: 1 }}>{n.desc}</p>
                <p style={{ fontSize: "10.5px", color: "var(--app-border)", marginTop: 2 }}>{n.ago}</p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </>
  );
}

/* ─── New Menu ─────────────────────────────────────────────────── */
function NewMenu({ onClose }: { onClose: () => void }) {
  const items = [
    { label: "New Lesson",   desc: "Start from a blank canvas",   icon: PenLine,       shortcut: "⌘N", href: "/lessons" },
    { label: "New Question", desc: "Add to the question bank",     icon: MessageSquare, shortcut: "⌘Q", href: "/questions" },
    { label: "Upload Media", desc: "Images, videos, documents",    icon: FolderOpen,    shortcut: "⌘U", href: "/media" },
  ];
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 44 }} onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          width: 240,
          zIndex: 50,
          background: "var(--app-card)",
          borderRadius: 12,
          border: "1px solid var(--app-border)",
          boxShadow: "0 20px 56px var(--app-border), 0 4px 12px var(--app-border-glow)",
          padding: "6px",
          overflow: "hidden",
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                border: "none",
                background: "none",
                cursor: "pointer",
                textAlign: "left",
                textDecoration: "none",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--app-border)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--app-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={13} style={{ color: "var(--app-text-secondary)" }} strokeWidth={1.7} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12.5px", fontWeight: 550, color: "var(--app-text-primary)", letterSpacing: "-0.01em" }}>{item.label}</p>
                <p style={{ fontSize: "11px", color: "var(--app-text-secondary)", marginTop: 1 }}>{item.desc}</p>
              </div>
              <kbd style={{ fontSize: "10px", fontWeight: 600, color: "var(--app-border)", background: "var(--app-border)", padding: "1px 5px", borderRadius: 4, flexShrink: 0 }}>
                {item.shortcut}
              </kbd>
            </Link>
          );
        })}
      </motion.div>
    </>
  );
}

/* ─── TopBar ───────────────────────────────────────────────────── */
function TopBar({
  onCommand,
  sidebarCollapsed,
  onSidebarToggle,
  panelOpen,
  onPanelToggle,
  panelLocked = false,
}: {
  onCommand: () => void;
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  panelOpen: boolean;
  onPanelToggle: () => void;
  panelLocked?: boolean;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [askAIOpen, setAskAIOpen] = useState(false);

  return (
    <header
      style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        background: "var(--app-bg)",
        position: "sticky",
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
        {sidebarCollapsed && (
          <button
            onClick={onSidebarToggle}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "5px 6px", borderRadius: 7, color: "var(--app-text-secondary)", display: "flex" }}
          >
            <PanelLeft size={15} />
          </button>
        )}
        <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "12.5px", color: "var(--app-text-secondary)", fontWeight: 450 }}>Eridock</span>
          <span style={{ color: "var(--app-border)", fontSize: "12px" }}>/</span>
          <span style={{ fontSize: "12.5px", color: "var(--app-text-primary)", fontWeight: 580 }}>Dashboard</span>
        </nav>
      </div>

      
              {/* Center Search */}
      <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
        <button
          onClick={onCommand}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 16px",
            borderRadius: 12,
            border: "1px solid var(--app-border)",
            background: "var(--app-border)",
            cursor: "pointer",
            fontSize: "13px",
            color: "var(--app-text-secondary)",
            width: "100%",
            maxWidth: "320px",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--app-border)";
            e.currentTarget.style.background = "var(--app-card)";
            e.currentTarget.style.boxShadow = "0 2px 8px var(--app-border-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--app-border)";
            e.currentTarget.style.background = "var(--app-border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <Search size={14} />
          <span style={{ flex: 1, textAlign: "left" }}>Search anywhere...</span>
          <kbd style={{ fontSize: "10px", background: "var(--app-border)", padding: "2px 6px", borderRadius: 4, fontWeight: 700, color: "var(--app-text-secondary)" }}>
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, justifyContent: "flex-end" }}>
        
        {/* Notification */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen((p) => !p); setNewOpen(false); }}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              border: "1px solid var(--app-border)",
              background: notifOpen ? "var(--app-border)" : "var(--app-card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--app-text-secondary)",
              boxShadow: "0 1px 2px var(--app-border-glow)",
              position: "relative",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--app-border)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--app-border)")}
          >
            <Bell size={14} />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 15 }}
              style={{
                position: "absolute",
                top: 7,
                right: 7,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--color-brand)",
                border: "1.5px solid #F5F4F1",
              }}
            />
          </button>
          <AnimatePresence>
            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
          </AnimatePresence>
        </div>

        {/* New */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setNewOpen((p) => !p); setNotifOpen(false); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 13px",
              borderRadius: 9,
              border: "none",
              background: "var(--app-text-primary)",
              color: "var(--app-card)",
              fontSize: "12.5px",
              fontWeight: 580,
              cursor: "pointer",
              letterSpacing: "-0.01em",
              boxShadow: "0 1px 3px var(--app-border),inset 0 1px 0 rgba(255,255,255,0.08)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--app-border)";
              e.currentTarget.style.boxShadow = "0 2px 8px var(--app-border),inset 0 1px 0 rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--app-text-primary)";
              e.currentTarget.style.boxShadow = "0 1px 3px var(--app-border),inset 0 1px 0 rgba(255,255,255,0.08)";
            }}
          >
            <Plus size={13} />
            New
          </button>
          <AnimatePresence>
            {newOpen && <NewMenu onClose={() => setNewOpen(false)} />}
          </AnimatePresence>
        </div>

        {/* Context panel toggle */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              if (panelLocked) {
                setToastOpen(true);
                setTimeout(() => setToastOpen(false), 3000);
              } else {
                onPanelToggle();
              }
            }}
            title={panelLocked ? "Panel locked by active workspace" : panelOpen ? "Hide context panel" : "Show context panel"}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              border: "1px solid var(--app-border)",
              background: panelLocked ? "var(--app-border)" : panelOpen ? "rgba(255,107,0,0.08)" : "var(--app-card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: panelLocked ? "not-allowed" : "pointer",
              color: panelLocked ? "var(--app-border)" : panelOpen ? "var(--app-brand)" : "var(--app-text-secondary)",
              boxShadow: panelLocked ? "none" : "0 1px 2px var(--app-border-glow)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => { if (!panelLocked) e.currentTarget.style.borderColor = "var(--app-border)"; }}
            onMouseLeave={(e) => { if (!panelLocked) e.currentTarget.style.borderColor = "var(--app-border)"; }}
          >
            <PanelRight size={14} />
          </button>
          
          <AnimatePresence>
            {toastOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 220,
                  background: "var(--app-text-primary)",
                  color: "var(--app-card)",
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: 1.4,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  zIndex: 100,
                  pointerEvents: "none"
                }}
              >
                <p style={{ margin: 0 }}>This workspace uses a custom intelligence panel.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

/* ─── Context Panel Section ────────────────────────────────────── */
function PanelSection({
  icon: Icon,
  title,
  children,
  defaultOpen = true,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: "1px solid var(--app-border)" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.12s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--app-border)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Icon size={12} style={{ color: "var(--app-text-secondary)" }} strokeWidth={1.8} />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 650,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--app-text-secondary)",
            }}
          >
            {title}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronRight size={12} style={{ color: "var(--app-text-secondary)" }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 18px 16px" }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Context Panel Content ────────────────────────────────────── */
const AI_SUGGESTIONS = [
  { color: "#F59E0B", text: "3 questions in Algebra Ch. 3 have a 67% skip rate — consider rephrasing." },
  { color: "#16A34A", text: "Photosynthesis lesson is missing measurable learning objectives." },
  { color: "#FF6B00", text: "Chemical Bonding has been in review for 2+ days without action." },
];

const VERSION_HISTORY = [
  { title: "Algebra Ch. 2",       author: "Nadia O.",  time: "1 hour ago"  },
  { title: "Photosynthesis",       author: "Amara O.",  time: "Yesterday"   },
  { title: "French Revolution",    author: "James T.",  time: "2 days ago"  },
];

const MISCONCEPTIONS = [
  "Students conflate ionic and covalent bonds in Ch. 4",
  "\"Speed\" and \"velocity\" treated interchangeably in Physics module",
  "Common confusion between correlation and causation in Statistics",
];

const OBJECTIVES_COVERAGE = [
  { label: "Has objectives", pct: 73, color: "#16A34A" },
  { label: "Missing",        pct: 27, color: "var(--app-border)" },
];

function ContextPanel({ open }: { open: boolean }) {
  const publishRing = { score: 87, ready: 8, review: 5, changes: 3 };
  const total = publishRing.ready + publishRing.review + publishRing.changes;

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 288, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
          style={{
            width: 288,
            flexShrink: 0,
            height: "100vh",
            position: "sticky",
            top: 0,
            display: "flex",
            flexDirection: "column",
            background: "var(--app-card)",
            borderLeft: "1px solid var(--app-border)",
            overflowX: "hidden",
            overflowY: "auto",
            zIndex: 20,
            willChange: "width",
          }}
        >
          {/* Panel header */}
          <div
            style={{
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 18px",
              borderBottom: "1px solid var(--app-border)",
              flexShrink: 0,
            }}
          >
            <div>
              <p style={{ fontSize: "12px", fontWeight: 650, color: "var(--app-text-primary)", letterSpacing: "-0.015em", whiteSpace: "nowrap" }}>
                Context
              </p>
            </div>
            
          </div>

          {/* Sections */}
          <div style={{ flex: 1, overflowY: "auto" }}>

            {/* ── AI Assistant ── */}
            <PanelSection icon={Sparkles} title="AI Assistant">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {AI_SUGGESTIONS.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    style={{
                      padding: "9px 11px",
                      borderRadius: 9,
                      background: "var(--app-card)",
                      border: "1px solid var(--app-border)",
                      boxShadow: "0 1px 2px var(--app-border-glow)",
                      cursor: "pointer",
                      transition: "box-shadow 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 6px var(--app-border-glow)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--app-border)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 2px var(--app-border-glow)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--app-border)";
                    }}
                  >
                    <div style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, flexShrink: 0, marginTop: 4 }} />
                      <p style={{ fontSize: "12px", color: "var(--app-text-primary)", lineHeight: 1.5, letterSpacing: "-0.005em" }}>
                        {s.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </PanelSection>

            {/* ── Publishing Health ── */}
            <PanelSection icon={Target} title="Publishing Health">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Ring */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <svg width={56} height={56} style={{ transform: "rotate(-90deg)" }}>
                    <circle cx={28} cy={28} r={22} fill="none" stroke="var(--app-border)" strokeWidth={5} />
                    <motion.circle
                      cx={28} cy={28} r={22}
                      fill="none"
                      stroke="var(--color-brand)"
                      strokeWidth={5}
                      strokeLinecap="round"
                      strokeDasharray={138.2}
                      initial={{ strokeDashoffset: 138.2 }}
                      animate={{ strokeDashoffset: 138.2 * (1 - publishRing.score / 100) }}
                      transition={{ duration: 1.3, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <span style={{ fontSize: "13px", fontWeight: 750, color: "var(--app-text-primary)", letterSpacing: "-0.03em", lineHeight: 1 }}>{publishRing.score}</span>
                    <span style={{ fontSize: "8.5px", color: "var(--app-text-secondary)", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>score</span>
                  </div>
                </div>

                {/* Breakdown */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { label: "Ready", count: publishRing.ready, color: "#16A34A" },
                    { label: "In Review", count: publishRing.review, color: "#F59E0B" },
                    { label: "Changes", count: publishRing.changes, color: "#DC2626" },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.color }} />
                        <span style={{ fontSize: "11.5px", color: "var(--app-text-secondary)", fontWeight: 430 }}>{item.label}</span>
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 660, color: "var(--app-text-primary)", letterSpacing: "-0.02em" }}>{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stacked bar */}
              <div style={{ marginTop: 10, display: "flex", height: 4, borderRadius: 9999, overflow: "hidden", gap: 2 }}>
                {[
                  { count: publishRing.ready, color: "#16A34A" },
                  { count: publishRing.review, color: "#F59E0B" },
                  { count: publishRing.changes, color: "#DC2626" },
                ].map((seg, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0 }}
                    animate={{ width: `${(seg.count / total) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    style={{ height: "100%", background: seg.color, borderRadius: 9999 }}
                  />
                ))}
              </div>
            </PanelSection>

            {/* ── Review Status ── */}
            <PanelSection icon={Eye} title="Review Status">
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { title: "Chemical Bonding",        by: "Kwame A.", ago: "30 min", priority: "high"   },
                  { title: "Algebra Fundamentals",    by: "Nadia O.", ago: "2 hrs",  priority: "normal" },
                  { title: "The French Revolution",   by: "James T.", ago: "1 day",  priority: "normal" },
                  { title: "Essay Writing Style",     by: "Sara M.",  ago: "2 days", priority: "low"    },
                ].map((r, i) => {
                  const priorColor = r.priority === "high" ? "#FF6B00" : r.priority === "normal" ? "#F59E0B" : "var(--app-border)";
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        padding: "8px 10px",
                        borderRadius: 8,
                        background: "var(--app-card)",
                        border: "1px solid var(--app-border)",
                        cursor: "pointer",
                        transition: "border-color 0.12s",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--app-border)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--app-border)")}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: priorColor, flexShrink: 0, marginTop: 4 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "12px", fontWeight: 530, color: "var(--app-text-primary)", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.title}
                        </p>
                        <p style={{ fontSize: "10.5px", color: "var(--app-text-secondary)", marginTop: 1 }}>
                          {r.by} · {r.ago}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </PanelSection>

            {/* ── Learning Objectives ── */}
            <PanelSection icon={ListChecks} title="Learning Objectives" defaultOpen={false}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: "12px", color: "var(--app-text-secondary)" }}>Objectives coverage</span>
                  <span style={{ fontSize: "12px", fontWeight: 660, color: "var(--app-text-primary)" }}>73%</span>
                </div>
                <div style={{ height: 5, borderRadius: 9999, background: "var(--app-border)", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "73%" }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    style={{ height: "100%", borderRadius: 9999, background: "#16A34A" }}
                  />
                </div>
              </div>
              <p style={{ fontSize: "11.5px", color: "var(--app-text-secondary)", lineHeight: 1.55 }}>
                40 of 55 published lessons include measurable learning objectives. 15 lessons need attention.
              </p>
              <button
                style={{
                  marginTop: 8,
                  width: "100%",
                  padding: "7px",
                  borderRadius: 7,
                  border: "1px dashed var(--app-border)",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "var(--app-text-secondary)",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-brand)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--app-border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--app-text-secondary)";
                }}
              >
                Fix 15 lessons →
              </button>
            </PanelSection>

            {/* ── Version History ── */}
            <PanelSection icon={History} title="Version History" defaultOpen={false}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {VERSION_HISTORY.map((v, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: i === 0 ? "var(--color-brand)" : "var(--app-border)", marginTop: 3 }} />
                      {i < VERSION_HISTORY.length - 1 && <div style={{ width: 1, height: 22, background: "var(--app-border)", marginTop: 3 }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: i < VERSION_HISTORY.length - 1 ? 8 : 0 }}>
                      <p style={{ fontSize: "12px", fontWeight: 530, color: "var(--app-text-primary)", letterSpacing: "-0.01em" }}>{v.title}</p>
                      <p style={{ fontSize: "10.5px", color: "var(--app-text-secondary)", marginTop: 1 }}>{v.author} · {v.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PanelSection>

            {/* ── Linked Questions ── */}
            <PanelSection icon={Link2} title="Linked Questions" defaultOpen={false}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "Total questions",    value: "1,247" },
                  { label: "Avg per lesson",     value: "8.4"   },
                  { label: "Without questions",  value: "12 lessons" },
                  { label: "AI-generated",       value: "34%"   },
                ].map((stat) => (
                  <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "var(--app-text-secondary)" }}>{stat.label}</span>
                    <span style={{ fontSize: "12.5px", fontWeight: 660, color: "var(--app-text-primary)", letterSpacing: "-0.02em" }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </PanelSection>

            {/* ── Common Misconceptions ── */}
            <PanelSection icon={Brain} title="Misconceptions" defaultOpen={false}>
              <p style={{ fontSize: "11px", color: "var(--app-text-secondary)", marginBottom: 8, lineHeight: 1.4 }}>
                AI detected <strong style={{ color: "var(--app-text-primary)", fontWeight: 640 }}>12 potential misconceptions</strong> across draft content.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {MISCONCEPTIONS.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                    <AlertCircle size={11} style={{ color: "#F59E0B", flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: "11.5px", color: "var(--app-text-secondary)", lineHeight: 1.5, letterSpacing: "-0.005em" }}>{m}</p>
                  </div>
                ))}
              </div>
            </PanelSection>

            {/* ── Difficulty Distribution ── */}
            <PanelSection icon={Gauge} title="Estimated Difficulty" defaultOpen={false}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Beginner",      pct: 24, color: "#16A34A" },
                  { label: "Intermediate",  pct: 48, color: "#F59E0B" },
                  { label: "Advanced",      pct: 28, color: "#DC2626" },
                ].map((d) => (
                  <div key={d.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: "11.5px", color: "var(--app-text-secondary)" }}>{d.label}</span>
                      <span style={{ fontSize: "11.5px", fontWeight: 650, color: "var(--app-text-primary)" }}>{d.pct}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 9999, background: "var(--app-border)", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${d.pct}%` }}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                        style={{ height: "100%", borderRadius: 9999, background: d.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </PanelSection>

            {/* ── Lesson Metadata ── */}
            <PanelSection icon={FileText} title="Lesson Metadata" defaultOpen={false}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "Avg reading time",  value: "8.2 min" },
                  { label: "Avg lesson length", value: "1,240 words" },
                  { label: "With media",        value: "78%" },
                  { label: "With diagrams",     value: "42%" },
                ].map((stat) => (
                  <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "var(--app-text-secondary)" }}>{stat.label}</span>
                    <span style={{ fontSize: "12.5px", fontWeight: 660, color: "var(--app-text-primary)", letterSpacing: "-0.02em" }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </PanelSection>

          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

/* ─── Dashboard Layout Shell ───────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen,   setCmdOpen]   = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  // If on curriculum or lessons builder, hide global context panel and lock toggle
  const isSpecialWorkspace = pathname === "/curriculum" || pathname.startsWith("/lessons");
  const showGlobalPanel = !isSpecialWorkspace;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen((p) => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--app-bg)" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", position: "relative", zIndex: 1 }}>
        <TopBar
          onCommand={() => setCmdOpen(true)}
          sidebarCollapsed={collapsed}
          onSidebarToggle={() => setCollapsed(false)}
          panelOpen={panelOpen}
          onPanelToggle={() => setPanelOpen((p) => !p)}
          panelLocked={isSpecialWorkspace}
        />
        <main style={{ flex: 1, padding: showGlobalPanel ? "36px 32px" : "0", overflowY: "auto", minHeight: 0 }}>
          {children}
        </main>
      </div>

      {showGlobalPanel && <ContextPanel open={panelOpen} />}

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
