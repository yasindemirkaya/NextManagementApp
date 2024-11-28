// --------------------------------
// |
// | Service Name: Update User
// | Description: Service that the user updates their own data.
// | Parameters: first_name, last_name, email, mobile is_active, is_verified, updated_by
// | Endpoint: /api/private/user/update-user
// |
// ------------------------------

import sequelize from '@/config/db';
import { verify } from 'jsonwebtoken';
import privateMiddleware from "@/middleware/private/index"

// Update methodu
const updateUserById = async (id, userData) => {
    const { firstName, lastName, email, mobile, isActive, isVerified, updatedBy } = userData;

    const [result] = await sequelize.query(
        'UPDATE users SET first_name = ?, last_name = ?, email = ?, mobile = ?, is_active = ?, is_verified = ?, updated_by = ? WHERE id = ?',
        {
            replacements: [firstName, lastName, email, mobile, isActive, isVerified, updatedBy, id],
        }
    );
    return { success: true, result };
};

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            // Token'ı decode et ve kullanıcı id'sini al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Kullanıcıyı veritabanından al
            const [user] = await sequelize.query(
                'SELECT email, mobile FROM users WHERE id = ?',
                {
                    replacements: [userId],
                }
            );

            // User not found
            if (!user || user.length === 0) {
                return res.status(200).json({
                    message: 'User not found',
                    code: 0
                });
            }

            const currentEmail = user[0].email;
            const currentMobile = user[0].mobile;

            // Gelen veriyi al
            const { firstName, lastName, email, mobile, isActive, isVerified, updatedBy } = req.body;

            // Güncelleme işlemi
            const result = await updateUserById(userId, { firstName, lastName, email, mobile, isActive, isVerified, updatedBy }, currentEmail, currentMobile);

            // Etkilenen satır sayısını kontrol et
            if (result.result && result.result.affectedRows === 0) {
                return res.status(200).json({
                    message: 'No changes were made.',
                    code: 0
                });
            }

            // Başarılı güncelleme yanıtı
            return res.status(200).json({
                message: 'User data successfully updated',
                code: 1
            });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(200).json({
                    message: 'Email or mobile number already in use.',
                    code: 0
                });
            }

            // Diğer hatalar için genel hata mesajı
            console.error('Error updating user data:', error);
            return res.status(500).json({
                message: 'An error occurred',
                error: error.message
            });
        }
    } else {
        // Sadece PUT isteği kabul edilir
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default privateMiddleware(handler);