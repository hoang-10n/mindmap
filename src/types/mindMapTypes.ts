// export type NodeType = {
//   id: string;
//   label: string;
//   content: string;
//   parentId?: string;
//   position: { x: number; y: number };
//   height: number;
//   width: 200 | 600;
//   combinedHeight: number;
//   onChange?: (value: string, id: string) => void;
// };

// export type CustomNodeProps = {
//   data: {
//     label: string;
//     content?: string;
//     onChange?: (value: string, id: string) => void;
//   };
//   id: string;
//   position: { x: number; y: number };
//   onSelect: (id: string) => void;
//   selected: boolean;
// };

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
  width: 200 | 600;
  height: number;
  combinedHeight: number;
};

export type ContentPanelProps = {
  nodes: NodeData[];
  activeNodeId: string | null; // node currently opened in the panel
  onOpen: (nodeId: string) => void; // open node block
  onChange: (nodeId: string, content: string) => void;
};
