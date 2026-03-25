import type { ContentPanelProps } from "../types/mindMapTypes";

export function ContentPanel({ nodes, activeNodeId, onOpen, onChange }: ContentPanelProps) {
  return (
    <div
      style={{
        width: "350px",
        borderLeft: "1px solid #ccc",
        background: "#f9f9f9",
        padding: 16,
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      <h3>Node Contents</h3>

      {nodes.map((node) => (
        <div key={node.id} style={{ marginBottom: 16 }}>
          {/* Only show button if node has content or allow new */}
          {(node.content || true) && (
            <button
              style={{ marginBottom: 4 }}
              onClick={() => onOpen(node.id)}
            >
              {node.content ? "👁️" : "➕"} {node.label}
            </button>
          )}

          {/* Show content block if active */}
          {activeNodeId === node.id && (
            <textarea
              value={node.content || ""}
              onChange={(e) => onChange(node.id, e.target.value)}
              style={{ width: "100%", height: 120, resize: "vertical", boxSizing: "border-box" }}
              autoFocus
            />
          )}
        </div>
      ))}
    </div>
  );
}