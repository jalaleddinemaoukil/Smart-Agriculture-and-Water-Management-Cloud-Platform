// src/stores/sensorStore.ts

import { create } from 'zustand';
import { type SensorState } from '@/types/sensor';
import { fetchSensorReadings, fetchAlerts, subscribeToSensorReadings, subscribeToAlerts } from '@/services/supabaseService';

interface SensorStore extends SensorState {
  currentFarmId: string | null;
  setCurrentFarmId: (farmId: string | null) => void;
  fetchData: () => Promise<void>;
  startPolling: (interval?: number) => void;
  stopPolling: () => void;
  startRealtime: (farmId: string) => void;
  stopRealtime: () => void;
  clearError: () => void;
}

let pollingInterval: NodeJS.Timeout | null = null;
let realtimeUnsubscribers: Array<() => void> = [];

export const useSensorStore = create<SensorStore>((set, get) => ({
  // Initial state
  readings: [],
  latestReading: null,
  alerts: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  currentFarmId: null,

  // Set current farm ID
  setCurrentFarmId: (farmId: string | null) => {
    set({ currentFarmId: farmId });
    // Restart realtime subscriptions if active
    const { currentFarmId, startRealtime } = get();
    if (currentFarmId) {
      get().stopRealtime();
      startRealtime(farmId!);
    }
  },

  // Fetch data from Supabase
  fetchData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { currentFarmId } = get();
      
      // Fetch sensor readings and alerts in parallel
      const [readings, alerts] = await Promise.all([
        fetchSensorReadings(currentFarmId || undefined),
        fetchAlerts(currentFarmId || undefined)
      ]);

      // Get latest reading
      const latestReading = readings.length > 0 ? readings[0] : null;

      set({
        readings,
        latestReading,
        alerts,
        isLoading: false,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Fetch error:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch data',
        isLoading: false
      });
    }
  },

  // Start polling (default: 30 seconds)
  startPolling: (interval = 30000) => {
    const { fetchData } = get();
    
    // Fetch immediately
    fetchData();
    
    // Clear existing interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    // Start new polling interval
    pollingInterval = setInterval(() => {
      fetchData();
    }, interval);
  },

  // Stop polling
  stopPolling: () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  },

  // Start realtime subscriptions
  startRealtime: (farmId: string) => {
    get().stopRealtime(); // Clean up existing subscriptions

    // Subscribe to sensor readings
    const unsubscribeReadings = subscribeToSensorReadings(farmId, (reading) => {
      const { readings } = get();
      const updatedReadings = [reading, ...readings].slice(0, 100); // Keep last 100
      set({
        readings: updatedReadings,
        latestReading: reading,
        lastUpdated: new Date().toISOString()
      });
    });

    // Subscribe to alerts
    const unsubscribeAlerts = subscribeToAlerts(farmId, (alert) => {
      const { alerts } = get();
      set({
        alerts: [alert, ...alerts]
      });
    });

    realtimeUnsubscribers = [unsubscribeReadings, unsubscribeAlerts];
  },

  // Stop realtime subscriptions
  stopRealtime: () => {
    realtimeUnsubscribers.forEach(unsub => unsub());
    realtimeUnsubscribers = [];
  },

  // Clear error
  clearError: () => set({ error: null })
}));