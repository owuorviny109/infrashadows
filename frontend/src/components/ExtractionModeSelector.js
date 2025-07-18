import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Alert from './Alert';
import { useAppContext } from '../context/AppContext';

/**
 * Component for selecting and displaying the extraction mode
 * Helps users understand when AI extraction is being used vs. regex fallback
 */
function ExtractionModeSelector({ className = '' }) {
  const { extractionMode, setExtractionMode } = useAppContext();
  const [showInfo, setShowInfo] = useState(false);
  
  // Usage statistics (would come from API in a real implementation)
  const [usageStats, setUsageStats] = useState({
    currentMonthCalls: 0,
    monthlyLimit: 10,
    remainingCalls: 10,
    cacheHits: 0
  });

  const handleModeChange = (mode) => {
    setExtractionMode(mode);
  };

  return (
    <Card className={`${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Extraction Mode</h3>
        <Button 
          variant="link" 
          size="sm" 
          onClick={() => setShowInfo(!showInfo)}
        >
          {showInfo ? 'Hide Info' : 'What is this?'}
        </Button>
      </div>
      
      {showInfo && (
        <Alert type="info" className="mb-4">
          <p className="text-sm">
            <strong>Demo Mode:</strong> Uses pre-processed examples and pattern matching. Fast and free, but less accurate.
          </p>
          <p className="text-sm mt-1">
            <strong>AI Mode:</strong> Uses AWS Bedrock with Claude 3 Sonnet for more accurate extraction, but has usage limits to stay within free tier.
          </p>
        </Alert>
      )}
      
      <div className="flex space-x-2 mb-4">
        <Button
          variant={extractionMode === 'demo' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => handleModeChange('demo')}
        >
          Demo Mode
        </Button>
        <Button
          variant={extractionMode === 'bedrock' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => handleModeChange('bedrock')}
          disabled={usageStats.remainingCalls <= 0}
        >
          AI Mode {usageStats.remainingCalls <= 0 ? '(Limit Reached)' : ''}
        </Button>
      </div>
      
      {extractionMode === 'bedrock' && (
        <div className="bg-gray-50 p-3 rounded border text-sm">
          <p className="font-medium mb-1">AI Usage This Month</p>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{usageStats.currentMonthCalls} of {usageStats.monthlyLimit} calls used</span>
            <span>{usageStats.remainingCalls} remaining</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div 
              className={`h-2 rounded-full ${
                usageStats.remainingCalls > 5 ? 'bg-green-500' : 
                usageStats.remainingCalls > 0 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${(usageStats.currentMonthCalls / usageStats.monthlyLimit) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Cache hits: {usageStats.cacheHits} (saved API calls)
          </p>
        </div>
      )}
      
      {extractionMode === 'demo' && (
        <p className="text-xs text-gray-500">
          Using demo mode to stay within free tier limits. For best results, provide clear and detailed listing information.
        </p>
      )}
    </Card>
  );
}

export default ExtractionModeSelector;