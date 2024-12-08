// --------------------------------
// |
// | Service Name: Get User By ID
// | Description: The service that brings the user whose ID is sent.
// | Endpoint: /api/private/user/get-user-by-id
// |
// ------------------------------

import privateMiddleware from '@/middleware/private/index';
import User from '@/models/User';

const findUserById = async (id) => {
    return await User.findById(id).lean();
};

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const requestedUserId = req.query.id

            // Kullanıcıyı ID ile bul
            const user = await findUserById(requestedUserId);

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
                message: 'User fetched successfully',
                code: 1,
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
