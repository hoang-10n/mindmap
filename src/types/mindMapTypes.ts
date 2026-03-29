export type NodeData = {
  id: string;
  label: string;
  content?: string;
  parentId?: string;
  onChange?: (value: string, id: string) => void;
};

export type NodeLayout = {
  data: NodeData;
  position: { x: number; y: number };
  combinedHeight: number;
};

export type ContentPanelProps = {
  nodes: { [id: string]: NodeData };
  activeNodeId: string | null; // node currently opened in the panel
  onOpen: (nodeId: string) => void; // open node block
  onChange: (nodeId: string, content: string) => void;
};
