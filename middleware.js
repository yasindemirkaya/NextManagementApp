import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// İzin verilen pathler
const PUBLIC_PATHS = [
    '/',
    '/login',
    '/register',
    '/api/public/login',
    '/api/public/register'
];

export async function middleware(request) {
    // Cookie'den token'ı al
    const token = request.cookies.get('token');

    // Token'ın boş ya da yanlış formatta olup olmadığını kontrol et
    if (!token || typeof token.value !== 'string') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Eğer token yoksa, login sayfasına yönlendir (public sayfalar hariç)
    if (!PUBLIC_PATHS.some(path => request.nextUrl.pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Token varsa, token'ı doğrula ve süresinin geçip geçmediğini kontrol et
    try {
        const decoded = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET));


        const expirationTime = decoded.payload.exp * 1000;
        const currentTime = Date.now();

        if (currentTime > expirationTime) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    } catch (error) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }

    // Eğer token geçerli ve süresi dolmamışsa, devam et
    return NextResponse.next();
}

export const config = {
    // Public endpointleri hariç tut
    matcher: ['/((?!_next|login|register|api/public/login|api/public/register).*)'],
};
