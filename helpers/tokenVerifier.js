import jwt_decode from 'jsonwebtoken/decode'

export const isTokenExpired = (token) => {
    const decoded = jwt_decode(token);
    if (!decoded || !decoded.exp) return true

    const now = Date.now() / 1000;
    return decoded.exp < now;
};