// --------------------------------
// |
// | Service Name: Delete User
// | Description: Service that deletes the user's account permanently.
// | Endpoint: /api/private/user/delete-user
// |
// ------------------------------

import sequelize from '@/config/db';
import { verify } from 'jsonwebtoken';

const deleteUserById = async (userId) => {
    // Kullanıcıyı veritabanından sil
    const [result] = await sequelize.query(
        'DELETE FROM users WHERE id = ?',
        {
            replacements: [userId],
        }
    );
    return result;
};

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        try {
            // JWT token'ı doğrula
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(200).json({
                    message: "You must be logged in to delete your account.",
                    code: 0
                });
            }

            // Token'ı decode et ve kullanıcı id'sini al
            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Kullanıcıyı silme işlemi
            const result = await deleteUserById(userId);

            // Etkilenen satır sayısını kontrol et
            if (result.affectedRows === 0) {
                return res.status(200).json({
                    message: 'User not found or already deleted',
                    code: 0
                });
            }

            // Başarılı silme yanıtı
            return res.status(200).json({
                message: 'Your account has been successfully deleted',
                code: 1
            });
        } catch (error) {
            console.error('Error deleting user account:', error);
            return res.status(500).json({ message: 'An error occurred', error: error.message });
        }
    } else {
        // Sadece DELETE isteği kabul edilir
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}