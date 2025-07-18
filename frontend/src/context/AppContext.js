import React, { createContext, useContext, useReducer } from 'react';
import { extractData as extractDataService } from '../services/extractionService';
import { calculateWaterDemand, calculateWaterDemandScore } from '../utils/waterDemandUtils';

// Create context
const AppContext = createContext();

// Initial state
const initialState = {
  developments: [],
  selectedDevelopment: null,
  mapLayers: {
    water: true,
    power: true,
    drainage: true,
    zoning: true
  },
  loading: false,
  error: null,
  extractionMode: 'demo', // 'demo', 'regex', or 'bedrock'
  extractedData: null
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_DEVELOPMENT: 'ADD_DEVELOPMENT',
  SELECT_DEVELOPMENT: 'SELECT_DEVELOPMENT',
  TOGGLE_MAP_LAYER: 'TOGGLE_MAP_LAYER',
  RESET_ERROR: 'RESET_ERROR',
  SET_EXTRACTION_MODE: 'SET_EXTRACTION_MODE',
  SET_EXTRACTED_DATA: 'SET_EXTRACTED_DATA',
  UPDATE_EXTRACTED_DATA: 'UPDATE_EXTRACTED_DATA'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ActionTypes.RESET_ERROR:
      return { ...state, error: null };
    case ActionTypes.ADD_DEVELOPMENT:
      return { 
        ...state, 
        developments: [...state.developments, action.payload],
        selectedDevelopment: action.payload
      };
    case ActionTypes.SELECT_DEVELOPMENT:
      return { ...state, selectedDevelopment: action.payload };
    case ActionTypes.TOGGLE_MAP_LAYER:
      return { 
        ...state, 
        mapLayers: { 
          ...state.mapLayers, 
          [action.payload]: !state.mapLayers[action.payload] 
        } 
      };
    case ActionTypes.SET_EXTRACTION_MODE:
      return { ...state, extractionMode: action.payload };
    case ActionTypes.SET_EXTRACTED_DATA:
      return { ...state, extractedData: action.payload };
    case ActionTypes.UPDATE_EXTRACTED_DATA:
      return { 
        ...state, 
        extractedData: { 
          ...state.extractedData, 
          ...action.payload,
          // Update validation status if data was manually edited
          validation: {
            ...state.extractedData.validation,
            isValid: true,
            manuallyVerified: true
          }
        } 
      };
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const setLoading = (isLoading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const resetError = () => {
    dispatch({ type: ActionTypes.RESET_ERROR });
  };

  const addDevelopment = (development) => {
    dispatch({ type: ActionTypes.ADD_DEVELOPMENT, payload: development });
  };

  const selectDevelopment = (development) => {
    dispatch({ type: ActionTypes.SELECT_DEVELOPMENT, payload: development });
  };

  const toggleMapLayer = (layer) => {
    dispatch({ type: ActionTypes.TOGGLE_MAP_LAYER, payload: layer });
  };
  
  const setExtractionMode = (mode) => {
    dispatch({ type: ActionTypes.SET_EXTRACTION_MODE, payload: mode });
  };
  
  const setExtractedData = (data) => {
    dispatch({ type: ActionTypes.SET_EXTRACTED_DATA, payload: data });
  };
  
  const updateExtractedData = (data) => {
    dispatch({ type: ActionTypes.UPDATE_EXTRACTED_DATA, payload: data });
  };

  // Extract data from listing text
  const extractData = async (listingText) => {
    setLoading(true);
    resetError();
    
    try {
      // Use the extraction service
      const extractedData = await extractDataService(listingText);
      setExtractedData(extractedData);
      setLoading(false);
      return extractedData;
    } catch (error) {
      console.error('Error extracting data:', error);
      setError('Failed to extract data from listing. Please try again or enter details manually.');
      setLoading(false);
      return null;
    }
  };

  // Analyze development based on extracted data
  const analyzeDevelopment = async (listingText) => {
    setLoading(true);
    resetError();
    
    try {
      // First extract data from the listing
      const extractedData = await extractData(listingText);
      
      if (!extractedData) {
        throw new Error('Failed to extract data from listing');
      }
      
      // This would be replaced with actual API call in a real implementation
      // For now, we'll simulate the analysis with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate water demand metrics
      const waterDemand = calculateWaterDemand(extractedData);
      const waterScore = calculateWaterDemandScore(waterDemand.strainPercentage);
      
      const development = {
        id: `dev-${Date.now()}`,
        extractedData: extractedData,
        legitimacyScore: Math.floor(Math.random() * 30) + 50, // Random score between 50-80
        infrastructureImpact: {
          water: { 
            score: waterScore,
            risk: waterDemand.riskLevel,
            dailyDemandLiters: waterDemand.dailyDemandLiters,
            monthlyDemandCubicMeters: waterDemand.monthlyDemandCubicMeters,
            strainPercentage: waterDemand.strainPercentage,
            breakdown: waterDemand.breakdown
          },
          power: { 
            score: Math.floor(Math.random() * 40) + 40, 
            risk: Math.random() > 0.7 ? 'Low' : 'Medium'
          },
          drainage: { 
            score: Math.floor(Math.random() * 40) + 40, 
            risk: Math.random() > 0.3 ? 'Medium' : 'High'
          },
          greenCover: { 
            score: Math.floor(Math.random() * 40) + 40, 
            risk: Math.random() > 0.5 ? 'Medium' : 'High'
          }
        },
        originalListing: listingText
      };
      
      addDevelopment(development);
      setLoading(false);
      return development;
    } catch (error) {
      console.error('Error analyzing development:', error);
      setError('Failed to analyze development. Please try again.');
      setLoading(false);
      return null;
    }
  };

  const value = {
    ...state,
    setLoading,
    setError,
    resetError,
    addDevelopment,
    selectDevelopment,
    toggleMapLayer,
    setExtractionMode,
    extractData,
    updateExtractedData,
    analyzeDevelopment
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook for using the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}