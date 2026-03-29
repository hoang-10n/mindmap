import { useEffect, useRef, useState } from "react";
import { useMindMap } from "../hooks/useMindMap";
import { NODE_HEIGHT } from "../types/mindMapConst";
import type { NodeLayout } from "../types/mindMapTypes";
import { CustomNode } from "./CustomNode";
import { ContentPanel } from "./ContentPanel";
import { ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import { exportTree, importTree } from "../utils/treeIO";

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
      onChange: () => { },
    },
  },
];

export default function MindMap() {
  const { nodes, edges, setNodes, selectedNodeId, setSelectedNodeId } =
    useMindMap(initialNodes);

  const [zoom, setZoom] = useState(1);
  const [showContentPanel, setShowContentPanel] = useState(true);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest("[data-no-drag]")
    ) {
      return;
    }

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

  const handleExport = () => {
    const tree = exportTree(nodes);

    if (!tree) return;

    const blob = new Blob([JSON.stringify(tree, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mindmap.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const newNodes = importTree(json);
        setNodes(newNodes);
      } catch (err) {
        console.error("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  };

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
      className={`w-screen h-screen overflow-hidden flex relative bg-gray-100 ${dragging ? "cursor-grabbing" : "cursor-grab"
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
      <div
        data-no-drag
        className={`z-10 pointer-events-auto h-full min-w-80 transition-transform duration-300 ease-in-out ${showContentPanel ? "translate-x-0" : "translate-x-full"
          }`}
      >
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
          onClick={handleExport}
          className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Export
        </button>

        <label className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 cursor-pointer">
          Import
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="hidden"
          />
        </label>


        {/* Toggle panel icon */}
        <button
          onClick={() => setShowContentPanel((prev) => !prev)}
          className="p-1 hover:bg-gray-100 rounded transition"
          title={showContentPanel ? "Hide panel" : "Show panel"}
        >
          {showContentPanel ? (
            <ChevronRightIcon className="w-4 h-4" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4" />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Zoom controls */}
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