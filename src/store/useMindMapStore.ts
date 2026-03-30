import { create } from "zustand";
import { layoutTree } from "../utils/layout";
import { buildEdges } from "../utils/edges";
import { exportTree, importTree } from "../utils/treeIO";
import type { NodeLayout } from "../types/mindMapTypes";

type Store = {
  nodes: NodeLayout[];
  edges: any[];
  selectedNodeId: string | null;

  offset: { x: number; y: number };
  zoom: number;

  setNodes: (nodes: NodeLayout[]) => void;
  setSelectedNodeId: (id: string | null) => void;

  addChildNode: () => void;
  deleteNode: () => void;
  updateLabel: (id: string, label: string) => void;

  setOffset: (
    fn: (o: { x: number; y: number }) => { x: number; y: number }
  ) => void;
  setZoom: (z: number) => void;

  exportJSON: () => void;
  importJSON: (file: File) => void;

  updateNode: (id: string, updater: (node: NodeLayout) => NodeLayout) => void;
};

export const useMindMapStore = create<Store>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  offset: { x: 0, y: 0 },
  zoom: 1,

  setNodes: (nodes) => {
    const laidOut = layoutTree(nodes, "root");
    set({
      nodes: laidOut,
      edges: buildEdges(laidOut),
    });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  updateLabel: (id, label) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.data.id === id ? { ...n, data: { ...n.data, label } } : n
      ),
    })),

  addChildNode: () => {
    const { nodes, selectedNodeId } = get();

    const parentExists = nodes.some((n) => n.data.id === selectedNodeId);
    const parentId = parentExists ? selectedNodeId! : "root";

    const id = `node-${Date.now()}`;

    const newNode: NodeLayout = {
      data: {
        id,
        label: id,
        content: "",
        parentId,
      },
      position: { x: 0, y: 0 },
      combinedHeight: 50,
      hidden: false,
    };

    const updated = [...nodes, newNode];
    const laidOut = layoutTree(updated, "root");

    set({
      nodes: laidOut,
      edges: buildEdges(laidOut),
    });
  },

  deleteNode: () => {
    const { nodes, selectedNodeId } = get();
    if (!selectedNodeId || selectedNodeId === "root") return;

    const getAllChildrenIds = (parentId: string): string[] => {
      const children = nodes.filter((n) => n.data.parentId === parentId);
      let ids = children.map((c) => c.data.id);
      children.forEach((c) => {
        ids = ids.concat(getAllChildrenIds(c.data.id));
      });
      return ids;
    };

    const toRemove = [selectedNodeId, ...getAllChildrenIds(selectedNodeId)];

    const remaining = nodes.filter((n) => !toRemove.includes(n.data.id));
    const laidOut = layoutTree(remaining, "root");

    set({
      nodes: laidOut,
      edges: buildEdges(laidOut),
      selectedNodeId: null,
    });
  },

  exportJSON: () => {
    const { nodes } = get();
    const tree = exportTree(nodes);
    if (!tree) return;

    const blob = new Blob([JSON.stringify(tree, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mindmap.json";
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON: (file: File) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const nodes = importTree(json);

        const laidOut = layoutTree(nodes, "root");

        set({
          nodes: laidOut,
          edges: buildEdges(laidOut),
        });
      } catch (e) {
        console.error("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  },

  setOffset: (fn) => set((state) => ({ offset: fn(state.offset) })),
  setZoom: (z) => set({ zoom: z }),

  updateNode: (id: string, updater: (node: NodeLayout) => NodeLayout) =>
    set((state) => {
      // 1. Update the nodes
      const updatedNodes = state.nodes.map((n) =>
        n.data.id === id ? updater(n) : n
      );

      // 2. Re-run layout
      const laidOut = layoutTree(updatedNodes, "root");

      // 3. Rebuild edges
      const edges = buildEdges(laidOut);

      return { nodes: laidOut, edges };
    }),
}));
