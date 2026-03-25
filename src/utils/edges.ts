import { NO_CONTENT_NODE_WIDTH, NODE_HEIGHT } from "../types/mindMapConst";
import type { NodeType } from "../types/mindMapTypes";

export type EdgeType = {
  id: string;
  source: string;
  target: string;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
};

export const buildEdges = (nodes: NodeType[]): EdgeType[] => {
  const edges: EdgeType[] = [];

  nodes.forEach((node) => {
    if (!node.parentId) return;
    const parent = nodes.find((n) => n.id === node.parentId);
    if (!parent) return;

    // Connect right side of parent to left side of child
    edges.push({
      id: `${parent.id}-${node.id}`,
      source: parent.id,
      target: node.id,
      sourcePosition: {
        x: parent.position.x + NO_CONTENT_NODE_WIDTH, // node width
        y: parent.position.y + NODE_HEIGHT / 2 + 10,  // vertical middle approx
      },
      targetPosition: {
        x: node.position.x,
        y: node.position.y + NODE_HEIGHT / 2 + 10, // vertical middle approx
      },
    });
  });

  return edges;
};
