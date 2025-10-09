import axios from 'axios';


const API_BASE_URL = 'https://smartsensorapi.azurewebsites.net/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, 
});


api.interceptors.request.use(
  config => {
    console.log(`API Call: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.config.url}`, response.data);
    return response;
  },
  error => {
    console.error('Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export const sensorAPI = {
  
  getSensors: async () => {
    try {
      const response = await api.get('/sensors');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching sensors:', error);
      throw error;
    }
  },

  getSensorById: async (id) => {
    try {
      const response = await api.get(`/sensors/${id}`);
      return response.data.data || {};
    } catch (error) {
      console.error('Error fetching sensor by ID:', error);
      throw error;
    }
  },

  getRealtime: async () => {
    try {
      const response = await api.get('/realtime');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching realtime data:', error);
      throw error;
    }
  },

  getAlerts: async () => {
    try {
      const response = await api.get('/alerts');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  getReports: async () => {
    try {
      const response = await api.get('/reports');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  resolveAlert: async (id) => {
    try {
      const response = await api.post(`/alerts/${id}/resolve`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error resolving alert:', error);
      throw error;
    }
  },
};

export default api;