import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { FiMaximize2, FiLayers } from 'react-icons/fi';

const parseToGraph = (data) => {
  const nodes = [];
  const links = [];

  const traverse = (currentData, parentId = null, keyName = 'Root') => {
    const isArray = Array.isArray(currentData);
    const isObject = currentData !== null && typeof currentData === 'object' && !isArray;
    const nodeId = `node-${nodes.length}-${keyName}`;

    const color = isArray ? '#F59E0B' : isObject ? '#6366F1' : '#10B981';

    nodes.push({
      id: nodeId,
      name: keyName,
      type: isArray ? 'Array' : isObject ? 'Object' : 'Value',
      color,
      val: isObject || isArray ? 12 : 6
    });

    if (parentId !== null) links.push({ source: parentId, target: nodeId });

    if (isObject || isArray) {
      Object.entries(currentData).forEach(([key, value]) => traverse(value, nodeId, key));
    } else {
      const valStr = String(currentData);
      const valueId = `val-${nodes.length}-${valStr}`;
      nodes.push({
        id: valueId,
        name: valStr.length > 15 ? valStr.substring(0, 15) + '...' : valStr,
        fullName: valStr,
        type: 'Leaf',
        color: '#64748b',
        val: 4
      });
      links.push({ source: nodeId, target: valueId });
    }
  };

  traverse(data);
  return { nodes, links };
};

const GraphView = ({ data }) => {
  const fgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedNode, setSelectedNode] = useState(null);

  const graphData = useMemo(() => parseToGraph(data), [data]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) setDimensions({ width: entries[0].contentRect.width, height: 600 });
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 600);
      fgRef.current.zoom(2, 600);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[600px] bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">

      <div className="absolute top-4 left-4 z-10 w-64">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
            <FiLayers size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Node Inspector</span>
          </div>
          {selectedNode ? (
            <div className="space-y-2">
              <div className="text-lg font-bold text-gray-900 dark:text-white truncate">{selectedNode.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{selectedNode.type}</div>
              {selectedNode.fullName && <div className="text-xs font-mono bg-gray-100 dark:bg-gray-900 p-2 rounded break-all">{selectedNode.fullName}</div>}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">Click a node to inspect.</p>
          )}
        </div>
      </div>

      {dimensions.width > 0 && (
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          backgroundColor="transparent"
          nodeRelSize={8}
          linkColor={() => '#d1d5db'}
          linkWidth={2}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          onNodeClick={handleNodeClick}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            const r = Math.sqrt(Math.max(0, node.val || 1)) * 4;

            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = node.color;
            ctx.fill();

            if (selectedNode?.id === node.id) {
              ctx.strokeStyle = '#1f2937';
              ctx.lineWidth = 2 / globalScale;
              ctx.stroke();
            }

            if (globalScale > 0.8) {
              ctx.font = `${fontSize}px Inter, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#1f2937';
              ctx.fillText(label, node.x, node.y + r + fontSize);
            }
          }}
        />
      )}

      <div className="absolute bottom-4 right-4">
        <button onClick={() => fgRef.current?.zoomToFit(400)} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <FiMaximize2 className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default GraphView;