import axios from 'axios';
import { parse } from 'cookie'; // Cookie'yi okumak için parse fonksiyonu
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const axiosInterceptorInstance = axios.create({
    baseURL: publicRuntimeConfig.apiUrl,
});

/* Public routes tanımlayın */
const publicRoutes = ['/login', '/register'];

/* Request interceptor */
axiosInterceptorInstance.interceptors.request.use(
    (config) => {
        // Tarayıcı ortamında cookie'yi al
        if (typeof window !== 'undefined') {
            const cookies = document.cookie;
            const parsedCookies = parse(cookies);
            const token = parsedCookies.token; // token cookie'de saklanmış token adı

            const language = localStorage.getItem('language') || 'tr';

            // Language header'ını ekle
            if (language) {
                config.headers['Accept-Language'] = language;
            }

            // Eğer route public ise token kontrolü yapılmaz
            if (publicRoutes.some((route) => config.url.includes(route))) {
                return config;
            }

            // Private route ise token kontrolü yapılır
            if (token) {
                try {
                    config.headers.Authorization = `Bearer ${token}`;
                } catch (err) {
                    window.location.href = '/login';
                    throw new axios.Cancel('Invalid token, redirecting to login.');
                }
            } else {
                window.location.href = '/login';
                throw new axios.Cancel('No token provided, redirecting to login.');
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


/* Response interceptor */
axiosInterceptorInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInterceptorInstance;
