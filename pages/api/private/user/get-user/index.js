// --------------------------------
// |
// | Service Name: Get User
// | Description: Service that brings the user's own data
// | Endpoint: /api/private/user/get-user
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import User from '@/models/User';

// Kullanıcıyı bul
const findUserById = async (id) => {
    return await User.findById(id).lean();
};

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            // Token'ı decode et ve kullanıcı id'sini al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Kullanıcıyı ID ile bul
            const user = await findUserById(userId);

            if (!user) {
                return res.status(200).json({
                    message: 'User not found',
                    code: 0,
                });
            }

            // created_by ve updated_by kullanıcılarını paralel olarak bul
            const [createdByUser, updatedByUser] = await Promise.all([
                findUserById(user.created_by),
                findUserById(user.updated_by)
            ]);

            // Kullanıcı bilgilerini döndür
            return res.status(200).json({
                user: {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    mobile: user.mobile,
                    is_active: user.is_active,
                    is_verified: user.is_verified,
                    role: user.role,
                    created_by: createdByUser ? `${createdByUser.first_name} ${createdByUser.last_name}` : null,
                    updated_by: updatedByUser ? `${updatedByUser.first_name} ${updatedByUser.last_name}` : null,
                },
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            return res.status(500).json({
                message: 'An error occurred',
                error: error.message,
            });
        }
    } else {
        // Sadece GET isteği kabul edilir
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default privateMiddleware(handler);