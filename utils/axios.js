import axios from 'axios';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const axiosInterceptorInstance = axios.create({
    baseURL: publicRuntimeConfig.apiUrl,
});

/* {{ Request interceptor }} */
axiosInterceptorInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/* {{ Response interceptor }} */
axiosInterceptorInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInterceptorInstance;