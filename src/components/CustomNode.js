import { Handle, Position } from "@xyflow/react";
import { useEffect, useRef, useState } from "react";

export function CustomNode({ data, id }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data.label);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  useEffect(() => {
    if (data._editTrigger) setEditing(true);
  }, [data._editTrigger]);

  const handleBlurOrEnter = () => {
    setEditing(false);
    data.onChange?.(value, id);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBlurOrEnter();
  };

  return (
    <div
      style={{
        padding: 10, // Increased padding
        width: 180,
        textAlign: "left",
        border: "1px solid #ccc",
        borderRadius: 6,
        background: "white",
        position: "relative",
      }}
    >
      {/* LEFT (incoming) */}
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        style={{ opacity: 0 }} // Hide dot
      />
      {/* RIGHT (outgoing) */}
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        style={{ opacity: 0 }} // Hide dot
      />

      {editing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlurOrEnter}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            border: "None",
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
