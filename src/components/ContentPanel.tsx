import { useState, useRef } from "react";
import { EyeIcon, PlusIcon } from "@heroicons/react/16/solid";
import type { ContentPanelProps } from "../types/mindMapTypes";

export function ContentPanel({
  nodes,
  activeNodeId,
  onOpen,
  onChange,
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

        {nodes.map((node) => (
          <div key={node.id} className="mb-4">
            <button
              onClick={() => onOpen(node.id)}
              className="flex items-center gap-2 mb-1 text-left hover:text-blue-600"
            >
              {node.content ? (
                <EyeIcon className="w-5 h-5 text-blue-500" />
              ) : (
                <PlusIcon className="w-5 h-5 text-blue-500" />
              )}
              <span>{node.label}</span>
            </button>

            {activeNodeId === node.id && (
              <textarea
                value={node.content || ""}
                onChange={(e) => onChange(node.id, e.target.value)}
                autoFocus
                className="w-full min-h-30 resize-y border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}