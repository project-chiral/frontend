import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/configs/query.config';
import type { CreateEventDto, EventEntity, UpdateEventDto } from './api-base';
import { api } from './index';

interface MutationOptions<T = void, D = EventEntity> {
  onSuccess?: (data: D, variables: T, context?: unknown) => void;
  onError?: (error: unknown, variables: T, context?: unknown) => void;
}

export const selectEvent = (data: EventEntity) => ({
  ...data,
  type: data.type === 'ATOM' ? '原子事件' : '集合事件',
  createdAt: new Date(data.createdAt),
  updatedAt: new Date(data.updatedAt),
  deletedAt: data.deleted && new Date(data.deleted),
});

interface CreateEventVars {
  dto: CreateEventDto;
}

export const useEventCreate = (
  options?: MutationOptions<CreateEventVars, EventEntity>
) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (vars: CreateEventVars) => api.event.create(vars.dto),
    onSuccess: async (event, vars) => {
      console.log('创建事件成功');
      client.setQueryData(queryKeys.events.detail(event.id), event);
      client.invalidateQueries({ queryKey: queryKeys.events.list });
      options?.onSuccess?.(event, vars);
    },
    onError: (error, vars) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      console.error(`创建事件失败：${axiosError.response?.data?.message}`);
      options?.onError?.(error, vars);
    },
  });
};

interface UpdateEventVars {
  id: number;
  dto: UpdateEventDto;
}

export const useEventUpdate = (
  options?: MutationOptions<UpdateEventVars, EventEntity>
) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (vars: UpdateEventVars) => api.event.update(vars.id, vars.dto),
    onSuccess: async (event, vars) => {
      client.setQueryData(queryKeys.events.detail(vars.id), event);
      await client.invalidateQueries({ queryKey: queryKeys.events.list });
      options?.onSuccess?.(event, vars);
    },
    onError: (error, vars) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      console.error(`更新事件失败：${axiosError.response?.data?.message}`);
      options?.onError?.(error, vars);
    },
  });
};

interface RemoveEventVars {
  id: number;
}

export const useEventRemove = (
  options?: MutationOptions<RemoveEventVars, EventEntity[]>
) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (vars: RemoveEventVars) => api.event.remove(vars.id),
    onSuccess: async (events, vars) => {
      console.log('删除事件成功');
      events.forEach(({ id }) => {
        client.removeQueries({ queryKey: queryKeys.events.detail(id) });
      });
      client.invalidateQueries({ queryKey: queryKeys.events.list });
      options?.onSuccess?.(events, vars);
    },
    onError: (error, vars) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      console.error(`删除事件失败：${axiosError.response?.data?.message}`);
      options?.onError?.(error, vars);
    },
  });
};
