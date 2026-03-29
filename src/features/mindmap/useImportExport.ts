import { exportTree, importTree } from "../../utils/treeIO";

export function useImportExport(nodes: any, setNodes: any) {
  const handleExport = () => {
    const tree = exportTree(nodes);
    if (!tree) return;

    const blob = new Blob([JSON.stringify(tree, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mindmap.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = JSON.parse(event.target?.result as string);
      setNodes(importTree(json));
    };

    reader.readAsText(file);
  };

  return { handleExport, handleImport };
}