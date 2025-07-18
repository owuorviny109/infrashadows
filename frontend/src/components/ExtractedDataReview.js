import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import FormField from './FormField';
import Alert from './Alert';
import Badge from './Badge';

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
      
      // Add a flag to indicate the data was manually verified
      const confirmedData = {
        ...editedData,
        manuallyVerified: true
      };
      
      onConfirm(confirmedData);
    } else {
      onConfirm(extractedData);
    }
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
  
  // Get confidence badge for a field
  const getConfidenceBadge = (fieldName) => {
    // If we have field-level confidence, use it
    // Otherwise use the overall confidence score
    const confidence = 
      extractedData.fieldConfidence?.[fieldName] || 
      extractedData.confidenceScore || 
      0;
    
    if (confidence >= 80) {
      return <Badge variant="success" size="sm">High Confidence</Badge>;
    } else if (confidence >= 50) {
      return <Badge variant="warning" size="sm">Medium Confidence</Badge>;
    } else {
      return <Badge variant="danger" size="sm">Low Confidence</Badge>;
    }
  };
  
  // Get extraction method badge
  const getExtractionMethodBadge = () => {
    const method = extractedData.extractionMethod || 'unknown';
    
    switch (method) {
      case 'bedrock':
        return <Badge variant="primary" size="sm">AI Extracted</Badge>;
      case 'regex':
        return <Badge variant="info" size="sm">Pattern Matched</Badge>;
      case 'demo':
        return <Badge variant="secondary" size="sm">Demo Data</Badge>;
      default:
        return <Badge variant="default" size="sm">Unknown Method</Badge>;
    }
  };

  return (
    <Card 
      title={
        <div className="flex justify-between items-center">
          <span>Extracted Development Details</span>
          <div className="flex items-center space-x-2">
            {getExtractionMethodBadge()}
            <Badge 
              variant={extractedData.confidenceScore >= 70 ? "success" : 
                      extractedData.confidenceScore >= 50 ? "warning" : "danger"}
              size="sm"
            >
              {extractedData.confidenceScore}% Confidence
            </Badge>
          </div>
        </div>
      }
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
            value={editedData.amenities ? editedData.amenities.join(', ') : ''}
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
          
          {/* Additional fields for unit types if available */}
          {extractedData.unitTypes && extractedData.unitTypes.length > 0 && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Unit Types
              </label>
              <div className="border rounded-md p-3 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">
                  Unit type information will be preserved from the original extraction.
                </p>
                <ul className="list-disc pl-5 text-sm">
                  {extractedData.unitTypes.map((unitType, index) => (
                    <li key={index}>
                      {unitType.count} x {unitType.type}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Alert 
            type={extractedData.validation?.isValid ? "success" : "warning"} 
            className="mb-4"
          >
            {extractedData.validation?.isValid ? 
              "We've extracted the following details from your listing. Please verify they are correct." :
              "Some required information could not be extracted. Please review and edit the details."}
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-4 rounded bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Building Details</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p><strong>Floors:</strong> {extractedData.floors || 'Not detected'}</p>
                  {getConfidenceBadge('floors')}
                </div>
                <div className="flex justify-between items-center">
                  <p><strong>Units:</strong> {extractedData.units || 'Not detected'}</p>
                  {getConfidenceBadge('units')}
                </div>
                <div className="flex justify-between items-center">
                  <p><strong>Location:</strong> {extractedData.location || 'Not detected'}</p>
                  {getConfidenceBadge('location')}
                </div>
                
                {/* Unit types if available */}
                {extractedData.unitTypes && extractedData.unitTypes.length > 0 && (
                  <div>
                    <p className="font-medium mt-2">Unit Types:</p>
                    <ul className="list-disc pl-5 text-sm">
                      {extractedData.unitTypes.map((unitType, index) => (
                        <li key={index}>
                          {unitType.count} x {unitType.type}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="border p-4 rounded bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Features</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p><strong>Amenities:</strong></p>
                    {extractedData.amenities && extractedData.amenities.length > 0 ? (
                      <ul className="list-disc pl-5 text-sm">
                        {extractedData.amenities.map((amenity, index) => (
                          <li key={index}>{amenity}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">None detected</p>
                    )}
                  </div>
                  {getConfidenceBadge('amenities')}
                </div>
                <div className="flex justify-between items-center">
                  <p><strong>Parking:</strong> {extractedData.parkingSpaces ? `${extractedData.parkingSpaces} spaces` : 'Not detected'}</p>
                  {getConfidenceBadge('parkingSpaces')}
                </div>
                
                {/* Other features if available */}
                {extractedData.otherFeatures && extractedData.otherFeatures.length > 0 && (
                  <div className="flex justify-between items-start">
                    <div>
                      <p><strong>Other Features:</strong></p>
                      <ul className="list-disc pl-5 text-sm">
                        {extractedData.otherFeatures.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    {getConfidenceBadge('otherFeatures')}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Missing fields warning */}
          {extractedData.validation?.missingFields && 
           extractedData.validation.missingFields.length > 0 && (
            <Alert type="warning" className="mt-4">
              <p className="font-medium">Missing Required Information:</p>
              <ul className="list-disc pl-5 text-sm mt-1">
                {extractedData.validation.missingFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
              <p className="text-sm mt-2">Please click "Edit Details" to add the missing information.</p>
            </Alert>
          )}
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
          disabled={!editMode && extractedData.validation?.missingFields?.length > 0}
        >
          {editMode ? 'Save Changes' : 'Confirm & Continue'}
        </Button>
      </div>
    </Card>
  );
}

export default ExtractedDataReview;