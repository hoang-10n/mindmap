import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MinusIcon,
    PlusIcon,
} from "@heroicons/react/16/solid";

export function Controls({
    zoom,
    onExport,
    onImport,
    showPanel,
    togglePanel,
}: any) {
    return (

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 px-4 py-2 rounded-lg shadow-md z-10">
        <button
          onClick={onExport}
          className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Export
        </button>

        <label className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 cursor-pointer">
          Import
          <input
            type="file"
            accept="application/json"
            onChange={onImport}
            className="hidden"
          />
        </label>


        {/* Toggle panel icon */}
        <button
          onClick={togglePanel}
          className="p-1 hover:bg-gray-100 rounded transition"
          title={showPanel.se ? "Hide panel" : "Show panel"}
        >
          {showPanel.se ? (
            <ChevronRightIcon className="w-4 h-4" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4" />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Zoom controls */}
        <button
          onClick={() => zoom.setZoom((z: number) => Math.max(z - 0.1, 0.2))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <MinusIcon className="w-4 h-4" />
        </button>

        <span className="text-sm font-medium">
          {Math.round(zoom.zoom * 100)}%
        </span>

        <button
          onClick={() => zoom.setZoom((z: number) => Math.min(z + 0.1, 3))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <PlusIcon className="w-4 h-4" />
        </button>

      </div>
    );
}