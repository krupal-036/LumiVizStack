import React from 'react';

const TreeView = ({ data }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-xl overflow-auto max-h-[600px] border border-gray-800 shadow-lg">
      <pre className="text-xs text-blue-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default TreeView;