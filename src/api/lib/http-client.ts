import axios from 'axios';

export const apiClient = axios.create({});
export const baseUrl = 'http://localhost:8080/api/v1';

// export const apiClient = axios.create({
//     baseURL: 'http://localhost:8080',
//     withCredentials: true,
// });

apiClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;

    // const csrfToken = Cookies.get('XSRF-TOKEN');
    // if (csrfToken) {
    //     config.headers['X-XSRF-TOKEN'] = csrfToken;
    // }
    // return config;
});
