import { create } from 'zustand';

export type ComponentType = 'gantt' | 'editor' | 'graph' | 'design';

export interface ComponentStatus {
  id: string;
  type: ComponentType;
  title: string;
}

export type PositionState = 'corner' | 'vertical' | 'horizontal' | 'full';

export interface WorkspaceState {
  components: ComponentStatus[];
  activeComponentId: string | null;
  menuExpanded: boolean;
  layout: PositionState;
  draggingComponentId: string | null;
  addComponent: (component: ComponentStatus) => void;
  removeComponent: (id: string) => void;
  setActiveComponent: (id: string | null) => void;
  toggleMenu: () => void;
  setLayout: (layout: PositionState) => void;
  setDraggingComponent: (id: string | null) => void;
  moveComponent: (fromIndex: number, toIndex: number) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  components: [],
  activeComponentId: null,
  menuExpanded: true,
  layout: 'corner',
  draggingComponentId: null,
  addComponent: (component) =>
    set((state) => ({
      components: [...state.components, component],
    })),
  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      activeComponentId:
        state.activeComponentId === id ? null : state.activeComponentId,
    })),
  setActiveComponent: (id) => set({ activeComponentId: id }),
  toggleMenu: () => set((state) => ({ menuExpanded: !state.menuExpanded })),
  setLayout: (layout) => set({ layout }),
  setDraggingComponent: (id) => set({ draggingComponentId: id }),
  moveComponent: (fromIndex, toIndex) =>
    set((state) => {
      const newComponents = [...state.components];
      const [removed] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, removed);
      return { components: newComponents };
    }),
}));
