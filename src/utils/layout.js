const HORIZONTAL_GAP = 300;
const VERTICAL_GAP = 100;

export const layoutTree = (nodes, rootId) => {
  const nodeMap = new Map(nodes.map((n) => [n.id, { ...n }]));

  const getChildren = (id) => nodes.filter((n) => n.parentId === id);

  const positionNode = (nodeId, depth, y) => {
    const node = nodeMap.get(nodeId);

    const x = depth * HORIZONTAL_GAP;

    node.position = { x, y };

    const children = getChildren(nodeId);
    const n = children.length;

    if (n === 0) return;

    const offset = (n - 1) / 2;

    children.forEach((child, i) => {
      const childY = y + (i - offset) * VERTICAL_GAP;

      // ✅ pass depth instead of x
      positionNode(child.id, depth + 1, childY);
    });
  };

  // start at depth 0
  positionNode(rootId, 0, 0);

  return Array.from(nodeMap.values());
};
