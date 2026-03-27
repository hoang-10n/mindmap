import { useEffect, useRef, useState } from "react";
import { useMindMap } from "../hooks/useMindMap";
import { NODE_HEIGHT } from "../types/mindMapConst";
import type { NodeType } from "../types/mindMapTypes";
import { CustomNode } from "./CustomNode";
import { ContentPanel } from "./ContentPanel";

const rootId = "root";

const initialNodes: NodeType[] = [
  {
    id: rootId,
    label: "Main Idea",
    content:
      "This is the central node. Double-click to edit the label, and use the button below to add child nodes.",
    parentId: "",
    position: { x: 0, y: 0 }, // <-- required
    height: NODE_HEIGHT,
    width: 200,
    combinedHeight: 50, // <-- required
    onChange: () => {},
  },
];

export default function MindMap() {
  const { nodes, edges, setNodes, selectedNodeId, setSelectedNodeId } =
    useMindMap(initialNodes);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null); // node currently expanded in panel

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  };
  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  // Zoom handlers
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      setZoom((z) => Math.min(Math.max(z + delta, 0.2), 3));
    };
    const container = containerRef.current;
    if (container)
      container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      if (container) container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleOpenNode = (nodeId: string) => setActiveNodeId(nodeId);
  const handleContentChange = (nodeId: string, content: string) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, content } : n))
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        cursor: dragging ? "grabbing" : "grab",
        background: "#f0f0f0", // The "void" color
        display: "flex",
        position: "relative",
      }}
    >
      {/* 1. THE GRID LAYER: Moves with the offset to give the illusion of infinity */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 1,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${offset.x}px ${offset.y}px`,
        }}
      />

      <div style={{ flex: 1, position: "relative" }}>
        {/* 2. THE TRANSFORM LAYER: This div has no fixed width/height */}
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {/* 3. THE SVG LAYER: Set overflow to visible so lines aren't clipped */}
          <svg
            style={{
              position: "absolute",
              overflow: "visible",
              pointerEvents: "none",
            }}
          >
            {edges.map((edge) => (
              <line
                key={edge.id}
                x1={edge.sourcePosition.x}
                y1={edge.sourcePosition.y}
                x2={edge.targetPosition.x}
                y2={edge.targetPosition.y}
                stroke="#999"
                strokeWidth={2 / zoom} // Keep lines crisp when zooming
              />
            ))}
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: node.position.x,
                top: node.position.y,
              }}
            >
              <CustomNode
                id={node.id}
                data={{ label: node.label, onChange: node.onChange }}
                position={{ x: 0, y: 0 }}
                selected={selectedNodeId === node.id}
                onSelect={setSelectedNodeId}
              />
              <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                <button onClick={() => handleOpenNode(node.id)}>
                  {node.content ? "👁️" : "➕"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. THE UI LAYER (Panels & Controls) */}
      <div style={{ zIndex: 10, pointerEvents: "auto", height: "100%" }}>
        <ContentPanel
          nodes={nodes}
          activeNodeId={activeNodeId}
          onOpen={handleOpenNode}
          onChange={handleContentChange}
        />
      </div>

      {/* Zoom controls */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
          background: "rgba(255,255,255,0.9)",
          padding: "8px 16px",
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 10,
        }}
      >
        <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.2))}>
          -
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}>+</button>
      </div>
    </div>
  );
}
