import { useEffect, useState } from "react";

export function useZoom(ref: React.RefObject<HTMLDivElement | null>) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      setZoom((z) => Math.min(Math.max(z + delta, 0.2), 3));
    };

    const el = ref.current;
    if (el) el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (el) el.removeEventListener("wheel", handleWheel);
    };
  }, [ref]);

  return { zoom, setZoom };
}