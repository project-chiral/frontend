import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';
const AI_API_BASE_URL =
  import.meta.env.VITE_AI_BASE_URL || 'http://localhost:4001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aiApi = axios.create({
  baseURL: AI_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const interceptRequest = (req: AxiosRequestConfig) => {
  const headers: Record<string, string> = {
    ...(req.headers as Record<string, string>),
    'project-id': sessionStorage.getItem('project-id') || '',
    'user-id': sessionStorage.getItem('user-id') || '',
  };
  req.headers = headers;
  return req;
};

const handleError = (error: AxiosError) => {
  const status = error.response?.status;
  const message = error.response?.data
    ? JSON.stringify(error.response.data)
    : error.message;

  console.error(`[API Error] ${status}: ${message}`);

  switch (status) {
    case 401:
      console.error('未登录或登录已过期');
      break;
    case 403:
      console.error('没有权限执行此操作');
      break;
    case 404:
      console.error('请求的资源不存在');
      break;
    case 500:
      console.error('服务器错误，请稍后重试');
      break;
    default:
      console.error(`请求失败: ${message}`);
  }

  return Promise.reject(error);
};

api.interceptors.request.use(interceptRequest);
api.interceptors.response.use(undefined, handleError);
aiApi.interceptors.request.use(interceptRequest);
aiApi.interceptors.response.use(undefined, handleError);

export { API_BASE_URL, AI_API_BASE_URL };
