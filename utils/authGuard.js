// utils/authUtils.js
import { useRouter } from 'next/router';

export const handleAuthRedirect = (token, pathname) => {
    const router = useRouter();
    const requiresAuth = ['/dashboard', '/profile'];  // Giriş gerektiren sayfalar

    // Eğer giriş gerektiren bir sayfaya gidiliyorsa ve token yoksa login sayfasına yönlendir
    if (requiresAuth.includes(pathname) && !token) {
        router.push('/login');
        return;
    }

    // Eğer token varsa ve login sayfasındaysanız, dashboard sayfasına yönlendir
    if (pathname === '/login' && token) {
        router.push('/dashboard');
    }
};