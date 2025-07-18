/**
 * Service for making API calls to the backend
 */
import axios from 'axios';

// API base URL - would come from environment variables in a real app
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Extract data from a real estate listing
 * @param {string} listingText - The listing text to analyze
 * @returns {Promise<object>} - The extracted data
 */
export const extractData = async (listingText) => {
  try {
    const response = await api.post('/extract', { listingText });
    return response.data;
  } catch (error) {
    console.error('API error extracting data:', error);
    throw error;
  }
};

/**
 * Analyze a development based on extracted data
 * @param {object} developmentData - The development data to analyze
 * @returns {Promise<object>} - The analysis results
 */
export const analyzeDevelopment = async (developmentData) => {
  try {
    const response = await api.post('/analyze', developmentData);
    return response.data;
  } catch (error) {
    console.error('API error analyzing development:', error);
    throw error;
  }
};

/**
 * Get analysis results by ID
 * @param {string} id - The analysis ID
 * @returns {Promise<object>} - The analysis results
 */
export const getAnalysis = async (id) => {
  try {
    const response = await api.get(`/analysis/${id}`);
    return response.data;
  } catch (error) {
    console.error('API error getting analysis:', error);
    throw error;
  }
};

/**
 * Generate a report for an analysis
 * @param {string} analysisId - The analysis ID
 * @param {object} options - Report generation options
 * @returns {Promise<object>} - The report details
 */
export const generateReport = async (analysisId, options) => {
  try {
    const response = await api.post('/report', { analysisId, options });
    return response.data;
  } catch (error) {
    console.error('API error generating report:', error);
    throw error;
  }
};