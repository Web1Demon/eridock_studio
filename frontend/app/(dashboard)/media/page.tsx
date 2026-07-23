"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Upload, Sparkles, Folder, Image as ImageIcon,
  Video, Music, FileText, Box, Grid, List, Clock, BarChart2,
  Tag, Download, Trash2, Maximize2, MoreVertical, X, Share2,
  Wand2, LayoutGrid, Layers, Hexagon, Fingerprint, Eye, Zap,
  Activity, ArrowRight, Focus, MousePointer2, ChevronRight,
  Filter, PlayCircle, Heart, Brain, AlertCircle, AlertTriangle,
  User as UserIcon, CheckCircle2
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   TYPES & MOCK DATA
═══════════════════════════════════════════════════════════════════ */
type AssetType = "image" | "video" | "audio" | "document" | "3d";
type HeatLevel = "cold" | "warm" | "hot";

interface MediaAsset {
  id: string;
  title: string;
  type: AssetType;
  url: string; 
  thumbnailGradient: string;
  tags: string[];
  subject: string;
  aiDescription: string;
  usageCount: number;
  heat: HeatLevel;
  size: string;
  dimensions?: string;
  createdAt: string;
  aspectRatio: "square" | "wide" | "tall";
  uploadedBy: { name: string; avatar?: string };
}

const MOCK_ASSETS: MediaAsset[] = [
  {
    id: "m1", title: "Plant Cell Mitosis Diagram", type: "image", url: "https://images.unsplash.com/photo-1530213786676-415b6824fa06?auto=format&fit=crop&q=80&w=800", thumbnailGradient: "linear-gradient(135deg, #10B981, #059669)",
    tags: ["Cells", "Mitosis", "AI Generated"], subject: "Biology",
    aiDescription: "Detailed cross-section of a plant cell undergoing mitosis, highlighting spindle fibers and chromatids.",
    usageCount: 42, heat: "hot", size: "4.2 MB", dimensions: "2400x1800", createdAt: "2h ago", aspectRatio: "wide",
    uploadedBy: { name: "Dr. Sarah Okoye" }
  },
  {
    id: "m2", title: "Quadratic Formula Visualization", type: "image", url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800", thumbnailGradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
    tags: ["Algebra", "Formulas"], subject: "Mathematics",
    aiDescription: "Interactive graph showing the roots of a quadratic equation as the parabola intersects the x-axis.",
    usageCount: 15, heat: "warm", size: "1.1 MB", dimensions: "1080x1080", createdAt: "1d ago", aspectRatio: "square",
    uploadedBy: { name: "Mr. Kunle Adebayo" }
  },
  {
    id: "m3", title: "Atomic Structure (Bohr Model)", type: "3d", url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800", thumbnailGradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
    tags: ["Atoms", "Interactive"], subject: "Chemistry",
    aiDescription: "Interactive 3D model of a Carbon atom showing protons, neutrons, and orbiting electrons.",
    usageCount: 89, heat: "hot", size: "12.5 MB", createdAt: "3d ago", aspectRatio: "square",
    uploadedBy: { name: "Dr. Sarah Okoye" }
  },
  {
    id: "m4", title: "Pendulum Motion Physics", type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnailGradient: "linear-gradient(135deg, #F59E0B, #D97706)",
    tags: ["Mechanics", "Animation"], subject: "Physics",
    aiDescription: "Slow-motion animation demonstrating kinetic and potential energy exchange in a pendulum.",
    usageCount: 5, heat: "cold", size: "24.8 MB", dimensions: "1920x1080", createdAt: "1w ago", aspectRatio: "wide",
    uploadedBy: { name: "Chidi Madu" }
  },
  {
    id: "m5", title: "Photosynthesis Process", type: "image", url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=600", thumbnailGradient: "linear-gradient(135deg, #22C55E, #15803D)",
    tags: ["Botany", "Diagram"], subject: "Biology",
    aiDescription: "Flowchart showing sunlight, CO2, and water converting into glucose and oxygen.",
    usageCount: 28, heat: "warm", size: "3.5 MB", dimensions: "1200x1600", createdAt: "2w ago", aspectRatio: "tall",
    uploadedBy: { name: "AI Generation" }
  },
  {
    id: "m6", title: "Roman Empire Expansion", type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnailGradient: "linear-gradient(135deg, #64748B, #475569)",
    tags: ["Rome", "Map"], subject: "History",
    aiDescription: "Animated map detailing the territorial expansion of the Roman Empire over 500 years.",
    usageCount: 112, heat: "hot", size: "45.1 MB", createdAt: "1m ago", aspectRatio: "wide",
    uploadedBy: { name: "Dr. Emmanuel" }
  },
  {
    id: "m7", title: "Corrupted File Sample", type: "document", url: "invalid-url", thumbnailGradient: "linear-gradient(135deg, #475569, #334155)",
    tags: ["Notes"], subject: "History",
    aiDescription: "A document that failed to load correctly.",
    usageCount: 2, heat: "cold", size: "0 KB", dimensions: "-", createdAt: "2m ago", aspectRatio: "square",
    uploadedBy: { name: "Mr. Kunle Adebayo" }
  }
];

const SMART_COLLECTIONS = [
  { id: "c1", name: "High Engagement (Hot)", icon: Activity, color: "#FF6B00" },
  { id: "c2", name: "AI Generated", icon: Sparkles, color: "#9333EA" },
  { id: "c3", name: "Recently Used", icon: Clock, color: "#2563EB" },
  { id: "c4", name: "Needs Review", icon: AlertCircle, color: "#DC2626" },
];

const FILE_TYPES = [
  { id: "image", name: "Images", icon: ImageIcon },
  { id: "video", name: "Videos", icon: Video },
  { id: "audio", name: "Audio", icon: Music },
  { id: "document", name: "Documents", icon: FileText },
  { id: "3d", name: "3D Models", icon: Box },
];

/* ═══════════════════════════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════════════════════════ */

function AssetCard({ asset, onClick, isSelected, viewMode }: { asset: MediaAsset; onClick: () => void; isSelected: boolean; viewMode: "gallery" | "list" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (viewMode === "list") {
    return (
      <motion.div
        layoutId={`asset-${asset.id}`}
        style={{
          display: "flex", alignItems: "center", gap: 16, padding: "12px 16px",
          background: isSelected ? "var(--color-surface-raised)" : "#FFF", 
          borderRadius: 12, border: isSelected ? "1px solid rgba(255,107,0,0.3)" : "1px solid var(--app-border-glow)",
          boxShadow: isSelected ? "0 4px 12px rgba(255,107,0,0.1)" : "0 2px 4px var(--app-border-glow)",
          cursor: "pointer", transition: "all 0.2s"
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ width: 48, height: 48, borderRadius: 8, background: asset.thumbnailGradient, flexShrink: 0, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {!hasError && asset.type !== "document" ? (
             <img src={asset.url} onError={() => setHasError(true)} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} alt={asset.title} />
          ) : (
             <FileText size={20} color="rgba(255,255,255,0.7)" />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px", color: "var(--app-text-primary)" }}>{asset.title}</h4>
          <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", margin: 0, textTransform: "capitalize" }}>{asset.type} • Uploaded by {asset.uploadedBy.name}</p>
        </div>
        <div style={{ fontSize: "12px", color: "var(--app-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
          <Activity size={14} color={asset.heat==="hot" ? "#FF6B00" : "inherit"} /> {asset.usageCount} views
        </div>
      </motion.div>
    );
  }

  // Gallery View
  const aspectStyle = 
    asset.aspectRatio === "wide" ? { gridColumn: "span 2", gridRow: "span 1" } :
    asset.aspectRatio === "tall" ? { gridColumn: "span 1", gridRow: "span 2" } :
    { gridColumn: "span 1", gridRow: "span 1" };

  return (
    <motion.div
      layoutId={`asset-${asset.id}`}
      style={{
        ...aspectStyle,
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        background: asset.thumbnailGradient,
        minHeight: "180px",
        boxShadow: isSelected 
          ? "0 0 0 4px rgba(255,107,0,0.3), 0 12px 32px rgba(0,0,0,0.15)"
          : isHovered 
            ? "0 12px 24px rgba(0,0,0,0.15)" 
            : "0 4px 12px rgba(0,0,0,0.05)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isHovered && !isSelected ? "translateY(-4px)" : "translateY(0)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background Media */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isHovered ? "scale(1.08)" : "scale(1)",
      }}>
        {!hasError && asset.type !== "document" ? (
          <img src={asset.url} onError={() => setHasError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={asset.title} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.7)" }}>
             <FileText size={32} />
             <span style={{ fontSize: "12px", fontWeight: 600 }}>Preview Unavailable</span>
          </div>
        )}
      </div>

      {/* Heat Signature Glow */}
      {asset.heat === "hot" && (
        <div style={{
          position: "absolute", inset: 0, 
          background: "radial-gradient(circle at 50% 100%, rgba(255,107,0,0.6) 0%, transparent 60%)",
          opacity: isHovered ? 0.9 : 0.4,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
          zIndex: 1
        }} />
      )}

      {/* Dark Overlay for Text */}
      <div style={{
        position: "absolute", inset: 0,
        background: isHovered 
          ? "linear-gradient(to top, var(--app-text-primary) 0%, var(--app-border) 50%, var(--app-text-secondary) 100%)"
          : "linear-gradient(to top, var(--app-text-primary) 0%, var(--app-border-glow) 40%)",
        transition: "background 0.3s ease",
        zIndex: 2
      }} />

      {/* Top Bar Indicators */}
      <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 3 }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <span style={{ 
            background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)",
            padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, color: "var(--app-card)",
            display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            {asset.type === "image" ? <ImageIcon size={10}/> : asset.type === "video" ? <Video size={10}/> : asset.type === "document" ? <FileText size={10}/> : <Box size={10}/>}
            {asset.type.toUpperCase()}
          </span>
          {asset.tags.includes("AI Generated") && (
            <span style={{ 
              background: "rgba(147,51,234,0.9)", padding: "4px 8px", borderRadius: "6px", 
              fontSize: "10px", fontWeight: 700, color: "var(--app-card)", display: "flex", alignItems: "center", gap: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}>
              <Sparkles size={10}/> AI
            </span>
          )}
        </div>
        <AnimatePresence>
          {isHovered && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              style={{ background: "rgba(255,255,255,0.25)", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--app-card)", cursor: "pointer", backdropFilter: "blur(8px)" }}
            >
              <MoreVertical size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Play Icon for Videos */}
      {asset.type === "video" && isHovered && (
         <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            position: "absolute", top: "50%", left: "50%", x: "-50%", y: "-50%",
            width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", zIndex: 3
          }}
        >
          <PlayCircle size={28} fill="rgba(255,255,255,0.9)" color="rgba(20,18,16,0.9)" />
        </motion.div>
      )}

      {/* Bottom Info */}
      <motion.div 
        animate={{ y: isHovered ? 0 : 4 }}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px", zIndex: 3 }}
      >
        <p style={{ color: "var(--app-card)", fontSize: "14px", fontWeight: 700, marginBottom: "6px", textShadow: "0 1px 2px rgba(0,0,0,0.5)", lineHeight: 1.3 }}>
          {asset.title}
        </p>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: asset.heat === "hot" ? "#FF6B00" : "#10B981" }} />
            {asset.subject}
          </span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
            <Activity size={12} /> {asset.usageCount}
          </span>
        </div>
        
        {/* Collaborator */}
        <AnimatePresence>
          {isHovered && (
            <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 8 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} style={{ overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: "11px", fontWeight: 500 }}>
                <UserIcon size={12} /> Uploaded by {asset.uploadedBy.name}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
export default function MediaLibraryPage() {
  const [activeView, setActiveView] = useState<"gallery" | "list">("gallery");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [expandFullscreen, setExpandFullscreen] = useState(false);

  const filteredAssets = MOCK_ASSETS.filter(a => {
    if (activeFilter !== "all" && a.type !== activeFilter && !SMART_COLLECTIONS.find(c => c.id === activeFilter)) {
        if (activeFilter === "c1" && a.heat !== "hot") return false;
        if (activeFilter === "c2" && !a.tags.includes("AI Generated")) return false;
        if (['image', 'video', 'audio', 'document', '3d'].includes(activeFilter) && a.type !== activeFilter) return false;
    }
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  // Group assets by Subject
  const subjects = Array.from(new Set(filteredAssets.map(a => a.subject)));

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "var(--app-bg)", overflow: "hidden", fontFamily: "var(--font-sans)" }}>
      
      {/* ─── LEFT SIDEBAR ─── */}
      <div style={{ width: "260px", borderRight: "1px solid var(--app-border)", backgroundColor: "var(--app-bg)", display: "flex", flexDirection: "column", zIndex: 10 }}>
        
        {/* Upload Button Area */}
        <div style={{ padding: "24px 20px 16px" }}>
           <button style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "12px 0", borderRadius: 12, background: "var(--color-brand)", color: "#FFF",
            fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer",
            boxShadow: "0 8px 20px rgba(255,107,0,0.25)", transition: "transform 0.15s, box-shadow 0.15s"
          }}
          onClick={() => setIsUploading(true)}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(255,107,0,0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(255,107,0,0.25)"; }}
          >
            <Upload size={18} /> Upload Media
          </button>
        </div>

        <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
          {/* Smart Collections */}
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontSize: "11px", fontWeight: 800, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", paddingLeft: "8px" }}>Smart Collections</p>
            {SMART_COLLECTIONS.map(c => (
              <button 
                key={c.id} 
                onClick={() => setActiveFilter(c.id)}
                style={{ 
                  width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", 
                  borderRadius: "10px", border: "none", background: activeFilter === c.id ? "var(--app-card)" : "transparent",
                  boxShadow: activeFilter === c.id ? "var(--shadow-xs)" : "none",
                  cursor: "pointer", textAlign: "left", transition: "all 0.2s"
                }}
              >
                <c.icon size={16} color={activeFilter === c.id ? c.color : "var(--app-text-secondary)"} />
                <span style={{ fontSize: "13px", fontWeight: activeFilter === c.id ? 650 : 500, color: activeFilter === c.id ? "var(--app-text-primary)" : "var(--app-text-secondary)" }}>{c.name}</span>
              </button>
            ))}
          </div>

          {/* File Types */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "11px", fontWeight: 800, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", paddingLeft: "8px" }}>File Types</p>
            <button 
                onClick={() => setActiveFilter("all")}
                style={{ 
                  width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", 
                  borderRadius: "10px", border: "none", background: activeFilter === "all" ? "var(--app-card)" : "transparent",
                  boxShadow: activeFilter === "all" ? "var(--shadow-xs)" : "none",
                  cursor: "pointer", textAlign: "left", transition: "all 0.2s"
                }}
              >
                <Grid size={16} color={activeFilter === "all" ? "var(--color-brand)" : "var(--app-text-secondary)"} />
                <span style={{ fontSize: "13px", fontWeight: activeFilter === "all" ? 650 : 500, color: activeFilter === "all" ? "var(--app-text-primary)" : "var(--app-text-secondary)" }}>All Media</span>
            </button>
            {FILE_TYPES.map(f => (
              <button 
                key={f.id} 
                onClick={() => setActiveFilter(f.id)}
                style={{ 
                  width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", 
                  borderRadius: "10px", border: "none", background: activeFilter === f.id ? "var(--app-card)" : "transparent",
                  boxShadow: activeFilter === f.id ? "var(--shadow-xs)" : "none",
                  cursor: "pointer", textAlign: "left", transition: "all 0.2s"
                }}
              >
                <f.icon size={16} color={activeFilter === f.id ? "#2563EB" : "var(--app-text-secondary)"} />
                <span style={{ fontSize: "13px", fontWeight: activeFilter === f.id ? 650 : 500, color: activeFilter === f.id ? "var(--app-text-primary)" : "var(--app-text-secondary)" }}>{f.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Storage Bar */}
        <div style={{ padding: "24px 20px", borderTop: "1px solid var(--app-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "12px", fontWeight: 650, color: "var(--app-text-secondary)" }}>Storage</span>
            <span style={{ fontSize: "12px", fontWeight: 750, color: "var(--app-text-primary)" }}>64%</span>
          </div>
          <div style={{ height: "6px", background: "var(--app-border-glow)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "64%", background: "var(--color-brand)", borderRadius: "4px" }} />
          </div>
          <p style={{ fontSize: "11px", color: "var(--app-text-secondary)", marginTop: "10px", fontWeight: 500 }}>32GB of 50GB used</p>
        </div>
      </div>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        
        {/* Top Toolbar */}
        <div style={{ height: "80px", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--app-border)", background: "rgba(252,252,251,0.85)", backdropFilter: "blur(20px)", zIndex: 10 }}>
          
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", background: "var(--app-card)", border: "1px solid var(--app-border)", borderRadius: "12px", padding: "0 16px", width: "380px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", transition: "box-shadow 0.2s" }}>
            <Search size={18} color="var(--app-text-secondary)" />
            <input 
              type="text" 
              placeholder="Search visual memory, tags, or concepts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: "none", background: "transparent", padding: "12px 14px", fontSize: "14px", width: "100%", outline: "none", color: "var(--app-text-primary)", fontWeight: 500 }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            
            {/* View Toggles */}
            <div style={{ display: "flex", background: "var(--app-border-glow)", borderRadius: "10px", padding: "4px" }}>
              <button onClick={() => setActiveView("gallery")} style={{ border: "none", background: activeView === "gallery" ? "var(--app-card)" : "transparent", padding: "8px 10px", borderRadius: "8px", cursor: "pointer", boxShadow: activeView === "gallery" ? "var(--shadow-sm)" : "none", color: activeView === "gallery" ? "var(--app-text-primary)" : "var(--app-text-secondary)", transition: "all 0.2s" }}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setActiveView("list")} style={{ border: "none", background: activeView === "list" ? "var(--app-card)" : "transparent", padding: "8px 10px", borderRadius: "8px", cursor: "pointer", boxShadow: activeView === "list" ? "var(--shadow-sm)" : "none", color: activeView === "list" ? "var(--app-text-primary)" : "var(--app-text-secondary)", transition: "all 0.2s" }}>
                <List size={16} />
              </button>
            </div>

            <button 
              onClick={() => setIsGenerating(true)}
              style={{ display: "flex", alignItems: "center", gap: "10px", background: "linear-gradient(135deg, rgba(147,51,234,0.1), rgba(192,132,252,0.1))", border: "1px solid rgba(147,51,234,0.2)", color: "#9333EA", padding: "10px 20px", borderRadius: "12px", fontSize: "14px", fontWeight: 750, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(147,51,234,0.1)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(147,51,234,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(147,51,234,0.1)"; }}
            >
              <Wand2 size={16} /> Generate AI Asset
            </button>
          </div>
        </div>

        {/* Grid Area */}
        <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
          
          {filteredAssets.length === 0 ? (
             <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--app-text-secondary)" }}>
               <div style={{ width: 80, height: 80, borderRadius: 24, background: "var(--app-border-glow)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                 <Folder size={40} style={{ opacity: 0.3 }} />
               </div>
               <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--app-text-primary)", marginBottom: 8 }}>Nothing Found</h3>
               <p style={{ fontSize: "15px", fontWeight: 500, maxWidth: 400, margin: "0 auto" }}>We couldn't find any assets matching your filters or search query.</p>
             </div>
          ) : (
             <>
               {subjects.map(subject => (
                 <div key={subject} style={{ marginBottom: 48 }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", borderBottom: "1px solid var(--app-border)", paddingBottom: "12px" }}>
                     <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--app-text-primary)", letterSpacing: "-0.01em" }}>{subject}</h2>
                     <span style={{ fontSize: "12px", fontWeight: 700, background: "var(--app-border-glow)", padding: "4px 8px", borderRadius: 8, color: "var(--app-text-secondary)" }}>
                       {filteredAssets.filter(a => a.subject === subject).length} assets
                     </span>
                   </div>
                   
                   <div style={{ 
                      display: activeView === "list" ? "flex" : "grid", 
                      flexDirection: activeView === "list" ? "column" : "row",
                      gridTemplateColumns: activeView === "gallery" ? "repeat(auto-fill, minmax(260px, 1fr))" : undefined, 
                      gridAutoRows: activeView === "gallery" ? "220px" : undefined,
                      gap: activeView === "list" ? "8px" : "24px" 
                    }}>
                      {filteredAssets.filter(a => a.subject === subject).map(asset => (
                        <AssetCard key={asset.id} asset={asset} onClick={() => setSelectedAsset(asset)} isSelected={selectedAsset?.id === asset.id} viewMode={activeView} />
                      ))}
                   </div>
                 </div>
               ))}
             </>
          )}
        </div>

      </div>

      {/* ─── RIGHT DETAIL PANEL (LIGHTBOX/INSPECTOR) ─── */}
      <AnimatePresence>
        {selectedAsset && (
          <motion.div
            initial={{ width: 0, opacity: 0, borderLeftColor: "transparent" }}
            animate={{ width: 420, opacity: 1, borderLeftColor: "var(--app-border)" }}
            exit={{ width: 0, opacity: 0 }}
            style={{ 
              background: "var(--app-card)", borderLeft: "1px solid", display: "flex", flexDirection: "column", zIndex: 20,
              boxShadow: "var(--shadow-panel)"
            }}
          >
            {/* Panel Header */}
            <div style={{ padding: "24px", borderBottom: "1px solid var(--app-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <h3 style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.01em" }}>Asset Inspector</h3>
               <button onClick={() => setSelectedAsset(null)} style={{ background: "var(--app-border-glow)", border: "none", cursor: "pointer", color: "var(--app-text-secondary)", width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--app-border-glow)"} onMouseLeave={e => e.currentTarget.style.background = "var(--app-border-glow)"}>
                 <X size={18}/>
               </button>
            </div>
            
            {/* Panel Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              
              {/* Preview Block - Dynamic based on type */}
              <div style={{ 
                width: "100%", height: "240px", borderRadius: "16px", 
                backgroundColor: "var(--app-text-primary)", backgroundImage: selectedAsset.type === "image" ? `url(${selectedAsset.url})` : "none", 
                backgroundSize: "cover", backgroundPosition: "center",
                marginBottom: "24px", position: "relative", boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
              }}>
                 {selectedAsset.type === "video" ? (
                   <video src={selectedAsset.url} controls style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                 ) : selectedAsset.type === "document" ? (
                   <div style={{ color: "rgba(255,255,255,0.7)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                     <FileText size={48} />
                     <span style={{ fontSize: "13px", fontWeight: 600 }}>Document Preview</span>
                   </div>
                 ) : null}

                 <button onClick={() => setExpandFullscreen(true)} style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(20,18,16,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "8px", color: "var(--app-card)", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(20,18,16,0.8)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(20,18,16,0.5)"}>
                   <Maximize2 size={16} />
                 </button>
              </div>

              <h2 style={{ fontSize: "22px", fontWeight: 800, lineHeight: 1.3, marginBottom: "12px", color: "var(--app-text-primary)" }}>{selectedAsset.title}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", color: "var(--app-text-secondary)", fontWeight: 500, marginBottom: "24px" }}>
                 <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-brand)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--app-card)", fontSize: "10px", fontWeight: 700 }}>
                   {selectedAsset.uploadedBy.name.charAt(0)}
                 </div>
                 Uploaded by <strong>{selectedAsset.uploadedBy.name}</strong>
              </div>
              
              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
                <span style={{ padding: "6px 12px", borderRadius: "20px", background: "var(--app-border-glow)", fontSize: "12px", fontWeight: 700, color: "var(--app-text-secondary)", border: "1px solid var(--app-border)" }}>{selectedAsset.subject}</span>
                {selectedAsset.tags.map(tag => (
                   <span key={tag} style={{ padding: "6px 12px", borderRadius: "20px", background: tag==="AI Generated" ? "rgba(147,51,234,0.1)" : "var(--app-border-glow)", fontSize: "12px", fontWeight: 700, color: tag==="AI Generated" ? "#9333EA" : "var(--app-text-secondary)", border: tag==="AI Generated" ? "1px solid rgba(147,51,234,0.2)" : "1px solid var(--app-border-glow)" }}>
                     {tag}
                   </span>
                ))}
              </div>

              {/* AI Scene Reader Output */}
              <div style={{ background: "rgba(37,99,235,0.03)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: "16px", padding: "20px", marginBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#2563EB" }}>
                  <Brain size={18} />
                  <span style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Scene Analysis</span>
                </div>
                <p style={{ fontSize: "14px", color: "var(--app-text-primary)", lineHeight: 1.6, fontWeight: 500 }}>
                  {selectedAsset.aiDescription}
                </p>
              </div>

              {/* Metadata Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px", padding: "0 4px" }}>
                <div>
                  <span style={{ display: "block", fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Format</span>
                  <span style={{ fontSize: "15px", fontWeight: 650, textTransform: "capitalize", color: "var(--app-text-primary)" }}>{selectedAsset.type}</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Size & Dim</span>
                  <span style={{ fontSize: "15px", fontWeight: 650, color: "var(--app-text-primary)" }}>{selectedAsset.size} {selectedAsset.dimensions ? `(${selectedAsset.dimensions})` : ""}</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Added</span>
                  <span style={{ fontSize: "15px", fontWeight: 650, color: "var(--app-text-primary)" }}>{selectedAsset.createdAt}</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Curriculum Heat</span>
                  <span style={{ fontSize: "15px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", color: selectedAsset.heat==="hot" ? "#FF6B00" : selectedAsset.heat==="warm" ? "#F59E0B" : "#64748B" }}>
                    <Activity size={16} />
                    {selectedAsset.usageCount} Lessons
                  </span>
                </div>
              </div>

              {/* Concept Map Links */}
              <div style={{ borderTop: "1px solid var(--app-border)", paddingTop: "28px" }}>
                 <p style={{ fontSize: "14px", fontWeight: 800, marginBottom: "16px", color: "var(--app-text-primary)" }}>Linked Curriculum</p>
                 <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "var(--color-surface-raised)", borderRadius: "12px", border: "1px solid var(--app-border)", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => {e.currentTarget.style.background="var(--app-card)"; e.currentTarget.style.boxShadow="var(--shadow-sm)"}} onMouseLeave={e => {e.currentTarget.style.background="var(--color-surface-raised)"; e.currentTarget.style.boxShadow="none"}}>
                   <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--app-border-glow)", display: "flex", alignItems: "center", justifyContent: "center" }}><Layers size={18} color="var(--app-text-secondary)"/></div>
                   <div style={{ flex: 1 }}>
                     <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--app-text-primary)" }}>{selectedAsset.subject} Masterclass</p>
                     <p style={{ fontSize: "12px", color: "var(--app-text-secondary)", fontWeight: 500, marginTop: "2px" }}>Used in Slide 4 & Question Bank</p>
                   </div>
                   <ChevronRight size={18} color="var(--app-border)" />
                 </div>
              </div>
            </div>

            {/* Panel Actions */}
            <div style={{ padding: "24px", borderTop: "1px solid var(--app-border)", display: "flex", gap: "12px" }}>
               <button style={{ flex: 1, padding: "14px", background: "var(--app-text-primary)", color: "var(--app-card)", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 750, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", boxShadow: "0 8px 20px rgba(0,0,0,0.15)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#2d2926"} onMouseLeave={e => e.currentTarget.style.background = "var(--app-text-primary)"}>
                 <Share2 size={16}/> Copy Link
               </button>
               <button style={{ padding: "14px", background: "#FEF2F2", color: "#DC2626", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "12px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="#FEE2E2"} onMouseLeave={e => e.currentTarget.style.background="#FEF2F2"}>
                 <Trash2 size={18}/>
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FULLSCREEN ASSET VIEWER ─── */}
      <AnimatePresence>
        {expandFullscreen && selectedAsset && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyItems: "center" }}
          >
            <button onClick={() => setExpandFullscreen(false)} style={{ position: "absolute", top: 32, right: 32, width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.1)", color: "var(--app-card)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={24} /></button>
            
            <div style={{ width: "80%", height: "80%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {selectedAsset.type === "video" ? (
                 <video src={selectedAsset.url} controls autoPlay style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 16, boxShadow: "0 32px 64px rgba(0,0,0,0.5)" }} />
              ) : selectedAsset.type === "image" ? (
                 <img src={selectedAsset.url} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 16, boxShadow: "0 32px 64px rgba(0,0,0,0.5)" }} alt="Expanded view" />
              ) : (
                 <div style={{ color: "var(--app-card)", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                    <FileText size={80} />
                    <h2>Preview not supported in fullscreen</h2>
                 </div>
              )}
            </div>
            
            <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", padding: "12px 24px", borderRadius: 100, color: "var(--app-card)", fontSize: "14px", fontWeight: 600 }}>
              {selectedAsset.title}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── AI GENERATE MODAL ─── */}
      <AnimatePresence>
        {isGenerating && (
            <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,18,16,0.6)", backdropFilter: "blur(8px)", padding: 20 }} onClick={() => setIsGenerating(false)}>
              <motion.div initial={{opacity:0, scale:0.95, y: 16}} animate={{opacity:1, scale:1, y: 0}} exit={{opacity:0, scale:0.95, y: 16}} transition={{ type: "spring", stiffness: 350, damping: 28 }} onClick={(e) => e.stopPropagation()} style={{ background: "var(--app-card)", borderRadius: "32px", width: "100%", maxWidth: "680px", padding: "48px", boxShadow: "0 32px 64px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
               
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "80px" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                   <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "linear-gradient(135deg, #F3E8FF, #E9D5FF)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(147,51,234,0.2)", boxShadow: "inset 0 2px 4px #FFF" }}><Wand2 size={32} color="#9333EA"/></div>
                   <div>
                     <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--app-text-primary)", letterSpacing: "-0.01em" }}>Generate with AI</h2>
                     <p style={{ fontSize: "15px", color: "var(--app-text-secondary)", fontWeight: 500, marginTop: "6px" }}>Create custom diagrams, illustrations, or 3D models instantly.</p>
                   </div>
                 </div>
                 <button onClick={() => setIsGenerating(false)} style={{ background: "var(--app-border-glow)", border: "none", cursor: "pointer", width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--app-text-secondary)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--app-border-glow)"} onMouseLeave={e => e.currentTarget.style.background = "var(--app-border-glow)"}><X size={20}/></button>
               </div>

               <div style={{ position: "relative", marginBottom: "32px" }}>
                 <textarea 
                   placeholder="Describe the educational visual you need... e.g., 'A cross-section of a volcano showing magma chambers, labeled for middle school geology.'"
                   style={{ width: "100%", height: "160px", padding: "24px", borderRadius: "20px", border: "2px solid rgba(147,51,234,0.3)", background: "rgba(147,51,234,0.02)", fontSize: "16px", resize: "none", outline: "none", fontFamily: "inherit", color: "var(--app-text-primary)", fontWeight: 500, lineHeight: 1.6, boxShadow: "inset 0 4px 8px rgba(0,0,0,0.02)", transition: "border 0.2s" }}
                   onFocus={e => e.currentTarget.style.border = "2px solid rgba(147,51,234,0.8)"}
                   onBlur={e => e.currentTarget.style.border = "2px solid rgba(147,51,234,0.3)"}
                 />
                 <div style={{ position: "absolute", bottom: 20, right: 20, display: "flex", alignItems: "center", gap: 6, color: "var(--app-text-secondary)" }}>
                   <span style={{ fontSize: "13px", fontWeight: 600 }}>Shift + Enter to generate</span>
                 </div>
               </div>

               <div style={{ marginBottom: "40px" }}>
                 <p style={{ fontSize: "13px", fontWeight: 800, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Visual Style</p>
                 <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                   {["Educational Diagram", "3D Render", "Realistic Photo", "Minimalist Icon", "Chalkboard Sketch"].map((style, i) => (
                      <button key={style} style={{ padding: "12px 20px", borderRadius: "14px", border: i===0 ? "2px solid #9333EA" : "1px solid var(--app-border)", background: i===0 ? "rgba(147,51,234,0.05)" : "transparent", fontSize: "14px", fontWeight: 700, color: i===0 ? "#9333EA" : "var(--app-text-secondary)", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => {if(i!==0) e.currentTarget.style.background="var(--app-border-glow)"}} onMouseLeave={e => {if(i!==0) e.currentTarget.style.background="transparent"}}>{style}</button>
                   ))}
                 </div>
               </div>

               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                
                 <div style={{ display: "flex", gap: "16px" }}>
                   <button onClick={() => setIsGenerating(false)} style={{ padding: "16px 28px", borderRadius: "14px", border: "none", background: "transparent", fontSize: "15px", fontWeight: 750, color: "var(--app-text-secondary)", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e=>e.currentTarget.style.color="var(--app-text-primary)"} onMouseLeave={e=>e.currentTarget.style.color="var(--app-text-secondary)"}>Cancel</button>
                   <button style={{ padding: "16px 32px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #9333EA, #7E22CE)", color: "var(--app-card)", fontSize: "15px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 12px 24px rgba(147,51,234,0.3)", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={e => {e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 16px 32px rgba(147,51,234,0.4)"}} onMouseLeave={e => {e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 12px 24px rgba(147,51,234,0.3)"}}>
                     <Wand2 size={18} fill="var(--app-card)"/> Generate Now
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* ─── UPLOAD MODAL ─── */}
      <AnimatePresence>
        {isUploading && (
           <>
             <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{ position: "fixed", inset: 0, background: "rgba(20,18,16,0.6)", backdropFilter: "blur(8px)", zIndex: 100 }} onClick={() => setIsUploading(false)} />
             <motion.div initial={{opacity:0, scale:0.95, y:"-40%", x:"-50%"}} animate={{opacity:1, scale:1, y:"-50%", x:"-50%"}} exit={{opacity:0, scale:0.95, y:"-40%", x:"-50%"}} style={{ position: "fixed", top: "50%", left: "50%", background: "var(--app-card)", borderRadius: "32px", width: "90%", maxWidth: "600px", padding: "48px", zIndex: 101, boxShadow: "0 32px 64px rgba(0,0,0,0.2)" }}>
               
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                   <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "linear-gradient(135deg, rgba(255,107,0,0.1), rgba(255,107,0,0.05))", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,107,0,0.2)" }}><Upload size={32} color="#FF6B00"/></div>
                   <div>
                     <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--app-text-primary)", letterSpacing: "-0.01em" }}>Upload Media</h2>
                     <p style={{ fontSize: "15px", color: "var(--app-text-secondary)", fontWeight: 500, marginTop: "6px" }}>Add files to your collaborative studio.</p>
                   </div>
                 </div>
                 <button onClick={() => setIsUploading(false)} style={{ background: "var(--app-border-glow)", border: "none", cursor: "pointer", width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--app-text-secondary)" }}><X size={20}/></button>
               </div>

               {/* Drop Zone */}
               <div style={{ width: "100%", height: "200px", border: "2px dashed var(--app-border)", borderRadius: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--app-border-glow)", marginBottom: "32px", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => {e.currentTarget.style.border="2px dashed #FF6B00"; e.currentTarget.style.background="rgba(255,107,0,0.02)"}} onMouseLeave={e => {e.currentTarget.style.border="2px dashed var(--app-border)"; e.currentTarget.style.background="var(--app-border-glow)"}}>
                 <Upload size={40} color="var(--app-border)" style={{ marginBottom: 16 }} />
                 <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--app-text-primary)", marginBottom: 8 }}>Drag & Drop files here</p>
                 <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--app-text-secondary)" }}>or click to browse your computer</p>
               </div>

               {/* File Type Warnings */}
               <div style={{ display: "flex", gap: "24px", padding: "20px", borderRadius: "16px", background: "var(--color-surface-raised)", border: "1px solid var(--app-border)" }}>
                 <div style={{ flex: 1 }}>
                   <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10B981", fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                     <CheckCircle2 size={16} /> Allowed
                   </div>
                   <ul style={{ margin: 0, paddingLeft: 20, fontSize: "14px", color: "var(--app-text-secondary)", fontWeight: 500, display: "flex", flexDirection: "column", gap: 6 }}>
                     <li>Images (JPG, PNG, SVG)</li>
                     <li>Videos (MP4, WebM) &lt; 100MB</li>
                     <li>Audio (MP3, WAV)</li>
                     <li>Documents (PDF)</li>
                   </ul>
                 </div>
                 <div style={{ width: "1px", background: "var(--app-border-glow)" }} />
                 <div style={{ flex: 1 }}>
                   <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#DC2626", fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                     <AlertTriangle size={16} /> Prohibited
                   </div>
                   <ul style={{ margin: 0, paddingLeft: 20, fontSize: "14px", color: "var(--app-text-secondary)", fontWeight: 500, display: "flex", flexDirection: "column", gap: 6 }}>
                     <li>Executables (.exe, .sh)</li>
                     <li>Archives (.zip, .rar)</li>
                     <li>Copyrighted material</li>
                     <li>Files &gt; 100MB</li>
                   </ul>
                 </div>
               </div>
             </motion.div>
           </>
        )}
      </AnimatePresence>

    </div>
  );
}

// Add CheckCircle2 to lucide imports at the top
