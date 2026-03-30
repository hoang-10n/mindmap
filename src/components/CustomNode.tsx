import { useEffect, useRef, useState } from "react";
import { NODE_WIDTH, NODE_HEIGHT } from "../types/mindMapConst";
import type { NodeData, NodeLayout } from "../types/mindMapTypes";
import {
  EyeIcon,
  EyeSlashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useMindMapStore } from "../store/useMindMapStore";

export type NodeUIProps = {
  selected: boolean;
  layout: NodeLayout;
  openNodes: Record<string, boolean>;
  handleSelect: (id: string) => void;
  handleToggleNode: (node: NodeData) => void;
};

export function CustomNode({
  layout,
  selected,
  openNodes,
  handleSelect,
  handleToggleNode,
}: NodeUIProps) {
  const [editing, setEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(layout.data.label);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const updateNode = useMindMapStore((s) => s.updateNode);

  const isOpen = !!openNodes[layout.data.id];

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    setDraftLabel(layout.data.label);
  }, [layout.data.label]);

  useEffect(() => {
    if (!editing) {
      updateNode(layout.data.id, (n) => ({
        ...n,
        data: {
          ...n.data,
          label: draftLabel,
        },
      }));
    }
  }, [editing]);

  const handleBlurOrEnter = () => {
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlurOrEnter();
    }
  };

  return (
    <div
      onClick={() => handleSelect?.(layout.data.id)}
      onDoubleClick={() => setEditing(true)}
      className={`absolute flex items-center justify-between px-4
        rounded-md bg-white cursor-pointer select-none
        ${selected ? "border-2 border-blue-500" : "border border-gray-300"}
        hover:border-blue-400`}
      style={{
        height: NODE_HEIGHT,
        width: NODE_WIDTH,
      }}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={draftLabel}
          onChange={(e) => setDraftLabel(e.target.value)}
          onBlur={handleBlurOrEnter}
          onKeyDown={handleKeyDown}
          className="flex-1 h-[80%] bg-transparent outline-none border-b border-black text-sm my-1"
        />
      ) : (
        <>
          <span className="flex-1 truncate text-sm">{draftLabel}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleNode(layout.data);
            }}
            className={`ml-3 p-1.5 rounded hover:bg-gray-100`}
            title={isOpen ? "Remove from panel" : "Add to panel"}
          >
            {!layout.data.content ? (
              <PencilSquareIcon className="w-4 h-4 text-blue-500" />
            ) : isOpen ? (
              <EyeSlashIcon className="w-4 h-4 text-gray-400" />
            ) : (
              <EyeIcon className="w-4 h-4 text-blue-500" />
            )}
          </button>
        </>
      )}
    </div>
  );
}
