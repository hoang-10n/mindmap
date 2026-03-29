import { useEffect, useRef, useState } from "react";
import {
  NODE_WIDTH,
  NODE_HEIGHT,
} from "../types/mindMapConst";
import type { NodeData, NodeLayout } from "../types/mindMapTypes";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export type NodeUIProps = {
  selected: boolean;
  onSelect: (id: string) => void;
  layout: NodeLayout;
  handleToggleNode: (node: NodeData) => void;
  openNodes: Record<string, boolean>;
};

export function CustomNode({
  layout,
  selected,
  onSelect,
  handleToggleNode,
  openNodes,
}: NodeUIProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(layout.data.label);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isOpen = !!openNodes[layout.data.id];

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleBlurOrEnter = () => {
    setEditing(false);
    layout.data.handleChange?.(value, layout.data.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleBlurOrEnter();
  };

  return (
    <div
      onClick={() => onSelect?.(layout.data.id)}
      onDoubleClick={() => setEditing(true)}
      className={`absolute flex items-center justify-between px-4
        rounded-md bg-white cursor-pointer select-none
        font-['Times_New_Roman',serif]
        ${selected
          ? "border-2 border-blue-500"
          : "border border-gray-300"
        }
        hover:border-blue-400`}
      style={{
        height: NODE_HEIGHT,
        width: NODE_WIDTH,
      }}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlurOrEnter}
          onKeyDown={handleKeyDown}
          className="flex-1 h-[80%] bg-transparent outline-none border-b border-black text-sm font-['Times_New_Roman',serif] my-1"
        />
      ) : (
        <>
          <span className="flex-1 truncate text-sm">
            {value}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleNode(layout.data);
            }}
            className="ml-3 p-1.5 rounded hover:bg-gray-100"
            title="Toggle node"
          >
            {isOpen ? (
              <EyeSlashIcon
                className="w-4 h-4 text-gray-400"
              />
            ) : (
              <EyeIcon
                className="w-4 h-4 text-blue-500"
              />
            )}
          </button>
        </>
      )}
    </div>
  );
}