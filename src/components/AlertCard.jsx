import React from 'react';
import { AlertTriangle } from 'lucide-react';

function AlertCard({ type, message, severity, timestamp, onResolve }) {
  const severityStyles = {
    high: 'bg-red-50 border-red-300 text-red-800',
    medium: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    low: 'bg-blue-50 border-blue-300 text-blue-800'
  };

  return (
    <div className={`border-l-4 rounded-lg p-4 mb-3 ${severityStyles[severity]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 mr-3 mt-1" />
          <div>
            <h4 className="font-semibold">{type}</h4>
            <p className="text-sm mt-1">{message}</p>
            <p className="text-xs mt-2 opacity-75">{timestamp}</p>
          </div>
        </div>
        <button 
          onClick={onResolve}
          className="px-3 py-1 bg-white rounded text-sm font-medium hover:bg-gray-100 transition"
        >
          Resolve
        </button>
      </div>
    </div>
  );
}

export default AlertCard;