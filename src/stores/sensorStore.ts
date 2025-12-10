// src/stores/sensorStore.ts
import { create } from 'zustand';
import type { SensorReading } from '../types/database';
import { fetchLatestReadings } from '../services/readings';

type CriticalAlert = {
  type: 'critical';
  message: string;
};

type SensorStore = {
  readings: SensorReading[];
  latestReading: SensorReading | null;
  alerts: CriticalAlert[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;

  fetchData: () => Promise<void>;
  startPolling: (intervalMs: number) => void;
  stopPolling: () => void;
};

let pollingInterval: number | null = null;

export const useSensorStore = create<SensorStore>((set, get) => ({
  readings: [],
  latestReading: null,
  alerts: [],
  isLoading: false,
  error: null,
  lastUpdated: null,

  fetchData: async () => {
    try {
      set({ isLoading: true, error: null });

      const data = await fetchLatestReadings();

      if (!Array.isArray(data)) {
        set({ error: 'Invalid data returned', isLoading: false });
        return;
      }

      const latest = data[0] || null;

      const alerts: CriticalAlert[] = [];
      if (latest && latest.soil_moisture !== null && latest.soil_moisture < 25) {
        alerts.push({
          type: 'critical',
          message: `Critical soil moisture: ${latest.soil_moisture}%`,
        });
      }

      set({
        readings: data,
        latestReading: latest,
        alerts,
        lastUpdated: new Date().toISOString(),
        isLoading: false,
      });
    } catch (err) {
      const errorObj = err as { message?: string };
      set({ error: errorObj.message || 'Failed to fetch data', isLoading: false });
    }
  },

  startPolling: (intervalMs: number) => {
    const { fetchData } = get();
    if (pollingInterval) return;
    fetchData();
    pollingInterval = window.setInterval(fetchData, intervalMs);
  },

  stopPolling: () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  },
}));
