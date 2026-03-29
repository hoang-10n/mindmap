import { useState } from "react";
import type { NodeData } from "../types/mindMapTypes";

type Props = {
  node: NodeData;
  onChange: (nodeId: string, content: string) => void;
};

export default function PanelNode({ node, onChange: handleChange }: Props) {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="w-full flex flex-col space-y-2">
      {/* Label/Button */}
      <button
        type="button"
        onClick={() => setShowContent(!showContent)}
        className={`w-full flex justify-between items-center px-4 py-2
                    bg-white border border-gray-300 rounded-md
                    hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                    font-['Times_New_Roman',serif]`}
      >
        <span className="truncate">{node.label}</span>
        <span className="ml-2 text-blue-500">{showContent ? "▲" : "▼"}</span>
      </button>

      {/* Textarea (outside the button) */}
      <div
        className={`w-full transition-all duration-300 overflow-hidden
                    ${showContent ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <textarea
          value={node.content || ""}
          onChange={(e) => handleChange(node.id, e.target.value)}
          autoFocus={showContent}
          className="w-full border border-gray-300 rounded-md p-2
                     resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}