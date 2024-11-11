// --------------------------------
// |
// | Service Name: Get User
// | Description: Service that fetches all data in the Users table of the user whose ID is sent.
// | Parameters: id
// | Endpoint: /api/private/user/get-user?id=63feea7c-9f4e-11ef-9af8-244bfe9797df
// |
// ------------------------------

import sequelize from '@/config/db';
import { verify } from 'jsonwebtoken';

const findUserById = async (id) => {
    const [users] = await sequelize.query('SELECT * FROM users WHERE id = ?', {
        replacements: [id],
    });
    return users.length > 0 ? users[0] : null;
};

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // JWT token'ı doğrulama
            const token = req.headers.authorization?.split(' ')[1]; // Bearer token formatında gönderildiğini varsayıyoruz
            if (!token) {
                return res.status(200).json({
                    message: "You must be logged in to get this user's data.",
                    code: 0
                });
            }

            // Token'ı decode et ve kullanıcı id'sini al
            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Kullanıcıyı ID ile bul
            const user = await findUserById(userId);

            if (!user) {
                return res.status(200).json({
                    message: 'User not found',
                    code: 0
                });
            }

            // Kullanıcı bilgilerini döndür
            return res.status(200).json({
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    mobile: user.mobile,
                    is_active: user.is_active,
                    is_verified: user.is_verified,
                    role: user.role,
                }
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            return res.status(500).json({ message: 'An error occurred', error: error.message });
        }
    } else {
        // Sadece GET isteği kabul edilir
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}