import { useEffect } from "react";
import { useMindMapStore } from "../../store/useMindMapStore";

export function useZoom(ref: React.RefObject<HTMLDivElement | null>) {
  const zoom = useMindMapStore((s) => s.zoom);
  const setZoom = useMindMapStore((s) => s.setZoom);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;

      setZoom(Math.min(Math.max(zoom + delta, 0.2), 3));
    };

    const el = ref.current;
    if (el) el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (el) el.removeEventListener("wheel", handleWheel);
    };
  }, [ref, zoom, setZoom]);

  return { zoom };
}
