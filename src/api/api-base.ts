import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

enum ContentType {
  JSON = 'application/json',
  FORM_URLENCODED = 'application/x-www-form-urlencoded',
  MULTIPART = 'multipart/form-data',
}

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

abstract class HttpClient {
  protected abstract baseURL: string;
  protected instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': ContentType.JSON,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const projectId = sessionStorage.getItem('project-id');
        const userId = sessionStorage.getItem('user-id');

        if (projectId) {
          config.headers['X-Project-ID'] = projectId;
        }
        if (userId) {
          config.headers['X-User-ID'] = userId;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;
        let message = 'An error occurred';

        if (response) {
          switch (response.status) {
            case 401:
              message = 'Please log in to continue';
              break;
            case 403:
              message = 'You do not have permission to perform this action';
              break;
            case 404:
              message = 'The requested resource was not found';
              break;
            case 500:
              message = 'Server error. Please try again later';
              break;
            default:
              message = response.data?.message || 'An error occurred';
          }
        } else if (error.request) {
          message = 'Network error. Please check your connection';
        }

        console.error(`[API Error] ${response?.status || 'Network'}: ${message}`);
        return Promise.reject(new Error(message));
      },
    );
  }

  protected async request<T>(
    method: HttpMethod,
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.request<T>({
      method,
      url,
      data,
      ...config,
    });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(HttpMethod.GET, url, undefined, config);
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(HttpMethod.POST, url, data, config);
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(HttpMethod.PUT, url, data, config);
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(HttpMethod.PATCH, url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(HttpMethod.DELETE, url, undefined, config);
  }
}

export { HttpClient, ContentType, HttpMethod, type ApiResponse };
