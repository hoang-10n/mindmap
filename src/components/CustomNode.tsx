import { useEffect, useRef, useState, useMemo } from "react";
import { NODE_WIDTH, NODE_HEIGHT } from "../types/mindMapConst";
import type { NodeData, NodeLayout } from "../types/mindMapTypes";
import {
  EyeIcon,
  EyeSlashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useMindMapStore } from "../store/useMindMapStore";

// TODO: Badge disappear when clicked (all children are hidden)
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
  const allNodes = useMindMapStore((s) => s.nodes); // ✅ get from store

  const isOpen = !!openNodes[layout.data.id];

  const handleToggleChildren = (node: NodeLayout) => {
    const { nodes } = useMindMapStore.getState(); // get all nodes from store
    const children = nodes.filter((n) => n.data.parentId === node.data.id);

    children.forEach((child) => {
      updateNode(child.data.id, (n) => ({
        ...n,
        hidden: !n.hidden,
      }));
    });
  };

  // Compute total children (including hidden)
  const childrenCount = useMemo(() => {
    const countDescendants = (id: string): number => {
      const children = allNodes.filter((n) => n.data.parentId === id);
      return children.reduce(
        (sum, child) => sum + 1 + countDescendants(child.data.id),
        0
      );
    };
    return countDescendants(layout.data.id);
  }, [allNodes, layout.data.id]);

  const hasChildren = childrenCount > 0;

  // Focus input when editing
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  // Sync label from store
  useEffect(() => {
    setDraftLabel(layout.data.label);
  }, [layout.data.label]);

  // Save label when editing stops
  useEffect(() => {
    if (!editing && draftLabel !== layout.data.label) {
      updateNode(layout.data.id, (n) => ({
        ...n,
        data: {
          ...n.data,
          label: draftLabel,
        },
      }));
    }
  }, [editing, draftLabel, layout.data.label, layout.data.id, updateNode]);

  const handleBlurOrEnter = () => {
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleBlurOrEnter();
  };

  return (
    <div>
      <div
        onClick={() => {
          handleSelect?.(layout.data.id);

          // TODO: For debugging
          console.log(layout);
        }}
        onDoubleClick={() => setEditing(true)}
        className={`absolute relative flex items-center justify-between px-4
        rounded-md bg-white cursor-pointer select-none
        ${selected ? "border-2 border-blue-500" : "border border-gray-300"}
        hover:border-blue-400 transition-colors`}
        style={{
          height: NODE_HEIGHT,
          width: NODE_WIDTH,
        }}
      >
        {/* ===== Node content ===== */}
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

            {/* Right icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleNode(layout.data);
              }}
              className="ml-3 p-1.5 rounded hover:bg-gray-100 transition"
              title={isOpen ? "Remove from panel" : "Add to panel"}
            >
              {!layout.data.content ? (
                <PencilSquareIcon className="w-4 h-4 text-gray-400" />
              ) : isOpen ? (
                <EyeSlashIcon className="w-4 h-4 text-gray-400" />
              ) : (
                <EyeIcon className="w-4 h-4 text-blue-500" />
              )}
            </button>
          </>
        )}
      </div>
      {/* ===== Children count badge ===== */}
      {!editing && hasChildren && (
        <div
          onClick={(e) => {
            e.stopPropagation(); // ✅ stop bubbling to parent / eye button
            handleToggleChildren(layout);
          }}
          className={`absolute top-1/2 -translate-y-1/2
    flex items-center justify-center
    min-w-[22px] h-[22px] px-1
    text-xs font-medium rounded-full
    cursor-pointer select-none
    transition-all duration-200
    ${
      isOpen
        ? "bg-blue-500 text-white hover:bg-blue-600"
        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
    }`}
          style={{
            right: -36, // ✅ moved further right to avoid overlapping eye
          }}
          title={isOpen ? "Hide children" : "Show children"}
        >
          {childrenCount}
        </div>
      )}
    </div>
  );
}
