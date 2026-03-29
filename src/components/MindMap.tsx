import { useRef, useState } from "react";
import { useMindMap } from "../hooks/useMindMap";
import type { NodeData, NodeLayout } from "../types/mindMapTypes";
import { usePan } from "../features/mindmap/usePan";
import { useZoom } from "../features/mindmap/useZoom";
import { useImportExport } from "../features/mindmap/useImportExport";
import { Controls } from "./Control";
import { Canvas } from "./Canvas";
import { ContentPanel } from "./ContentPanel";

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
      handleChange: () => { },
    },
  },
];

export default function MindMap() {
  const { nodes, edges, setNodes, selectedNodeId, setSelectedNodeId } =
    useMindMap(initialNodes);

  const containerRef = useRef<HTMLDivElement>(null);

  const pan = usePan();
  const zoom = useZoom(containerRef);
  const io = useImportExport(nodes, setNodes);

  const [showContentPanel, setShowContentPanel] = useState(true);

  const [openNodes, setOpenNodes] = useState<Record<string, NodeData>>({});

  const handleToggleNode = (node: NodeData) => {
    setOpenNodes((prev) => {
      const next = { ...prev };

      const id = node.id;

      if (next[id]) {
        delete next[id]; // remove
      } else {
        next[id] = node
      }

      return next;
    });
  };

  const handleChange = (nodeId: string, content: string) => {
    setNodes((nds: any[]) =>
      nds.map((n) =>
        n.data.id === nodeId ? { ...n, content } : n
      )
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={pan.handleMouseDown}
      className={`w-screen h-screen overflow-hidden flex relative bg-gray-100 ${pan.dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
    >
      <Canvas
        nodes={nodes}
        edges={edges}
        zoom={zoom.zoom}
        offset={pan.offset}
        selectedNodeId={selectedNodeId}
        setSelectedNodeId={setSelectedNodeId}
        handleToggleNode={handleToggleNode}
        openNodes={openNodes}
      />

      <Controls
        zoom={zoom}
        handleExport={io.handleExport}
        handleImport={io.handleImport}
        showPanel={showContentPanel}
        togglePanel={() => setShowContentPanel((p) => !p)}
      />

      <div
        data-no-drag
        className={`z-10 pointer-events-auto h-full min-w-80 transition-transform duration-300 ease-in-out ${showContentPanel ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <ContentPanel
          openNodes={openNodes}
          activeNodeId={selectedNodeId}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
}