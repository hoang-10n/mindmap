import { useEffect, useRef, useState } from "react";
import { useMindMap } from "../hooks/useMindMap";
import { NODE_HEIGHT } from "../types/mindMapConst";
import type { NodeLayout } from "../types/mindMapTypes";
import { CustomNode } from "./CustomNode";
import { ContentPanel } from "./ContentPanel";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";

const rootId = "root";

const initialNodes: NodeLayout[] = [
  {
    position: { x: 0, y: 0 },
    width: 200,
    height: NODE_HEIGHT,
    combinedHeight: 50,
    data: {
      id: rootId,
      parentId: "",
      label: "Main Idea",
      content:
        "This is the central node. Double-click to edit the label, and use the button below to add child nodes.",
      onChange: () => {},
    },
  },
];

export default function MindMap() {
  const { nodes, edges, setNodes, selectedNodeId, setSelectedNodeId } =
    useMindMap(initialNodes);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // Pan
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

  // Zoom
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      setZoom((z) => Math.min(Math.max(z + delta, 0.2), 3));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleOpenNode = (nodeId: string) => setActiveNodeId(nodeId);

  const handleContentChange = (nodeId: string, content: string) => {
    setNodes((nds) =>
      nds.map((n) => (n.data.id === nodeId ? { ...n, content } : n))
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className={`w-screen h-screen overflow-hidden flex relative bg-gray-100 ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* Grid layer */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden z-1"
        style={{
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${offset.x}px ${offset.y}px`,
        }}
      />

      {/* Canvas */}
      <div className="flex-1">
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          }}
        >
          {/* Edges */}
          <svg className="absolute overflow-visible pointer-events-none">
            {edges.map((edge) => (
              <line
                key={edge.id}
                x1={edge.sourcePosition.x}
                y1={edge.sourcePosition.y}
                x2={edge.targetPosition.x}
                y2={edge.targetPosition.y}
                stroke="#999"
                strokeWidth={2 / zoom}
              />
            ))}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.data.id}
              className="absolute"
              style={{
                left: node.position.x,
                top: node.position.y,
              }}
            >
              <CustomNode
                layout={node}
                selected={selectedNodeId === node.data.id}
                onSelect={(id) => {
                  setSelectedNodeId(id);
                  console.log(node);
                }}
                handleOpenNode={handleOpenNode}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="z-10 pointer-events-auto h-full">
        <ContentPanel
          nodes={nodes.map((node) => node.data)}
          activeNodeId={activeNodeId}
          onOpen={handleOpenNode}
          onChange={handleContentChange}
        />
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 px-4 py-2 rounded-lg shadow-md z-10">
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.1, 0.2))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <MinusIcon className="w-4 h-4" />
        </button>

        <span className="text-sm font-medium">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}