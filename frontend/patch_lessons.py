import os

path = r'c:\Users\USER\Desktop\studio\app\(dashboard)\lessons\[id]\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Imports
if 'import { StudentSimulatorModal }' not in content:
    import_index = content.find('import {')
    content = content[:import_index] + 'import { StudentSimulatorModal } from "@/components/dashboard/StudentSimulatorModal";\nimport { AiCoTeacherPanel } from "@/components/dashboard/AiCoTeacherPanel";\n' + content[import_index:]

# 2. Add state to TopicBuilderPage
state_target = '  const [showCollabNames, setShowCollabNames] = useState(false);'
if state_target in content and 'const [simulatorOpen, setSimulatorOpen]' not in content:
    state_replacement = state_target + '''
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  
  // Live Cursors Mock
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
'''
    content = content.replace(state_target, state_replacement)

# 3. Add Live Cursors Render to TopicBuilderPage return
if 'return (' in content:
    render_start = content.find('return (', content.find('export default function TopicBuilderPage'))
    div_start = content.find('<div style={{ display: "flex",', render_start)
    if div_start != -1 and 'id="live-cursors"' not in content:
        cursors_render = '''
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
            <div style={{ background: c.color, color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: 4, marginTop: -4, marginLeft: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              {c.name.split(' ')[0]}
            </div>
          </motion.div>
        ))}
      </div>
'''
        content = content[:div_start+31] + cursors_render + content[div_start+31:]

# 4. Pass props to TopBar
topbar_target = '        <TopBar\n          status={status}'
if topbar_target in content and 'onSimulate' not in content:
    topbar_replacement = topbar_target.replace('<TopBar', '<TopBar\n          onSimulate={() => setSimulatorOpen(true)}\n          onToggleAi={() => setAiPanelOpen(!aiPanelOpen)}')
    content = content.replace(topbar_target, topbar_replacement)
else:
    # try one-liner if it's formatted differently
    topbar_target = '<TopBar status={status}'
    if topbar_target in content and 'onSimulate' not in content:
        topbar_replacement = topbar_target.replace('<TopBar', '<TopBar onSimulate={() => setSimulatorOpen(true)} onToggleAi={() => setAiPanelOpen(!aiPanelOpen)} ')
        content = content.replace(topbar_target, topbar_replacement)

# 5. Add Modals and Panel to AnimatePresence overlays
overlays_target = '        {historyOpen && (\n          <HistoryPanel me={me} onClose={() => setHistoryOpen(false)} />\n        )}'
if overlays_target in content and '<StudentSimulatorModal' not in content:
    overlays_replacement = overlays_target + '''
        {simulatorOpen && (
          <StudentSimulatorModal activeSlides={allSlides} onClose={() => setSimulatorOpen(false)} />
        )}
'''
    content = content.replace(overlays_target, overlays_replacement)

# Add AI Panel
editor_flex_target = '{/* RIGHT PROPERTIES */}'
if editor_flex_target in content and '<AiCoTeacherPanel' not in content:
    # Insert AI panel next to properties panel
    editor_flex_replacement = '''{/* RIGHT PROPERTIES */}
        <AnimatePresence>
          {aiPanelOpen && activeSelection.type === "slide" && activeSlide && (
            <AiCoTeacherPanel 
              slide={activeSlide} 
              onClose={() => setAiPanelOpen(false)} 
              onApplySuggestion={(s) => console.log("Applied", s)} 
            />
          )}
        </AnimatePresence>
''' + editor_flex_target
    content = content.replace(editor_flex_target, editor_flex_replacement)

# 6. Update TopBar function signature and render buttons
topbar_func_target = 'function TopBar({ status, saved, activePct, ratioOk, collaborators, showCollabNames, onToggleCollabNames, onHistory, onStage, onBack }: any) {'
if topbar_func_target in content:
    topbar_func_replacement = 'function TopBar({ status, saved, activePct, ratioOk, collaborators, showCollabNames, onToggleCollabNames, onHistory, onStage, onBack, onSimulate, onToggleAi }: any) {'
    content = content.replace(topbar_func_target, topbar_func_replacement)

topbar_actions_target = '        <button onClick={onHistory}'
if topbar_actions_target in content and 'onSimulate' not in content[content.find(topbar_actions_target):content.find(topbar_actions_target)+300]:
    topbar_actions_replacement = '''
        <button onClick={onSimulate} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px", height: 34, background: "rgba(124,58,237,0.08)", color: "#7C3AED", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 8, cursor: "pointer", fontSize: "13px", fontWeight: 650 }}><Play size={13} fill="currentColor" /> Simulate</button>
        <button onClick={onToggleAi} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px", height: 34, background: "rgba(147,51,234,0.08)", color: "#9333EA", border: "1px solid rgba(147,51,234,0.2)", borderRadius: 8, cursor: "pointer", fontSize: "13px", fontWeight: 650 }}><Sparkles size={13} /> AI Co-Teacher</button>
        <div style={{ width: 1, height: 20, background: "rgba(14,13,12,0.08)", margin: "0 4px" }} />
''' + topbar_actions_target
    content = content.replace(topbar_actions_target, topbar_actions_replacement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("lessons/[id]/page.tsx patched successfully!")
