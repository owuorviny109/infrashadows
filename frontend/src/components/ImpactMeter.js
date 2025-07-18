import React from 'react';

function ImpactMeter({ 
  value, 
  label, 
  risk,
  className = '' 
}) {
  // Determine color based on value
  const getBarColor = () => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Determine risk badge color
  const getRiskColor = () => {
    if (risk === 'Low') return 'bg-green-100 text-green-800';
    if (risk === 'Medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className={`border p-3 rounded ${className}`}>
      <div className="flex justify-between">
        <span className="capitalize">{label}</span>
        {risk && (
          <span className={`px-2 py-1 text-xs rounded ${getRiskColor()}`}>
            {risk} Risk
          </span>
        )}
      </div>
      <div className="mt-2 bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${getBarColor()}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ImpactMeter;