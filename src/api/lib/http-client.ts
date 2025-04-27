import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({});
export const baseUrl = 'http://localhost:8080/api/v1';

apiClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function isAxiosError(error: Error): error is AxiosError {
    return (error as AxiosError).isAxiosError;
}