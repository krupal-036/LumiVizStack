import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Panel, useNodesState, useEdgesState } from 'reactflow';
import dagre from 'dagre';
import { FiLayout, FiSidebar } from 'react-icons/fi';
import 'reactflow/dist/style.css';

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 50 });

  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: 180, height: 40 }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: nodeWithPosition.x - 90, y: nodeWithPosition.y - 20 },
    };
  });
};

const FlowTreeView = ({ data = {} }) => {
  const [direction, setDirection] = useState('LR');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const nodesArr = [];
    const edgesArr = [];

    const traverse = (obj, parentId = null) => {
      Object.entries(obj).forEach(([key, value]) => {
        const id = parentId ? `${parentId}-${key}` : key;
        const isParent = value !== null && typeof value === 'object';

        nodesArr.push({
          id,
          data: { label: isParent ? key : `${key}: ${value}` },
          className: `px-4 py-2 rounded-xl border-2 text-[11px] font-bold transition-all duration-500 shadow-sm
            ${isParent
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'}`,
        });

        if (parentId) {
          edgesArr.push({
            id: `e-${parentId}-${id}`,
            source: parentId,
            target: id,
            animated: true,
            className: 'stroke-indigo-400/50 dark:stroke-indigo-500/30',
          });
        }
        if (isParent) traverse(value, id);
      });
    };

    traverse(data);
    const layoutedNodes = getLayoutedElements(nodesArr, edgesArr, direction);
    setNodes(layoutedNodes);
    setEdges(edgesArr);
  }, [data, direction, setNodes, setEdges]);

  const onLayout = useCallback((dir) => {
    setDirection(dir);
  }, []);

  return (
    <div className="group relative w-full h-[600px] rounded-[2rem] border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 shadow-2xl overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background gap={20} size={1} className="opacity-10" />

        <Panel position="top-right" className="flex gap-2 p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl">
          <button
            onClick={() => onLayout('LR')}
            className={`p-2 rounded-lg ${direction === 'LR' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
          >
            <FiSidebar className="w-4 h-4" />
          </button>
          <button
            onClick={() => onLayout('TB')}
            className={`p-2 rounded-lg ${direction === 'TB' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
          >
            <FiLayout className="w-4 h-4" />
          </button>
        </Panel>

        <Controls />
        <MiniMap
          nodeColor={(n) => n.className?.includes('indigo-600') ? '#6366f1' : '#cbd5e1'}
        />
      </ReactFlow>
    </div>
  );
};

export default FlowTreeView;
