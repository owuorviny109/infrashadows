import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import MapPreview from '../components/MapPreview';
import ListingForm from '../components/ListingForm';
import ExtractedDataReview from '../components/ExtractedDataReview';
import Badge from '../components/Badge';
import { useAppContext } from '../context/AppContext';

function AnalysisPage() {
  const navigate = useNavigate();
  const { loading, error, resetError, extractionMode } = useAppContext();
  const [results, setResults] = useState(null);
  const [mapPreviewData, setMapPreviewData] = useState(null);
  const [analysisStep, setAnalysisStep] = useState('input'); // 'input', 'review', 'results'

  const handleAnalysisComplete = (result) => {
    setResults(result);
    setAnalysisStep('review');
    
    // Create map preview data
    setMapPreviewData({
      development: {
        id: result.id,
        name: result.extractedData.developmentName || 'Analyzed Development',
        coordinates: [36.7820, -1.2921], // Default Kilimani coordinates for demo
      },
      shadows: [
        {
          id: result.id,
          type: 'water',
          coordinates: [36.7820, -1.2921],
          radius: 300 * (result.infrastructureImpact.water.score / 100),
          opacity: 0.4,
          intensity: result.infrastructureImpact.water.risk.toLowerCase()
        },
        {
          id: result.id,
          type: 'power',
          coordinates: [36.7820, -1.2921],
          radius: 300 * (result.infrastructureImpact.power.score / 100),
          opacity: 0.4,
          intensity: result.infrastructureImpact.power.risk.toLowerCase()
        },
        {
          id: result.id,
          type: 'drainage',
          coordinates: [36.7820, -1.2921],
          radius: 300 * (result.infrastructureImpact.drainage.score / 100),
          opacity: 0.4,
          intensity: result.infrastructureImpact.drainage.risk.toLowerCase()
        }
      ]
    });
  };

  const handleDataConfirm = (confirmedData) => {
    // In a real implementation, we would update the results with the confirmed data
    setResults(prev => ({
      ...prev,
      extractedData: {
        ...confirmedData,
        manuallyVerified: true
      }
    }));
    
    // Move to results step
    setAnalysisStep('results');
  };

  const handleViewReport = () => {
    navigate(`/report/${results.id}`);
  };

  const handleViewMap = () => {
    navigate('/map');
  };

  const handleStartOver = () => {
    setResults(null);
    setMapPreviewData(null);
    setAnalysisStep('input');
  };

  // Render different content based on analysis step
  const renderContent = () => {
    switch (analysisStep) {
      case 'review':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Review Extracted Data</h2>
              <Badge 
                variant={extractionMode === 'bedrock' ? 'primary' : 'secondary'}
              >
                {extractionMode === 'bedrock' ? 'AI Extraction' : 'Demo Mode'}
              </Badge>
            </div>
            
            <ExtractedDataReview
              extractedData={results.extractedData}
              onConfirm={handleDataConfirm}
              onEdit={() => {}}
              className="mb-6"
            />
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleStartOver}
              >
                Start Over
              </Button>
            </div>
          </>
        );
        
      case 'results':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Analysis Results</h2>
              <Badge 
                variant={results.extractedData.manuallyVerified ? 'success' : 'warning'}
              >
                {results.extractedData.manuallyVerified ? 'Verified Data' : 'Unverified Data'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card title="Infrastructure Impact Analysis">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-4 rounded bg-gray-50">
                      <h3 className="font-semibold mb-2">Infrastructure Impact</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Water Impact</span>
                            <span className={`px-1 rounded ${
                              results.infrastructureImpact.water.risk === 'Low' ? 'bg-green-100 text-green-800' : 
                              results.infrastructureImpact.water.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {results.infrastructureImpact.water.risk}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                            <div 
                              className="h-2 bg-water-500 rounded-full" 
                              style={{ width: `${results.infrastructureImpact.water.score}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex justify-between">
                            <span>{results.infrastructureImpact.water.dailyDemandLiters?.toLocaleString() || '0'} L/day</span>
                            <span>{results.infrastructureImpact.water.strainPercentage || '0'}% of capacity</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Power Impact</span>
                            <span className={`px-1 rounded ${
                              results.infrastructureImpact.power.risk === 'Low' ? 'bg-green-100 text-green-800' : 
                              results.infrastructureImpact.power.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {results.infrastructureImpact.power.risk}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                            <div 
                              className="h-2 bg-power-500 rounded-full" 
                              style={{ width: `${results.infrastructureImpact.power.score}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Drainage Impact</span>
                            <span className={`px-1 rounded ${
                              results.infrastructureImpact.drainage.risk === 'Low' ? 'bg-green-100 text-green-800' : 
                              results.infrastructureImpact.drainage.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {results.infrastructureImpact.drainage.risk}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                            <div 
                              className="h-2 bg-drainage-500 rounded-full" 
                              style={{ width: `${results.infrastructureImpact.drainage.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border p-4 rounded bg-gray-50">
                      <h3 className="font-semibold mb-2">Next Steps</h3>
                      <p className="mb-4">View the full analysis report or explore the impact on the map.</p>
                      <div className="space-y-2">
                        <Button variant="success" onClick={handleViewReport} className="w-full">
                          View Full Report
                        </Button>
                        <Button variant="secondary" onClick={handleViewMap} className="w-full">
                          View on Map
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card title="Development Summary" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Building Details</h3>
                      <ul className="space-y-1">
                        <li><strong>Floors:</strong> {results.extractedData.floors}</li>
                        <li><strong>Units:</strong> {results.extractedData.units}</li>
                        <li><strong>Location:</strong> {results.extractedData.location}</li>
                        {results.extractedData.parkingSpaces && (
                          <li><strong>Parking:</strong> {results.extractedData.parkingSpaces} spaces</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Amenities</h3>
                      {results.extractedData.amenities && results.extractedData.amenities.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {results.extractedData.amenities.map((amenity, index) => (
                            <li key={index}>{amenity}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No amenities detected</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAnalysisStep('review')}
                    >
                      Edit Development Details
                    </Button>
                  </div>
                </Card>
              </div>
              
              <div>
                {mapPreviewData && (
                  <MapPreview 
                    development={mapPreviewData.development}
                    shadows={mapPreviewData.shadows}
                    height="h-80"
                  />
                )}
                
                <Card title="Legitimacy Score" className="mt-6">
                  <div className="flex items-center justify-center py-4">
                    <div className={`text-3xl font-bold w-24 h-24 rounded-full flex items-center justify-center ${
                      results.legitimacyScore >= 70 ? 'bg-green-100 text-green-800' : 
                      results.legitimacyScore >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {results.legitimacyScore}
                    </div>
                  </div>
                  <p className="text-center">
                    {results.legitimacyScore >= 70 ? 'Good Standing' : 
                     results.legitimacyScore >= 50 ? 'Needs Attention' : 
                     'Critical Issues'}
                  </p>
                  <p className="text-sm text-gray-600 text-center mt-1">
                    Based on infrastructure impact, zoning compliance, and community participation
                  </p>
                </Card>
              </div>
            </div>
          </>
        );
        
      case 'input':
      default:
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">Analyze Development</h1>
            
            {error && (
              <Alert type="error" className="mb-4" dismissible onDismiss={resetError}>
                {error}
              </Alert>
            )}
            
            <div className="mb-8">
              <ListingForm onAnalysisComplete={handleAnalysisComplete} />
            </div>

            {loading && (
              <Card className="text-center py-8">
                <Loader size="lg" className="mb-4" />
                <p className="text-lg">Analyzing development details...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
              </Card>
            )}
          </>
        );
    }
  };

  return (
    <Container>
      {renderContent()}
    </Container>
  );
}

export default AnalysisPage;