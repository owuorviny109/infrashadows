import React, { createContext, useContext, useState, useReducer } from 'react';

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
  error: null
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_DEVELOPMENT: 'ADD_DEVELOPMENT',
  SELECT_DEVELOPMENT: 'SELECT_DEVELOPMENT',
  TOGGLE_MAP_LAYER: 'TOGGLE_MAP_LAYER',
  RESET_ERROR: 'RESET_ERROR'
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

  // API mock functions
  const analyzeDevelopment = async (listingText) => {
    setLoading(true);
    resetError();
    
    try {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const development = {
        id: `dev-${Date.now()}`,
        extractedData: {
          floors: 12,
          units: 48,
          location: 'Kilimani, Nairobi',
          amenities: ['Swimming Pool', 'Gym', 'Security'],
          parkingSpaces: 60
        },
        legitimacyScore: 78,
        infrastructureImpact: {
          water: { score: 65, risk: 'Medium' },
          power: { score: 72, risk: 'Low' },
          drainage: { score: 45, risk: 'High' },
          greenCover: { score: 60, risk: 'Medium' }
        },
        originalListing: listingText
      };
      
      addDevelopment(development);
      setLoading(false);
      return development;
    } catch (error) {
      setError('Failed to analyze development. Please try again.');
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