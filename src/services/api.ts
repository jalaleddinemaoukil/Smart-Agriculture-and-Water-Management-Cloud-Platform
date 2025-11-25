import axios from 'axios';
import { type SensorReading, type Alert } from '@/types/sensor';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const USE_MOCK_DATA = false;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests (ENTRA ID Token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============================================
// SENSOR DATA ENDPOINTS
// ============================================

/**
 * Fetch latest sensor readings from Cosmos DB
 * Endpoint: GET /sensors/readings
 */
export const fetchSensorData = async (): Promise<SensorReading[]> => {
  if (USE_MOCK_DATA) {
    console.warn('Using mock data - set VITE_API_BASE_URL in .env to use real API');
    return generateMockData();
  }

  try {
    const response = await api.get('/sensors/readings', {
      params: {
        limit: 100, 
        orderBy: 'timestamp',
        order: 'desc'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor data:', error);
   
    return generateMockData();
  }
};

/**
 * Fetch latest reading (single most recent)
 * Endpoint: GET /sensors/latest
 */
export const fetchLatestReading = async (): Promise<SensorReading | null> => {
  if (USE_MOCK_DATA) {
    const mockData = generateMockData();
    return mockData[0] || null;
  }

  try {
    const response = await api.get('/sensors/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest reading:', error);
    return null;
  }
};

/**
 * Fetch active alerts
 * Endpoint: GET /alerts
 */
export const fetchAlerts = async (): Promise<Alert[]> => {
  if (USE_MOCK_DATA) {
    return generateMockAlerts();
  }

  try {
    const response = await api.get('/alerts', {
      params: {
        status: 'active'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
};

/**
 * Fetch historical data for charts
 * Endpoint: GET /sensors/historical
 */
export const fetchHistoricalData = async (
  startDate: string,
  endDate: string
): Promise<SensorReading[]> => {
  if (USE_MOCK_DATA) {
    return generateMockData();
  }

  try {
    const response = await api.get('/sensors/historical', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
};

// ============================================
// MOCK DATA GENERATORS (for development)
// ============================================

const generateMockData = (): SensorReading[] => {
  const now = new Date();
  return Array.from({ length: 100 }, (_, i) => ({
    id: `reading-${i}`,
    sensorId: 'SENSOR-001',
    timestamp: new Date(now.getTime() - i * 3600000).toISOString(), // Hourly
    soilMoisture: Math.random() * 40 + 30, // 30-70%
    temperature: Math.random() * 10 + 20, // 20-30°C
    humidity: Math.random() * 30 + 50, // 50-80%
    waterUsed: Math.random() * 50 + 100, // 100-150L
  }));
};

const generateMockAlerts = (): Alert[] => {
  const now = new Date();
  return [
    {
      id: 'alert-1',
      type: 'warning',
      message: 'Soil moisture dropping below 35%. Consider irrigation soon.',
      timestamp: new Date(now.getTime() - 7200000).toISOString(),
    },
  ];
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Test API connection
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch {
    return false;
  }
};

export default api;