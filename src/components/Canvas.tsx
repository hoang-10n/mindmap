import { CustomNode } from "./CustomNode";

export function Canvas({
    nodes,
    edges,
    zoom,
    offset,
    selectedNodeId,
    setSelectedNodeId,
    onOpenNode,
}: any) {
    return (
        <>
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                    backgroundPosition: `${offset.x}px ${offset.y}px`,
                }}
            />

            <div className="flex-1">
                <div
                    className="absolute top-0 left-0 origin-top-left"
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    }}
                >
                    <svg className="absolute overflow-visible pointer-events-none">
                        {edges.map((e: any) => (
                            <line
                                key={e.id}
                                x1={e.sourcePosition.x}
                                y1={e.sourcePosition.y}
                                x2={e.targetPosition.x}
                                y2={e.targetPosition.y}
                                stroke="#999"
                                strokeWidth={2 / zoom}
                            />
                        ))}
                    </svg>
                    {nodes.map((node: any) => (
                        <div
                            key={node.data.id}
                            className="absolute"
                            style={{ left: node.position.x, top: node.position.y }}
                        >
                            <CustomNode
                                layout={node}
                                selected={selectedNodeId === node.data.id}
                                onSelect={setSelectedNodeId}
                                handleOpenNode={onOpenNode}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}