import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../index';
import { queryKeys } from '@/configs/query.config';
import { invalidateRelation } from './utils';
import type { NodeId, RelationId } from './type';
import type { RelationType } from './schema';

interface MutationOptions<T = void, D = unknown> {
  onSuccess?: (data: D, variables: T, context?: unknown) => void;
  onError?: (error: unknown, variables: T, context?: unknown) => void;
}

export const useRelations = (node: NodeId | undefined, relType: RelationType) => {
  return useQuery({
    enabled: node !== undefined,
    queryKey: ['graph', node, relType],
    queryFn: () => api.graph.getRelations({ ...node!, relType }),
  });
};

export const useRelatedNodes = (node: NodeId | undefined, relType: RelationType) => {
  return useQuery({
    enabled: node !== undefined,
    queryKey: ['graph', node, relType, 'node'],
    queryFn: () => api.graph.getRelatedNodes({ ...node!, relType }),
  });
};

export const useRelationCreate = (options?: MutationOptions<RelationId>) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (dto: RelationId) => api.graph.createRelation(dto),
    onSuccess: (data, vars) => {
      invalidateRelation(client, vars);
      options?.onSuccess?.(data, vars);
    },
    onError: (error, vars) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      console.error(`创建关系失败：${axiosError.response?.data?.message}`);
      options?.onError?.(error, vars);
    },
  });
};

export const useRelationRemove = (options?: MutationOptions<RelationId>) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (dto: RelationId) => api.graph.removeRelation(dto),
    onSuccess: (data, vars) => {
      invalidateRelation(client, vars);
      options?.onSuccess?.(data, vars);
    },
    onError: (error, vars) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      console.error(`删除关系失败：${axiosError.response?.data?.message}`);
      options?.onError?.(error, vars);
    },
  });
};
