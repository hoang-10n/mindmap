export const buildEdges = (nodes) => {
  return nodes
    .filter((n) => n.parentId)
    .map((n) => ({
      id: `${n.parentId}-${n.id}`,
      source: n.parentId,
      target: n.id,
      sourceHandle: "right",
      targetHandle: "left",

      type: "default", // <-- curved edge
      animated: true, // optional: true if you want animation
    }));
};
