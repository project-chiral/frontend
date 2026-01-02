import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
    },
  },
});

export const queryKeys = {
  events: {
    all: ['events'] as const,
    detail: (id: number | string) => ['events', id] as const,
    list: (projectId: string) => ['events', 'list', projectId] as const,
  },
  chars: {
    all: ['chars'] as const,
    detail: (id: number | string) => ['chars', id] as const,
    list: (projectId: string) => ['chars', 'list', projectId] as const,
  },
  scenes: {
    all: ['scenes'] as const,
    detail: (id: number | string) => ['scenes', id] as const,
    list: (projectId: string) => ['scenes', 'list', projectId] as const,
  },
  graph: {
    nodes: (projectId: string) => ['graph', 'nodes', projectId] as const,
    relations: (projectId: string) =>
      ['graph', 'relations', projectId] as const,
    related: (nodeId: string) => ['graph', 'related', nodeId] as const,
  },
  project: {
    detail: (id: string) => ['project', id] as const,
    tree: (id: string) => ['project', 'tree', id] as const,
  },
};
