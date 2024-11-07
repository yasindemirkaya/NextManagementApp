import { verify } from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({
            message: 'Access denied. No token provided.'
        });
    }

    verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Invalid or expired token.'
            });
        }
        req.user = decoded; // Token'dan çıkan kullanıcı bilgilerini isteğe ekliyoruz
        next();
    });
};