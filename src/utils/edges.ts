import { NODE_WIDTH, NODE_HEIGHT } from "../types/mindMapConst";
import type { NodeLayout } from "../types/mindMapTypes";

export type EdgeType = {
  id: string;
  source: string;
  target: string;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
};

export const buildEdges = (nodes: NodeLayout[]): EdgeType[] => {
  const edges: EdgeType[] = [];

  const visibleNodes = nodes.filter((n) => !n.hidden);

  visibleNodes.forEach((node) => {
    if (!node.data.parentId) return;

    const parent = visibleNodes.find((n) => n.data.id === node.data.parentId);

    if (!parent) return;

    edges.push({
      id: `${parent.data.id}-${node.data.id}`,
      source: parent.data.id,
      target: node.data.id,
      sourcePosition: {
        x: parent.position.x + NODE_WIDTH,
        y: parent.position.y + NODE_HEIGHT / 2,
      },
      targetPosition: {
        x: node.position.x,
        y: node.position.y + NODE_HEIGHT / 2,
      },
    });
  });

  return edges;
};
