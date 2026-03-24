import { useCallback, useEffect, useState } from "react";
import { layoutTree } from "../utils/layout";
import { buildEdges } from "../utils/edges";

const rootId = "root";

export const useMindMap = (initialNodes) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Add child node
  const addChildNode = useCallback(() => {
    setNodes((nds) => {
      const parentId =
        selectedNodeId && nds.some((n) => n.id === selectedNodeId)
          ? selectedNodeId
          : "root";

      const newNode = {
        id: `${nds.length + 1}`,
        type: "custom",
        parentId,
        data: { label: "New Node", onChange: handleNodeLabelChange },
      };

      const updatedNodes = [...nds, newNode];
      const laidOutNodes = layoutTree(updatedNodes, "root");

      // Rebuild edges
      setEdges(buildEdges(laidOutNodes));

      return laidOutNodes;
    });
  }, [selectedNodeId]);

  // Handle node label change
  const handleNodeLabelChange = (newLabel, nodeId) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                label: newLabel,
                onChange: handleNodeLabelChange,
              },
            }
          : n
      )
    );
  };

  // Recursively find all descendants of a node
  const getAllChildren = (nodes, parentId) => {
    const children = nodes.filter((n) => n.parentId === parentId);
    let all = [...children];
    children.forEach((c) => {
      all = all.concat(getAllChildren(nodes, c.id));
    });
    return all;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      // N → add child
      if (e.key.toLowerCase() === "n") addChildNode();

      // E → edit selected node
      if (e.key.toLowerCase() === "e" && selectedNodeId) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === selectedNodeId
              ? { ...n, data: { ...n.data, _editTrigger: Date.now() } }
              : n
          )
        );
      }

      // Delete / Alt+Delete
      if ((e.key === "Delete" || e.key === "Del") && selectedNodeId) {
        setNodes((nds) => {
          const isMain = selectedNodeId === "root";

          const toRemove =
            e.altKey || isMain
              ? getAllChildren(nds, selectedNodeId).map((n) => n.id)
              : [
                  selectedNodeId,
                  ...getAllChildren(nds, selectedNodeId).map((n) => n.id),
                ];

          const remainingNodes = nds.filter((n) => !toRemove.includes(n.id));

          const laidOutNodes = layoutTree(remainingNodes, "root");

          // rebuild edges here
          setEdges(buildEdges(laidOutNodes));

          return laidOutNodes;
        });

        setEdges((eds) =>
          buildEdges(
            nodes.filter(
              (n) =>
                !(e.altKey || selectedNodeId === "root"
                  ? getAllChildren(nodes, selectedNodeId)
                      .map((c) => c.id)
                      .includes(n.id)
                  : [
                      selectedNodeId,
                      ...getAllChildren(nodes, selectedNodeId).map((c) => c.id),
                    ].includes(n.id))
            )
          )
        );

        setSelectedNodeId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addChildNode, nodes, selectedNodeId]);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    selectedNodeId,
    setSelectedNodeId,
  };
};
