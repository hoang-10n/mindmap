import { useEffect, useRef, useState } from "react";
import { CONTENT_NODE_WIDTH, NO_CONTENT_NODE_WIDTH, NODE_HEIGHT } from "../types/mindMapConst";
import type { CustomNodeProps } from "../types/mindMapTypes";

export function CustomNode({ id, data, position, selected, onSelect }: CustomNodeProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(data.label);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleBlurOrEnter = () => {
    setEditing(false);
    data.onChange?.(value, id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleBlurOrEnter();
  };

  return (
    <div
      onClick={() => onSelect?.(id)}
      onDoubleClick={() => setEditing(true)} // <-- double-click to edit
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        padding: 10,
        height: NODE_HEIGHT,
        width: data.content? CONTENT_NODE_WIDTH : NO_CONTENT_NODE_WIDTH,
        alignContent: "center",
        textAlign: "left",
        border: selected ? "2px solid blue" : "1px solid #ccc",
        borderRadius: 6,
        background: "white",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlurOrEnter}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            borderBottom: "1px solid red",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      ) : (
        value
      )}
    </div>
  );
}