import { useRef, useState, useEffect, use } from "react";
import type { NodeData, NodeLayout } from "../types/mindMapTypes";

import { usePan } from "../features/mindmap/usePan";
import { useZoom } from "../features/mindmap/useZoom";

import { useMindMapStore } from "../store/useMindMapStore";

import { Controls } from "./Control";
import { Canvas } from "./Canvas";
import { ContentPanel } from "./ContentPanel";
import { useMindMapShortcuts } from "../features/mindmap/useMindMapShortcut";

const rootId = "root";

const initialNodes: NodeLayout[] = [
  {
    position: { x: 0, y: 0 },
    combinedHeight: 50,
    data: {
      id: rootId,
      parentId: "",
      label: "Main Idea",
      content: "Central node",
    },
  },
];

export default function MindMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useMindMapShortcuts();

  // ✅ STORE
  const setNodes = useMindMapStore((s) => s.setNodes);
  const exportJSON = useMindMapStore((s) => s.exportJSON);
  const importJSON = useMindMapStore((s) => s.importJSON);
  const offset = useMindMapStore((s) => s.offset);

  useEffect(() => {
    setNodes(initialNodes);
  }, [setNodes]);

  const pan = usePan();
  const zoom = useZoom(containerRef);

  const [showContentPanel, setShowContentPanel] = useState(true);

  // open nodes in panel
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({});

  const handleToggleNode = (node: NodeData) => {
    setOpenNodes((prev) => {
      const next = { ...prev };
      const id = node.id;

      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }

      return next;
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={pan.handleMouseDown}
      className={`w-screen h-screen overflow-hidden flex relative bg-gray-100 ${
        pan.dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <Canvas
        zoom={zoom.zoom}
        offset={offset}          // ✅ store-driven
        handleToggleNode={handleToggleNode}
        openNodes={openNodes}
      />

      <Controls
        zoom={zoom}
        handleExport={exportJSON}
        handleImport={(e: { target: { files: any[] } }) => {
          const file = e.target.files?.[0];
          if (file) importJSON(file);
        }}
        showPanel={showContentPanel}
        togglePanel={() => setShowContentPanel((p) => !p)}
      />

      <div
        data-no-drag
        className={`z-10 pointer-events-auto h-full min-w-80 transition-transform duration-300 ease-in-out ${
          showContentPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ContentPanel openNodes={openNodes} />
      </div>
    </div>
  );
}
