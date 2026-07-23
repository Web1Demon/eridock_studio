import os

path = r'c:\Users\USER\Desktop\studio\app\(dashboard)\curriculum\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I want to find the return statement of `CurriculumWorkspace` to inject a `KnowledgeMap` mode
# Find `const [mode, setMode]                   = useState<"overview" | "explorer" | "map">("explorer");`
# There is a `mode === "map"` conditional I should hook into.

# Let's define the Custom Knowledge Map component
knowledge_map_code = '''
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
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#FAFAFA", overflow: "hidden", backgroundImage: "radial-gradient(rgba(14,13,12,0.1) 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
      
      <div style={{ position: "absolute", top: 20, left: 20, background: "#fff", padding: "12px 16px", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid rgba(14,13,12,0.08)", zIndex: 10 }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#141210" }}>Curriculum Map</h3>
        <p style={{ fontSize: "12px", color: "rgba(14,13,12,0.5)", marginTop: 2 }}>Drag nodes to organize. Red nodes are AI suggestions.</p>
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
              stroke={isMissing ? "#DC2626" : "rgba(14,13,12,0.15)"}
              strokeWidth={isMissing ? 2 : 1.5}
              strokeDasharray={isMissing ? "4 4" : "none"}
            />
          );
        })}
      </svg>

      {nodes.map(n => {
        const Icon = getSmartIcon(n.title, n.type);
        const typeColors: any = { curriculum: "#141210", subject: "#2563EB", topic: "#7C3AED", concept: "#FF6B00", lesson: "#16A34A" };
        const color = typeColors[n.type] || "#141210";
        
        return (
          <motion.div
            key={n.id}
            drag
            dragMomentum={false}
            onDrag={(e, info) => handleDrag(n.id, info.delta.x, info.delta.y)}
            onDragStart={() => setDraggedNode(n.id)}
            onDragEnd={() => setDraggedNode(null)}
            style={{
              position: "absolute", x: n.x, y: n.y, width: 160, background: n.missing ? "rgba(220,38,38,0.05)" : "#fff",
              border: `1.5px solid ${n.missing ? "#DC2626" : "rgba(14,13,12,0.1)"}`, borderRadius: 12, padding: "12px",
              cursor: "grab", boxShadow: draggedNode === n.id ? "0 12px 24px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.04)",
              zIndex: draggedNode === n.id ? 10 : 1
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: `${color}15`, color: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={14} />
              </div>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "rgba(14,13,12,0.4)" }}>{n.type}</span>
            </div>
            <h4 style={{ fontSize: "13px", fontWeight: 650, color: n.missing ? "#DC2626" : "#141210", lineHeight: 1.3 }}>{n.title}</h4>
            
            {n.missing && (
              <button onClick={onGenerateNode} style={{ marginTop: 10, width: "100%", padding: "6px", background: "#DC2626", color: "#fff", border: "none", borderRadius: 6, fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <Sparkles size={12} /> Generate Lesson
              </button>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
'''

# Find the start of CurriculumWorkspace
start_workspace = content.find('export default function CurriculumWorkspace() {')

# Inject KnowledgeMapEditor before it
if start_workspace != -1 and 'function KnowledgeMapEditor' not in content:
    content = content[:start_workspace] + knowledge_map_code + '\n' + content[start_workspace:]

# Find where the `mode === "map"` conditional is rendered.
# Currently the modes are "overview", "explorer", "map".
# Looking at the original file:
map_target = '            {mode === "map" && (\n              <div style={{ padding: 40, textAlign: "center", color: "rgba(14,13,12,0.4)" }}>\n                <Network size={40} style={{ marginBottom: 12, opacity: 0.5 }} />\n                <p>Curriculum Map Visualization (Coming Soon)</p>\n              </div>\n            )}'

if map_target in content:
    map_replacement = '''            {mode === "map" && (
              <div style={{ flex: 1, width: "100%", height: "100%", position: "relative" }}>
                <KnowledgeMapEditor tree={activeTree} onNodeClick={setSelectedNodeId} onGenerateNode={() => alert("AI is generating the lesson...")} />
              </div>
            )}'''
    content = content.replace(map_target, map_replacement)
else:
    # Let's search for "Coming Soon" in the file
    cs_idx = content.find('Coming Soon')
    if cs_idx != -1:
        # Re-find the exact snippet
        div_start = content.rfind('{mode === "map" && (', 0, cs_idx)
        div_end = content.find(')}', cs_idx) + 2
        if div_start != -1 and div_end != -1:
            map_replacement = '''{mode === "map" && (
              <div style={{ flex: 1, width: "100%", height: "100%", position: "relative" }}>
                <KnowledgeMapEditor tree={activeTree} onNodeClick={setSelectedNodeId} onGenerateNode={() => alert("AI is generating the lesson...")} />
              </div>
            )}'''
            content = content[:div_start] + map_replacement + content[div_end:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("curriculum/page.tsx patched successfully!")
