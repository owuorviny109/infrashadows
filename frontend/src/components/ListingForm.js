import React, { useState } from 'react';
import FormField from './FormField';
import Button from './Button';
import Card from './Card';
import Alert from './Alert';
import Modal from './Modal';
import MapLocationPicker from './MapLocationPicker';
import ExtractionModeSelector from './ExtractionModeSelector';
import { useAppContext } from '../context/AppContext';

function ListingForm({ onAnalysisComplete }) {
  const { analyzeDevelopment, extractData, loading, error, extractionMode } = useAppContext();
  const [formData, setFormData] = useState({
    listingText: '',
    developmentName: '',
    location: {
      coordinates: [36.7820, -1.2921], // Default Kilimani coordinates
      address: 'Kilimani, Nairobi'
    },
    manualInput: false
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [extractionStep, setExtractionStep] = useState('input'); // 'input', 'extracting', 'review'
  const [extractedData, setExtractedData] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle location selection from map
  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
    setShowLocationPicker(false);
  };

  // Toggle between automatic extraction and manual input
  const toggleManualInput = () => {
    setFormData(prev => ({
      ...prev,
      manualInput: !prev.manualInput
    }));
    
    // Reset extraction step when toggling
    setExtractionStep('input');
    setExtractedData(null);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.listingText.trim() && !formData.manualInput) {
      errors.listingText = 'Listing text is required';
    }
    
    if (formData.manualInput) {
      if (!formData.developmentName.trim()) {
        errors.developmentName = 'Development name is required';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle extraction
  const handleExtract = async () => {
    if (!validateForm()) {
      return;
    }
    
    setExtractionStep('extracting');
    
    try {
      // Extract data from listing text
      const data = await extractData(formData.listingText);
      
      if (data) {
        setExtractedData(data);
        setExtractionStep('review');
      } else {
        // If extraction failed, go back to input
        setExtractionStep('input');
      }
    } catch (err) {
      console.error('Extraction error:', err);
      setExtractionStep('input');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.manualInput) {
      // For manual input, go directly to analysis
      if (!validateForm()) {
        return;
      }
      
      try {
        const result = await analyzeDevelopment(formData.listingText);
        
        if (result && onAnalysisComplete) {
          onAnalysisComplete(result);
        }
      } catch (err) {
        console.error('Analysis error:', err);
      }
    } else {
      // For AI extraction, first extract data
      await handleExtract();
    }
  };

  // Handle confirmation of extracted data
  const handleConfirmExtraction = async (confirmedData) => {
    try {
      // Use the confirmed data for analysis
      const result = await analyzeDevelopment(formData.listingText);
      
      if (result && onAnalysisComplete) {
        // In a real implementation, we would update the result with the confirmed data
        onAnalysisComplete({
          ...result,
          extractedData: confirmedData
        });
      }
    } catch (err) {
      console.error('Analysis error:', err);
    }
  };

  // Reset the form
  const handleReset = () => {
    setFormData({
      listingText: '',
      developmentName: '',
      location: {
        coordinates: [36.7820, -1.2921],
        address: 'Kilimani, Nairobi'
      },
      manualInput: false
    });
    setExtractionStep('input');
    setExtractedData(null);
    setValidationErrors({});
  };

  // Render different content based on extraction step
  const renderContent = () => {
    switch (extractionStep) {
      case 'extracting':
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-lg">Extracting development details...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
          </div>
        );
      
      case 'review':
        return extractedData ? (
          <div className="space-y-4">
            <Alert type="success" className="mb-4">
              We've extracted the following details from your listing. Please review and confirm.
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-4 rounded bg-gray-50">
                <h3 className="font-semibold mb-2">Building Details</h3>
                <div className="space-y-2">
                  <p><strong>Floors:</strong> {extractedData.floors || 'Not detected'}</p>
                  <p><strong>Units:</strong> {extractedData.units || 'Not detected'}</p>
                  <p><strong>Location:</strong> {extractedData.location || 'Not detected'}</p>
                </div>
              </div>
              <div className="border p-4 rounded bg-gray-50">
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="space-y-2">
                  <p><strong>Amenities:</strong> {extractedData.amenities?.join(', ') || 'None detected'}</p>
                  <p><strong>Parking:</strong> {extractedData.parkingSpaces ? `${extractedData.parkingSpaces} spaces` : 'Not detected'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setExtractionStep('input')}
              >
                Back to Input
              </Button>
              <Button
                onClick={() => handleConfirmExtraction(extractedData)}
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Confirm & Analyze'}
              </Button>
            </div>
          </div>
        ) : (
          <Alert type="error" className="mb-4">
            Failed to extract data. Please try again or enter details manually.
          </Alert>
        );
      
      case 'input':
      default:
        return (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">Development Details</h3>
                <Button 
                  type="button" 
                  variant="link" 
                  size="sm" 
                  onClick={toggleManualInput}
                >
                  {formData.manualInput ? 'Use AI Extraction' : 'Enter Details Manually'}
                </Button>
              </div>
              
              {!formData.manualInput ? (
                <>
                  <FormField
                    label="Real Estate Listing or Development Description"
                    id="listingText"
                    name="listingText"
                    type="textarea"
                    value={formData.listingText}
                    onChange={handleChange}
                    placeholder="Paste the real estate listing or development description here..."
                    required
                    error={validationErrors.listingText}
                    helpText="Example: 'New 12-storey apartment building with 48 units in Kilimani, featuring a swimming pool and gym.'"
                  />
                  
                  <div className="mt-4">
                    <ExtractionModeSelector />
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <FormField
                    label="Development Name"
                    id="developmentName"
                    name="developmentName"
                    value={formData.developmentName}
                    onChange={handleChange}
                    placeholder="Enter the name of the development"
                    required
                    error={validationErrors.developmentName}
                  />
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Location
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={formData.location.address}
                        className="flex-grow border rounded-l-md p-2 bg-gray-50"
                        readOnly
                      />
                      <Button
                        type="button"
                        className="rounded-l-none"
                        onClick={() => setShowLocationPicker(true)}
                      >
                        Select on Map
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Number of Floors"
                      id="floors"
                      name="floors"
                      type="number"
                      min="1"
                      placeholder="Enter number of floors"
                    />
                    
                    <FormField
                      label="Number of Units"
                      id="units"
                      name="units"
                      type="number"
                      min="1"
                      placeholder="Enter number of units"
                    />
                  </div>
                  
                  <FormField
                    label="Amenities"
                    id="amenities"
                    name="amenities"
                    placeholder="Enter amenities (comma separated)"
                    helpText="Example: Swimming Pool, Gym, Security, Parking"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                {error && (
                  <Alert type="error" className="mb-0 py-1 text-sm">
                    {error}
                  </Alert>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : formData.manualInput ? 'Analyze Development' : 'Extract & Analyze'}
                </Button>
              </div>
            </div>
          </form>
        );
    }
  };

  return (
    <>
      <Card>
        {renderContent()}
      </Card>
      
      {/* Location Picker Modal */}
      <Modal
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        title="Select Development Location"
        size="lg"
      >
        <MapLocationPicker
          initialLocation={formData.location.coordinates}
          onLocationSelect={handleLocationSelect}
          height="h-96"
        />
      </Modal>
    </>
  );
}

export default ListingForm;