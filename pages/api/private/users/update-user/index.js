// --------------------------------
// |
// | Service Name: Update User
// | Description: Service that the user updates his/her own data.
// | Parameters: first_name, last_name, email, mobile, is_active
// | Endpoint: /api/private/users/update-user
// |
// ------------------------------

import sequelize from '@/config/db';
import { verify } from 'jsonwebtoken';

// Güncellenmiş update fonksiyonu
const updateUserById = async (id, userData) => {
    const { firstName, lastName, email, mobile, isActive } = userData;
    const [result] = await sequelize.query(
        'UPDATE users SET first_name = ?, last_name = ?, email = ?, mobile = ?, is_active = ? WHERE id = ?',
        {
            replacements: [firstName, lastName, email, mobile, isActive, id],
        }
    );
    return result;
};

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        try {
            // JWT token'ı doğrulama
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    message: "You must be logged in to update your data.",
                    code: 0
                });
            }

            // Token'ı decode et ve kullanıcı id'sini al
            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Gelen veriyi al
            const { firstName, lastName, email, mobile, isActive } = req.body;

            // Güncelleme işlemi
            const result = await updateUserById(userId, { firstName, lastName, email, mobile, isActive });

            // Etkilenen satır sayısını kontrol et
            if (result.affectedRows === 0) {
                return res.status(200).json({
                    message: 'User not found or no changes were made.',
                    code: 0
                });
            }

            // Başarılı güncelleme yanıtı
            return res.status(200).json({
                message: 'User data successfully updated',
                code: 1
            });
        } catch (error) {
            console.error('Error updating user data:', error);
            return res.status(500).json({ message: 'An error occurred', error: error.message });
        }
    } else {
        // Sadece PUT isteği kabul edilir
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}