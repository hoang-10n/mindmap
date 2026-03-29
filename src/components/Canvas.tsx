import { CustomNode } from "./CustomNode";
import { useMindMapStore } from "../store/useMindMapStore";
import type { NodeData, NodeLayout } from "../types/mindMapTypes";

interface Props {
  zoom: number;
  offset: { x: number; y: number };
  handleToggleNode: (node: NodeData) => void;
  openNodes: Record<string, boolean>;
}

export function Canvas({
  zoom,
  offset,
  handleToggleNode,
  openNodes,
}: Props) {
  // ✅ pull from store
  const storeNodes = useMindMapStore((s) => s.nodes);
  const storeEdges = useMindMapStore((s) => s.edges);
  const selectedNodeIdStore = useMindMapStore((s) => s.selectedNodeId);
  const setSelectedNodeIdStore = useMindMapStore((s) => s.setSelectedNodeId);

  return (
    <>
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
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
            {storeEdges.map((e) => (
              <line
                key={e.id}
                x1={e.sourcePosition.x}
                y1={e.sourcePosition.y}
                x2={e.targetPosition.x}
                y2={e.targetPosition.y}
                stroke="#999"
                strokeWidth={2 / zoom}
              />
            ))}
          </svg>

          {/* Nodes */}
          {storeNodes.map((node: NodeLayout) => (
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
                selected={selectedNodeIdStore === node.data.id}
                onSelect={setSelectedNodeIdStore}
                handleToggleNode={handleToggleNode}
                openNodes={openNodes}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
