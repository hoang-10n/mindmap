export type NodeData = {
  id: string;
  label: string;
  content?: string;
  parentId?: string;
  handleChange?: (value: string, id: string) => void;
};

export type NodeLayout = {
  data: NodeData;
  position: { x: number; y: number };
  combinedHeight: number;
  hidden: boolean;
};
