import { create } from 'zustand';

type DebugError = {
  source: string;
  message?: string | null;
  status?: number | null;
  details?: unknown;
  time: string;
};

type State = {
  lastError: DebugError | null;
  setError: (err: Omit<DebugError, 'time'>) => void;
  clear: () => void;
};

export const useDebugStore = create<State>((set) => ({
  lastError: null,
  setError: (err) =>
    set({ lastError: { ...err, time: new Date().toISOString() } }),
  clear: () => set({ lastError: null }),
}));

export type { DebugError };
