import { useCallback, useEffect, useState } from "react";
import { layoutTree } from "../utils/layout";
import { buildEdges } from "../utils/edges";
import type { NodeLayout } from "../types/mindMapTypes";

export const useMindMap = (initialNodes: NodeLayout[]) => {
  const [nodes, setNodes] = useState<NodeLayout[]>(initialNodes);
  const [edges, setEdges] = useState<any[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Helper to generate unique IDs
  const generateId = () =>
    `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const handleNodeLabelChange = useCallback(
    (newLabel: string, nodeId: string) => {
      setNodes((nds) => {
        const updated = nds.map((n) =>
          n.data.id === nodeId
            ? { ...n, data: { ...n.data, label: newLabel } }
            : n
        );
        return updated;
      });
    },
    []
  );

  const getAllChildrenIds = (
    nodes: NodeLayout[],
    parentId: string
  ): string[] => {
    const children = nodes.filter((n) => n.data.parentId === parentId);
    let ids = children.map((c) => c.data.id);
    children.forEach((c) => {
      ids = ids.concat(getAllChildrenIds(nodes, c.data.id));
    });
    return ids;
  };

  const addChildNode = useCallback(() => {
    setNodes((nds) => {
      // 1. Determine parent (fallback to root if selection is missing or invalid)
      const parentExists = nds.some((n) => n.data.id === selectedNodeId);
      const parentId = parentExists ? (selectedNodeId as string) : "root";

      // 2. Create the new node with a guaranteed UNIQUE ID
      const newNode: NodeLayout = {
        data: {
          id: generateId(),
          label: "New Node",
          content:
            "This is this node's content. Click the edit button to change it.",
          parentId: parentId,
          onChange: handleNodeLabelChange,
        },
        position: { x: 0, y: 0 },
        combinedHeight: 50,
      };

      const updatedNodes = [...nds, newNode];

      // 3. Layout the new tree and update edges
      const laidOutNodes = layoutTree(updatedNodes, "root");
      setEdges(buildEdges(laidOutNodes));
      return laidOutNodes;
    });
  }, [selectedNodeId, handleNodeLabelChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      const key = e.key.toLowerCase();

      // Add Node
      if (key === "n") {
        e.preventDefault();
        addChildNode();
      }

      // Edit Trigger
      if (key === "e" && selectedNodeId) {
        setNodes((nds) =>
          nds.map((n) =>
            n.data.id === selectedNodeId
              ? { ...n, _editTrigger: Date.now() }
              : n
          )
        );
      }

      // Delete Node and its subtree
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedNodeId &&
        selectedNodeId !== "root"
      ) {
        setNodes((nds) => {
          const childrenToRemove = getAllChildrenIds(nds, selectedNodeId);
          const toRemove = [...childrenToRemove, selectedNodeId];

          const remainingNodes = nds.filter(
            (n) => !toRemove.includes(n.data.id)
          );

          const laidOutNodes = layoutTree(remainingNodes, "root");
          setEdges(buildEdges(laidOutNodes));
          return laidOutNodes;
        });
        setSelectedNodeId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addChildNode, selectedNodeId]);

  // Initial layout on mount
  useEffect(() => {
    if (nodes.length > 0 && edges.length === 0) {
      const laidOut = layoutTree(nodes, "root");
      setNodes(laidOut);
      setEdges(buildEdges(laidOut));
    }
  }, []);

  return {
    nodes,
    edges,
    selectedNodeId,
    setSelectedNodeId,
    setNodes,
    setEdges,
  };
};
