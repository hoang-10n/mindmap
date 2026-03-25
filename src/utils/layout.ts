import { HORIZONTAL_GAP, NODE_HEIGHT, VERTICAL_GAP } from "../types/mindMapConst";
import type { NodeType } from "../types/mindMapTypes";

export const layoutTree = (nodes: NodeType[], rootId: string): NodeType[] => {
  const nodeMap = new Map(nodes.map((n) => [n.id, { ...n }]));

  const getChildren = (id: string) => nodes.filter((n) => n.parentId === id);

  // Recursively compute combinedHeight for each node
  const computeCombinedHeight = (nodeId: string): number => {
    const node = nodeMap.get(nodeId);
    if (!node) return 0;

    const children = getChildren(nodeId);
    if (children.length === 0) {
      node.combinedHeight = NODE_HEIGHT;
      return node.combinedHeight;
    }

    let totalHeight = 0;
    children.forEach((child) => {
      totalHeight += computeCombinedHeight(child.id) + VERTICAL_GAP;
    });

    // Remove extra VERTICAL_GAP at bottom
    totalHeight -= VERTICAL_GAP;

    node.combinedHeight = Math.max(NODE_HEIGHT, totalHeight);
    return node.combinedHeight;
  };

  computeCombinedHeight(rootId);

  // Recursively position nodes based on combinedHeight
  const positionNode = (nodeId: string, depth: number, yTop: number) => {
    const node = nodeMap.get(nodeId);
    if (!node) return;

    const children = getChildren(nodeId);

    // Center parent above children
    if (children.length > 0) {
      const topY = yTop;
      const bottomY = yTop + children.reduce((sum, c) => sum + (nodeMap.get(c.id)?.combinedHeight ?? 0) + VERTICAL_GAP, -VERTICAL_GAP);
      node.position = { x: depth * HORIZONTAL_GAP, y: topY + (bottomY - topY - NODE_HEIGHT) / 2 };
    } else {
      node.position = { x: depth * HORIZONTAL_GAP, y: yTop };
    }

    // Position children stacked vertically
    let currentY = yTop;
    children.forEach((child) => {
      const childNode = nodeMap.get(child.id)!;
      positionNode(child.id, depth + 1, currentY);
      currentY += childNode.combinedHeight + VERTICAL_GAP;
    });
  };

  positionNode(rootId, 0, 0);

  return Array.from(nodeMap.values());
};