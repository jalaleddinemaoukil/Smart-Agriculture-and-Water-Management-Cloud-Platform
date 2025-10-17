import axios, { type AxiosInstance, AxiosError } from 'axios';
import type { Sensor, Alert, Report } from '../types/sensor.types';
import type { ApiResponse } from '../types/api.types';

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error('Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API methods
export const sensorAPI = {
  getSensors: async (): Promise<Sensor[]> => {
    try {
      const response = await api.get<ApiResponse<Sensor[]>>('/sensors');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching sensors:', error);
      throw error;
    }
  },

  getSensorById: async (id: string): Promise<Sensor> => {
    try {
      const response = await api.get<ApiResponse<Sensor>>(`/sensors/${id}`);
      return response.data.data || {} as Sensor;
    } catch (error) {
      console.error('Error fetching sensor by ID:', error);
      throw error;
    }
  },

  getRealtime: async (): Promise<Sensor[]> => {
    try {
      const response = await api.get<ApiResponse<Sensor[]>>('/realtime');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching realtime data:', error);
      throw error;
    }
  },

  getAlerts: async (): Promise<Alert[]> => {
    try {
      const response = await api.get<ApiResponse<Alert[]>>('/alerts');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  getReports: async (): Promise<Report[]> => {
    try {
      const response = await api.get<ApiResponse<Report[]>>('/reports');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  resolveAlert: async (id: string): Promise<any> => {
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