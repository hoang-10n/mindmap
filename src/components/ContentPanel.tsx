import { useState, useRef } from "react";
import type { NodeData } from "../types/mindMapTypes";
import PanelNode from "./PanelNode";

type ContentPanelProps = {
  openNodes: { [id: string]: NodeData };
  activeNodeId: string | null; // node currently opened in the panel
  handleChange: (nodeId: string, content: string) => void;
};

export function ContentPanel({
  openNodes,
  handleChange: handleChange,
}: ContentPanelProps) {
  const [width, setWidth] = useState(350);
  const isResizing = useRef(false);

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;

    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 350) {
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  // Attach global listeners
  useState(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <div
      className="h-full border-l border-gray-300 bg-gray-50 flex shrink-0"
      style={{ width }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className="w-1 cursor-col-resize bg-gray-300 hover:bg-blue-400"
      />

      {/* Panel content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Node Contents</h3>

        {Object.values(openNodes).map((node) => (
          <PanelNode
            key={node.id}
            node={node}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
}