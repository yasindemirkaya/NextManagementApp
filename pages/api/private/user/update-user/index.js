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
import { isTokenExpiredServer } from '@/helpers/tokenVerifier';

// Kullanıcının güncellediği email adresi ya da telefon ile varolan kayıt var mı diye kontrol
const isDataAlreadyExists = async (email, mobile, currentEmail, currentMobile) => {
    const conditions = [];
    const replacements = [];

    // Eğer email değişmişse, bu email'in başkası tarafından kullanılıp kullanılmadığını kontrol et
    if (email !== currentEmail) {
        conditions.push('email = ?');
        replacements.push(email);
    }

    // Eğer mobile değişmişse, bu telefon numarasının başkası tarafından kullanılıp kullanılmadığını kontrol et
    if (mobile !== currentMobile) {
        conditions.push('mobile = ?');
        replacements.push(mobile);
    }

    if (conditions.length > 0) {
        const [results] = await sequelize.query(
            `SELECT id FROM users WHERE ${conditions.join(' OR ')}`,
            {
                replacements,
            }
        );
        return results.length > 0;
    }
    return false;
};

// Update methodu
const updateUserById = async (id, userData, currentEmail, currentMobile) => {
    const { firstName, lastName, email, mobile, isActive, isVerified, updatedBy } = userData;

    // Email ya da mobile değiştiyse, varolan kayıtları kontrol et
    const dataExists = await isDataAlreadyExists(email, mobile, currentEmail, currentMobile);
    if (dataExists) {
        return { success: false, message: 'Email or mobile is already in use.' };
    }

    // Email yoksa güncelleme işlemi yapılır
    const [result] = await sequelize.query(
        'UPDATE users SET first_name = ?, last_name = ?, email = ?, mobile = ?, is_active = ?, is_verified = ?, updated_by = ? WHERE id = ?',
        {
            replacements: [firstName, lastName, email, mobile, isActive, isVerified, updatedBy, id],
        }
    );
    return { success: true, result };
};

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        try {
            // JWT token'ı doğrulama
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(200).json({
                    message: "You must be logged in to update your data.",
                    code: 0
                });
            }

            // Token'ın süresi dolmuş mu diye kontrol et
            if (isTokenExpiredServer(token)) {
                return res.status(401).json({
                    message: "Token has expired. Please log in again.",
                    code: 0
                });
            }

            // Token'ı decode et ve kullanıcı id'sini al
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

            // Email zaten mevcutsa, sonuç false dönecek
            if (!result.success) {
                return res.status(200).json({
                    message: result.message,
                    code: 0
                });
            }

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
            console.error('Error updating user data:', error);
            return res.status(500).json({ message: 'An error occurred', error: error.message });
        }
    } else {
        // Sadece PUT isteği kabul edilir
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
