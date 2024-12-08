import sequelize from '@/config/db';
import { verify } from 'jsonwebtoken';
import privateMiddleware from "@/middleware/private/index"

const ROLES = {
    USER: 0,
    ADMIN: 1,
    SUPER_ADMIN: 2
};

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
            const token = req.headers.authorization?.split(' ')[1];
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
            if (loggedInUserRole === ROLES.ADMIN && requestedUser.role === ROLES.SUPER_ADMIN) {
                return res.status(200).json({
                    message: 'You are not authorized to access this user.',
                    code: 0
                });
            }

            // Kullanıcıları `created_by` ve `updated_by` alanları için al
            const userIds = new Set();
            if (requestedUser.created_by) userIds.add(requestedUser.created_by);
            if (requestedUser.updated_by) userIds.add(requestedUser.updated_by);

            let usersInfo = [];
            if (userIds.size > 0) {
                const userQuery = `
                    SELECT id, first_name, last_name
                    FROM users
                    WHERE id IN (${Array.from(userIds).map(() => '?').join(',')})
                `;
                const [userResults] = await sequelize.query(userQuery, { replacements: Array.from(userIds) });
                usersInfo = userResults;
            }

            // Kullanıcı bilgilerini bir Map'te sakla
            const userMap = new Map();
            usersInfo.forEach(user => {
                userMap.set(user.id, `${user.first_name} ${user.last_name}`);
            });

            // `created_by` ve `updated_by` alanlarına isim ekle
            const formattedUser = {
                ...requestedUser,
                created_by: userMap.get(requestedUser.created_by) || requestedUser.created_by,
                updated_by: userMap.get(requestedUser.updated_by) || requestedUser.updated_by,
            };

            // Kullanıcı bilgilerini döndür
            return res.status(200).json({
                code: 1,
                message: 'User retrieved successfully.',
                user: {
                    id: formattedUser.id,
                    first_name: formattedUser.first_name,
                    last_name: formattedUser.last_name,
                    email: formattedUser.email,
                    mobile: formattedUser.mobile,
                    is_active: formattedUser.is_active,
                    is_verified: formattedUser.is_verified,
                    role: formattedUser.role,
                    created_by: formattedUser.created_by,
                    updated_by: formattedUser.updated_by,
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
};

export default privateMiddleware(handler);
