import React from "react";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { CustomNode } from "./CustomNode";
import { useMindMap } from "../hooks/useMindMap";

const rootId = "root";

const nodeTypes = { custom: CustomNode };

const initialNodes = [
  {
    id: rootId,
    type: "custom",
    data: { label: "Main Idea", onChange: () => {} },
    position: { x: 100, y: 0 },
  },
];

export default function MindMap() {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    selectedNodeId,
    setSelectedNodeId,
  } = useMindMap(initialNodes);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
