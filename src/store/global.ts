import { create } from 'zustand';

interface GlobalState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  projectId: string | null;
  userId: string | null;
  setProjectId: (id: string) => void;
  setUserId: (id: string) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  projectId: null,
  userId: null,
  setProjectId: (id) => set({ projectId: id }),
  setUserId: (id) => set({ userId: id }),
}));
