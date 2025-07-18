import React, { useState } from 'react';
import FormField from './FormField';
import Button from './Button';
import Card from './Card';
import Alert from './Alert';
import Modal from './Modal';
import MapLocationPicker from './MapLocationPicker';
import { useAppContext } from '../context/AppContext';

function ListingForm({ onAnalysisComplete }) {
  const { analyzeDevelopment, loading, error } = useAppContext();
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
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.listingText.trim()) {
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
  };

  return (
    <>
      <Card>
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
                onClick={() => setFormData({
                  listingText: '',
                  developmentName: '',
                  location: {
                    coordinates: [36.7820, -1.2921],
                    address: 'Kilimani, Nairobi'
                  },
                  manualInput: false
                })}
                disabled={loading}
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Analyze Development'}
              </Button>
            </div>
          </div>
        </form>
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