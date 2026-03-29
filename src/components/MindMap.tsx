import { useRef, useState } from "react";
import { useMindMap } from "../hooks/useMindMap";
import type { NodeLayout } from "../types/mindMapTypes";
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
      onChange: () => { },
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
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const handleOpenNode = (id: string) => setActiveNodeId(id);

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
        onOpenNode={handleOpenNode}
      />

      <Controls
        zoom={zoom}
        onExport={io.handleExport}
        onImport={io.handleImport}
        showPanel={showContentPanel}
        togglePanel={() => setShowContentPanel((p) => !p)}
      />

      <div
        data-no-drag
        className={`z-10 pointer-events-auto h-full min-w-80 transition-transform duration-300 ease-in-out ${showContentPanel ? "translate-x-0" : "translate-x-full"}`}
      >
        <ContentPanel
          activeNodeId={activeNodeId}
          onOpen={handleOpenNode}
          onChange={handleChange}
          nodes={Object.fromEntries(
            nodes.map(node => [node.data.id, node.data])
          )}
        />
      </div>
    </div>
  );
}