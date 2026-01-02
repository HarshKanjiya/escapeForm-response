import { ActionResponse } from '@/types/common';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { showError } from './utils';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/api/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse<ActionResponse>): AxiosResponse<ActionResponse> => {
        return response;
    },
    async (error) => {
        console.error('Response error:', error);

        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 401:
                    console.error('Unauthorized - please log in');
                    showError('Unauthorized - please log in');
                    break;
                case 403:
                    console.error('Forbidden - insufficient permissions');
                    showError('Forbidden - insufficient permissions');
                    break;
                case 404:
                    console.error('Resource not found');
                    showError('Resource not found');
                    break;
                case 500:
                    console.error('Internal server error');
                    showError('Internal server error');
                    break;
                default:
                    console.error(`HTTP Error ${status}:`, data?.message || 'Unknown error');
                    showError(data?.message || `HTTP Error ${status}`);
            }

            return Promise.reject({
                status,
                message: data?.message || `HTTP Error ${status}`,
                data: data
            });
        } else if (error.request) {
            console.error('Network error - no response received');
            return Promise.reject({
                status: 0,
                message: 'Network error - please check your connection',
                data: null
            });
        } else {
            return Promise.reject({
                status: 0,
                message: error.message || 'Request failed',
                data: null
            });
        }
    }
);

export default api;