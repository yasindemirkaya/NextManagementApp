import { useRouter } from 'next/router';

export const useAuthRedirect = () => {
    const router = useRouter();

    const handleAuthRedirect = (token, pathname) => {
        const requiresAuth = ['/dashboard', '/profile'];  // Giriş gerektiren sayfalar

        // Eğer giriş gerektiren bir sayfaya gidiliyorsa ve token yoksa login sayfasına yönlendir
        if (requiresAuth.includes(pathname) && !token) {
            router.push('/login');
        }

        // Eğer login sayfasına gidiliyorsa ve kullanıcı zaten giriş yaptıysa dashboard'a yönlendir
        if (pathname === '/login' || pathname === '/' && token) {
            router.push('/dashboard');
        }
    };

    return handleAuthRedirect;
};