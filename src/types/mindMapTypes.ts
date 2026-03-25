export type NodeType = {
  id: string;
  label: string;
  content: string;
  parentId?: string;
  position: { x: number; y: number };
  height: number;
  width: 200 | 600;
  combinedHeight: number;
  onChange?: (value: string, id: string) => void;
};

export type CustomNodeProps = {
  data: {
    label: string;
    content?: string;
    onChange?: (value: string, id: string) => void;
  };
  id: string;
  position: { x: number; y: number };
  onSelect: (id: string) => void;
  selected: boolean;
};

export type ContentPanelProps = {
  nodes: NodeType[];
  activeNodeId: string | null;           // node currently opened in the panel
  onOpen: (nodeId: string) => void;      // open node block
  onChange: (nodeId: string, content: string) => void;
};