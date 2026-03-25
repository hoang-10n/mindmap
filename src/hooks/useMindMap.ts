import { useCallback, useEffect, useState } from "react";
import { layoutTree } from "../utils/layout";
import { buildEdges } from "../utils/edges";
import type { NodeType } from "../types/mindMapTypes";
import { NODE_HEIGHT } from "../types/mindMapConst";

export const useMindMap = (initialNodes: NodeType[]) => {
  const [nodes, setNodes] = useState<NodeType[]>(initialNodes);
  const [edges, setEdges] = useState<any[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeLabelChange = useCallback((newLabel: string, nodeId: string) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? { ...n, label: newLabel, onChange: handleNodeLabelChange }
          : n
      )
    );
  }, []);

  const getAllChildren = (nodes: NodeType[], parentId: string) => {
    const children = nodes.filter((n) => n.parentId === parentId);
    let all: NodeType[] = [...children];
    children.forEach((c) => {
      all = all.concat(getAllChildren(nodes, c.id));
    });
    return all;
  };

  const addChildNode = useCallback(() => {
    setNodes((nds) => {
      const parentId = selectedNodeId || "root";
      const newNode: NodeType = {
        id: `${nds.length + 1}`,
        label: "New Node",
        content: "This is this node's content. Click the edit button to change it.",
        parentId,
        position: { x: 0, y: 0 },
        height: NODE_HEIGHT,
        width: 200,
        combinedHeight: 50,
        onChange: handleNodeLabelChange,
      };
      const updatedNodes = [...nds, newNode];
      const laidOutNodes = layoutTree(updatedNodes, "root");
      setEdges(buildEdges(laidOutNodes));
      return laidOutNodes;
    });
  }, [selectedNodeId, handleNodeLabelChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.key.toLowerCase() === "n") addChildNode();
      if (e.key.toLowerCase() === "e" && selectedNodeId) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === selectedNodeId
              ? { ...n, _editTrigger: Date.now() }
              : n
          )
        );
      }

      if ((e.key === "Delete" || e.key === "Del") && selectedNodeId) {
        setNodes((nds) => {
          const toRemove = getAllChildren(nds, selectedNodeId).map(n => n.id).concat(selectedNodeId);
          const remainingNodes = nds.filter(n => !toRemove.includes(n.id));
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

  return { nodes, edges, selectedNodeId, setSelectedNodeId, setNodes, setEdges };
};
