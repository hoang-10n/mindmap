import { useEffect } from "react";
import { useMindMapStore } from "../../store/useMindMapStore";

export function useMindMapShortcuts() {
    const addChildNode = useMindMapStore((s: { addChildNode: any; }) => s.addChildNode);
    const deleteNode = useMindMapStore((s: { deleteNode: any; }) => s.deleteNode);
    const selectedNodeId = useMindMapStore((s: { selectedNodeId: any; }) => s.selectedNodeId);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) return;

            const key = e.key.toLowerCase();

            // Add child node
            if (key === "n") {
                console.log("Adding child node...");
                addChildNode();
                e.preventDefault();
            }

            // Delete selected node and its subtree
            if (key === "delete") {
                e.preventDefault();
                deleteNode();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [addChildNode, deleteNode, selectedNodeId]);
}