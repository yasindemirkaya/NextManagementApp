import jwt from 'jsonwebtoken';
import { isTokenExpiredServer } from '@/helpers/tokenVerifier';

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: "You must be logged in to access this resource.",
                code: 0
            });
        }

        // Token'ın süresi dolmuş mu diye kontrol ediyoruz
        if (isTokenExpiredServer(token)) {
            return res.status(401).json({
                message: "Token has expired. Please log in again.",
                code: 0
            });
        }

        // Token'ı çözümleyip, içeriğinden userId alıyoruz
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Invalid token.",
                    code: 0
                });
            }

            // Token'dan alınan kullanıcı bilgilerini req.user olarak ekliyoruz
            req.user = decoded;  // Burada token'ın payload kısmından gelen user bilgilerini req.user olarak ekliyoruz

            next();  // Middleware zincirini devam ettiriyoruz
        });

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token.",
            code: 0
        });
    }
};

export default verifyToken;
