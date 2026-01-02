import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/configs/query.config';
import type { CharaEntity, CreateCharaDto, UpdateCharaDto } from './api-base';
import { api } from './index';

interface MutationOptions<T = void, D = CharaEntity> {
  onSuccess?: (data: D, variables: T, context?: unknown) => void;
  onError?: (error: unknown, variables: T, context?: unknown) => void;
}

export const selectChara = (data: CharaEntity) => ({
  ...data,
  avatar:
    data.avatar &&
    `${import.meta.env.VITE_BASE_URL || ''}/files/${data.avatar}`,
  avatarName: data.name.includes(' ')
    ? data.name.split(' ')[0]
    : data.name.slice(-2),
});

interface CreateCharaVars {
  dto: CreateCharaDto;
}

export const useCharaCreate = (
  options?: MutationOptions<CreateCharaVars, CharaEntity>
) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (vars: CreateCharaVars) => api.chara.create(vars.dto),
    onSuccess: (chara, vars) => {
      client.setQueryData(queryKeys.chars.detail(chara.id), chara);
      client.invalidateQueries({ queryKey: queryKeys.chars.list });
      options?.onSuccess?.(chara, vars);
    },
    onError: (error, vars) => {
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (axiosError.response?.status === 409) {
        console.error('创建角色失败：已有同名角色');
      } else {
        console.error(`创建角色失败：${axiosError.response?.data?.message}`);
      }
      options?.onError?.(error, vars);
    },
  });
};

interface UpdateCharaVars {
  id: number;
  dto: UpdateCharaDto;
}

export const useCharaUpdate = (
  options?: MutationOptions<UpdateCharaVars, CharaEntity>
) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (vars: UpdateCharaVars) => api.chara.update(vars.id, vars.dto),
    onSuccess: (chara, vars) => {
      client.setQueryData(queryKeys.chars.detail(vars.id), chara);
      client.invalidateQueries({ queryKey: queryKeys.chars.list });
      options?.onSuccess?.(chara, vars);
    },
    onError: (error, vars) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      console.error(`更新角色失败：${axiosError.response?.data?.message}`);
      options?.onError?.(error, vars);
    },
  });
};

interface RemoveCharaVars {
  id: number;
}

export const useCharaRemove = (
  options?: MutationOptions<RemoveCharaVars, CharaEntity>
) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (vars: RemoveCharaVars) => api.chara.remove(vars.id),
    onSuccess: async (chara, vars) => {
      console.log('删除角色成功');
      client.removeQueries({ queryKey: queryKeys.chars.detail(vars.id) });
      await client.invalidateQueries({ queryKey: queryKeys.chars.list });
      options?.onSuccess?.(chara, vars);
    },
    onError: (error, vars) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      console.error(`删除角色失败：${axiosError.response?.data?.message}`);
      options?.onError?.(error, vars);
    },
  });
};
