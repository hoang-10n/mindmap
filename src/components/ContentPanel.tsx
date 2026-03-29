import { useState, useRef, useEffect } from "react";
import PanelNode from "./PanelNode";
import { useMindMapStore } from "../store/useMindMapStore";

type ContentPanelProps = {
  openNodes: { [id: string]: boolean };
};

export function ContentPanel({ openNodes }: ContentPanelProps) {
  const [width, setWidth] = useState(350);
  const isResizing = useRef(false);

  // Pull nodes from store
  const nodes = useMindMapStore((s) => s.nodes);

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

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

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
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <h3 className="text-lg font-semibold">Node Contents</h3>

        {Object.entries(openNodes).map(([nodeId, isOpen]) =>
          isOpen && nodes.find((n) => n.data.id === nodeId) ? (
            <PanelNode
              key={nodeId}
              node={nodes.find((n) => n.data.id === nodeId)!.data}
            />
          ) : null
        )}
      </div>
    </div>
  );
}
