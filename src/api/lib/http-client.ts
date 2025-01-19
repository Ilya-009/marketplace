import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({});

apiClient.interceptors.request.use((cfg) => {
    return Object.assign({}, cfg, {
        headers: Object.assign({}, cfg.headers, {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
    });
});

export function isAxiosError(error: Error): error is AxiosError {
    return (error as AxiosError).isAxiosError;
}