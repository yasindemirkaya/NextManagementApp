import { isTokenExpiredServer } from '@/helpers/tokenVerifier';

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: "You must be logged in as admin to access this resource.",
                code: 0
            });
        }

        if (isTokenExpiredServer(token)) {
            return res.status(401).json({
                message: "Token has expired. Please log in again.",
                code: 0
            });
        }
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token.",
            code: 0
        });
    }
};

export default verifyToken;