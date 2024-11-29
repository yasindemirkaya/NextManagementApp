import axios from 'axios';
import jwt from 'jsonwebtoken';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const axiosInterceptorInstance = axios.create({
    baseURL: publicRuntimeConfig.apiUrl,
});

/* {{ Public routes tanımlayın }} */
const publicRoutes = ['/login', '/register'];

/* {{ Request interceptor }} */
axiosInterceptorInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        // Eğer route public ise token kontrolü yapılmaz
        if (publicRoutes.some((route) => config.url.includes(route))) {
            return config;
        }

        // Private route ise token kontrolü yapılır
        if (token) {
            try {
                const decoded = jwt.decode(token);

                // Token süresi dolmuş mu kontrol et
                if (decoded.exp * 1000 < Date.now()) {
                    // Token expired: Kullanıcıyı logout et
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    throw new axios.Cancel('Token expired, redirecting to login.');
                }

                // Token geçerliyse Authorization header'a ekle
                config.headers.Authorization = `Bearer ${token}`;
            } catch (err) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                throw new axios.Cancel('Invalid token, redirecting to login.');
            }
        } else {
            window.location.href = '/login';
            throw new axios.Cancel('No token provided, redirecting to login.');
        }

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
