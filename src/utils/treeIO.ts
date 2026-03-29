import type { NodeLayout } from "../types/mindMapTypes";
import { NODE_HEIGHT } from "../types/mindMapConst";

export type ExportNode = {
  id: string;
  label: string;
  content?: string;
  children: ExportNode[];
};

/* =========================
   EXPORT (flat → nested)
========================= */
export const exportTree = (nodes: NodeLayout[]): ExportNode | null => {
  const map = new Map<string, ExportNode>();

  // create nodes
  nodes.forEach((n) => {
    map.set(n.data.id, {
      id: n.data.id,
      label: n.data.label,
      content: n.data.content || "",
      children: [],
    });
  });

  let root: ExportNode | null = null;

  // link
  nodes.forEach((n) => {
    const current = map.get(n.data.id)!;

    if (!n.data.parentId) {
      root = current;
    } else {
      const parent = map.get(n.data.parentId);
      parent?.children.push(current);
    }
  });

  return root;
};

/* =========================
   IMPORT (nested → flat)
========================= */
export const importTree = (tree: ExportNode): NodeLayout[] => {
  const result: NodeLayout[] = [];

  let index = 0;

  const traverse = (
    node: ExportNode,
    parentId: string | undefined,
    depth: number
  ) => {
    const id = node.id || `${index++}`;

    result.push({
      position: { x: depth * 300, y: index * 80 }, // basic layout
      combinedHeight: NODE_HEIGHT,
      data: {
        id,
        parentId: parentId || "",
        label: node.label,
        content: node.content || "",
        onChange: () => { },
      },
    });

    node.children?.forEach((child) =>
      traverse(child, id, depth + 1)
    );
  };

  traverse(tree, undefined, 0);

  return result;
};
