import { jwtDecode } from "jwt-decode"
import { verify } from 'jsonwebtoken';

// Client side token verification
export const isTokenExpiredClient = (token) => {
    const decoded = jwtDecode(token)
    if (!decoded || !decoded.exp) return true

    const now = Date.now() / 1000;
    return decoded.exp < now;
};

// Server side token verification
export const isTokenExpiredServer = (token) => {
    if (!token) return true;
    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        return decoded.exp < Math.floor(Date.now() / 1000);
    } catch (error) {
        return true;
    }
};