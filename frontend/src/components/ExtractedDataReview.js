import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import FormField from './FormField';
import Alert from './Alert';

function ExtractedDataReview({ 
  extractedData, 
  onConfirm, 
  onEdit,
  className = '' 
}) {
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({ ...extractedData });
  const [validationErrors, setValidationErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle amenities input (comma-separated)
  const handleAmenitiesChange = (e) => {
    const amenitiesString = e.target.value;
    const amenitiesArray = amenitiesString
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    setEditedData(prev => ({
      ...prev,
      amenities: amenitiesArray
    }));
  };

  // Validate form before confirming
  const validateForm = () => {
    const errors = {};
    
    if (!editedData.floors || editedData.floors <= 0) {
      errors.floors = 'Please enter a valid number of floors';
    }
    
    if (!editedData.units || editedData.units <= 0) {
      errors.units = 'Please enter a valid number of units';
    }
    
    if (!editedData.location || editedData.location.trim() === '') {
      errors.location = 'Location is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle confirm button click
  const handleConfirm = () => {
    if (editMode) {
      if (!validateForm()) {
        return;
      }
    }
    
    onConfirm(editMode ? editedData : extractedData);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // Reset to original data if canceling edit
      setEditedData({ ...extractedData });
      setValidationErrors({});
    } else if (onEdit) {
      onEdit();
    }
    
    setEditMode(!editMode);
  };

  return (
    <Card 
      title="Extracted Development Details" 
      className={className}
    >
      {editMode ? (
        <div className="space-y-4">
          <Alert type="info" className="mb-4">
            Please review and correct the extracted information if needed.
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Number of Floors"
              id="floors"
              name="floors"
              type="number"
              min="1"
              value={editedData.floors}
              onChange={handleChange}
              error={validationErrors.floors}
              required
            />
            
            <FormField
              label="Number of Units"
              id="units"
              name="units"
              type="number"
              min="1"
              value={editedData.units}
              onChange={handleChange}
              error={validationErrors.units}
              required
            />
          </div>
          
          <FormField
            label="Location"
            id="location"
            name="location"
            value={editedData.location}
            onChange={handleChange}
            error={validationErrors.location}
            required
          />
          
          <FormField
            label="Amenities"
            id="amenitiesString"
            name="amenitiesString"
            value={editedData.amenities.join(', ')}
            onChange={handleAmenitiesChange}
            helpText="Enter amenities separated by commas"
          />
          
          <FormField
            label="Parking Spaces"
            id="parkingSpaces"
            name="parkingSpaces"
            type="number"
            min="0"
            value={editedData.parkingSpaces}
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <Alert type="success" className="mb-4">
            We've extracted the following details from your listing. Please verify they are correct.
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-semibold mb-2">Building Details</h3>
              <div className="space-y-2">
                <p><strong>Floors:</strong> {extractedData.floors}</p>
                <p><strong>Units:</strong> {extractedData.units}</p>
                <p><strong>Location:</strong> {extractedData.location}</p>
              </div>
            </div>
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-semibold mb-2">Features</h3>
              <div className="space-y-2">
                <p><strong>Amenities:</strong> {extractedData.amenities.join(', ')}</p>
                <p><strong>Parking:</strong> {extractedData.parkingSpaces} spaces</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={toggleEditMode}
        >
          {editMode ? 'Cancel' : 'Edit Details'}
        </Button>
        <Button
          onClick={handleConfirm}
        >
          {editMode ? 'Save Changes' : 'Confirm & Continue'}
        </Button>
      </div>
    </Card>
  );
}

export default ExtractedDataReview;