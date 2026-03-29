import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { NodeData } from "../types/mindMapTypes";
import { BookmarkSquareIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

type Props = {
  node: NodeData;
  onChange: (nodeId: string, content: string) => void;
};

export default function PanelNode({ node, onChange: handleChange }: Props) {
  const [showContent, setShowContent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(node.content || "");

  // TODO: ALlow editing label as well, maybe with a double-click or a separate button? For now, just content.
  return (
    <div className="w-full flex flex-col border border-gray-300 rounded-md overflow-hidden">
      {/* Label/Button */}
      <div
        onClick={() => setShowContent(!showContent)}
        className="w-full flex justify-between items-center px-4 py-2
                   bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                   font-['Times_New_Roman',serif]"
      >
        <span className="truncate">{node.label}</span>
        <span className="ml-2 text-blue-500">
          {isEditing ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent click
                handleChange(node.id, draftContent); // Save content
                setIsEditing(false);
              }}
              className="p-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <BookmarkSquareIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent click
                setIsEditing(true);
                setShowContent(true);
                setDraftContent(node.content || ""); // Load current content into draft
              }}
              className="p-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
          )}
        </span>
      </div>

      {/* Divider */}
      {showContent && <div className="border-t border-gray-300" />}

      {/* Content Area */}
      <div
        className={`w-full transition-all duration-300 overflow-hidden
                    ${showContent ? "h-full opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-2">
          {isEditing ? (
            <textarea
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              autoFocus
              className="w-full rounded-md p-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          ) : (
            <div className="markdown px-2">
              <Markdown remarkPlugins={[remarkGfm]}>{node.content || ""}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}