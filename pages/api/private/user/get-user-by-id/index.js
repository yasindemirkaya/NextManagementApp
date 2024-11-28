// --------------------------------
// |
// | Service Name: Get User by ID
// | Description: Service that retrieves the data of the user whose ID is sent.
// | Endpoint: /api/private/user/get-user-by-id?id=3fac9238-bdd8-4bb3-904d-926be96f8c20
// |
// ------------------------------

import sequelize from '@/config/db';
import { verify } from 'jsonwebtoken';
import privateMiddleware from "@/middleware/private/index"

const findUserById = async (id) => {
    const [users] = await sequelize.query('SELECT * FROM users WHERE id = ?', {
        replacements: [id],
    });
    return users.length > 0 ? users[0] : null;
};

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            // Token decode ve role bilgisi
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: loggedInUserId, role: loggedInUserRole } = decoded;

            // Role 0 olan kullanıcılar bu servisi kullanamaz
            if (loggedInUserRole === 0) {
                return res.status(200).json({
                    code: 0,
                    message: 'You are not authorized to access this service.'

                });
            }

            // Parametre ile gelen ID kontrolü
            const { id: requestedUserId } = req.query;
            if (!requestedUserId) {
                return res.status(200).json({
                    code: 0,
                    message: 'User ID is required.'
                });
            }

            // İstenilen kullanıcıyı bul
            const requestedUser = await findUserById(requestedUserId);
            if (!requestedUser) {
                return res.status(200).json({
                    code: 0,
                    message: 'User not found.'

                });
            }

            // Admin olan kullanıcı Super Admin bir kullanıcının bilgilerine erişemez.
            if (loggedInUserRole === 1 && requestedUser.role === 2) {
                return res.status(200).json({
                    message: 'You are not authorized to access this user.',
                    code: 0
                });
            }

            // Kullanıcı bilgilerini döndür
            return res.status(200).json({
                code: 1,
                message: 'User retrieved successfuly.',
                user: {
                    id: requestedUser.id,
                    first_name: requestedUser.first_name,
                    last_name: requestedUser.last_name,
                    email: requestedUser.email,
                    mobile: requestedUser.mobile,
                    is_active: requestedUser.is_active,
                    is_verified: requestedUser.is_verified,
                    role: requestedUser.role,
                    created_by: requestedUser.created_by
                }
            });
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            return res.status(500).json({ message: 'An error occurred', error: error.message });
        }
    } else {
        // Sadece GET isteği kabul edilir
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default privateMiddleware(handler);