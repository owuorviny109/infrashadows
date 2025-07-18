import React from 'react';

function LegitimacyScore({ score, size = 'md', className = '' }) {
  // Determine color based on score
  const getColorClass = () => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Determine status text based on score
  const getStatusText = () => {
    if (score >= 70) return 'Good Standing';
    if (score >= 50) return 'Needs Attention';
    return 'Critical Issues';
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-lg w-12 h-12',
    md: 'text-2xl w-16 h-16',
    lg: 'text-3xl w-20 h-20',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${getColorClass()} ${sizeClasses[size]} font-bold rounded-full flex items-center justify-center`}>
        {score}
      </div>
      <div className="ml-4">
        <p className="font-medium">{getStatusText()}</p>
        <p className="text-sm text-gray-600">
          Based on infrastructure impact, zoning compliance, and community participation
        </p>
      </div>
    </div>
  );
}

export default LegitimacyScore;