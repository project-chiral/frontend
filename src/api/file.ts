import { useMutation } from '@tanstack/react-query';
import { api } from './index';
import type { RemoveFileDto, SaveTempFileDto, UploadFileDto, UploadTempFileDto } from './api-base';

export const useFileUpload = () => {
  return useMutation({
    mutationFn: (dto: UploadFileDto) => api.file.upload(dto),
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      console.error(`上传失败：${axiosError.response?.data?.message}`);
    },
  });
};

export const useFileRemove = () => {
  return useMutation({
    mutationFn: (dto: RemoveFileDto) => api.file.remove(dto),
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      console.error(`删除失败：${axiosError.response?.data?.message}`);
    },
  });
};

export const useTempFileUpload = () => {
  return useMutation({
    mutationFn: (dto: UploadTempFileDto) => api.file.uploadTemp(dto),
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      console.error(`上传失败：${axiosError.response?.data?.message}`);
    },
  });
};

export const useTempFileSave = () => {
  return useMutation({
    mutationFn: (dto: SaveTempFileDto) => api.file.saveTemp(dto),
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      console.error(`保存失败：${axiosError.response?.data?.message}`);
    },
  });
};
