// --------------------------------
// |
// | Service Name: Update User By ID
// | Description: Service that allows administrators to update other users' accounts.
// | Parameters: id, first_name, last_name, email, mobile, role, is_active, is_verified
// | Endpoint: /api/private/user/update-user-by-id
// |
// ------------------------------
import sequelize from '@/config/db';
import { verify } from 'jsonwebtoken';
import { isTokenExpiredServer } from '@/helpers/tokenVerifier';

// Kullanıcıyı ID'ye göre veritabanında bul
const findUserById = async (id) => {
    const query = `SELECT * FROM users WHERE id = ? LIMIT 1`;
    const [results] = await sequelize.query(query, {
        replacements: [id],
    });

    return results[0] || null; // Kullanıcı bulunmazsa null döndür
};

const updateUserById = async (id, updateData) => {
    const fields = [];
    const replacements = [];

    // Güncellenebilir alanları dinamik olarak ekle
    Object.keys(updateData).forEach((key) => {
        fields.push(`${key} = ?`);
        replacements.push(updateData[key]);
    });

    // ID'yi replacements array'ine ekle
    replacements.push(id);

    const query = `
        UPDATE users 
        SET ${fields.join(', ')}, updatedAt = NOW() 
        WHERE id = ?`;
    const [result] = await sequelize.query(query, { replacements });
    return result.affectedRows > 0;
};

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        try {
            // JWT token doğrulama
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    message: "You must be logged in to access this service.",
                    code: 0
                });
            }

            // Token süresi dolmuş mu kontrol et
            if (isTokenExpiredServer(token)) {
                return res.status(401).json({
                    message: 'Token has expired, please log in again.',
                    code: 0
                });
            }

            // Token decode et ve kullanıcı bilgilerini al
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: loggedInUserId, role: loggedInUserRole } = decoded;

            // Standard User'lar (role: 0) bu servisi kullanamaz
            if (loggedInUserRole === 0) {
                return res.status(403).json({
                    message: 'You are not authorized to access this service.',
                    code: 0
                });
            }

            // Request body ve id'yi alın
            const { id: requestedUserId, ...updateData } = req.body;

            if (!requestedUserId) {
                return res.status(200).json({
                    message: 'User ID is required.',
                    code: 0
                });
            }

            // Güncellenen kullanıcıyı bul
            const requestedUser = await findUserById(requestedUserId);
            if (!requestedUser) {
                return res.status(200).json({
                    message: 'User not found.',
                    code: 0
                });
            }

            // Yetki kontrolü
            if (loggedInUserRole === 1) {
                // Admin, sadece Standard User'ları (role: 0) güncelleyebilir
                if (requestedUser.role !== 0) {
                    return res.status(200).json({
                        message: 'You are not authorized to update this user.',
                        code: 0
                    });
                }
            } else if (loggedInUserRole === 2) {
                // Super Admin, kendisi gibi Super Adminler hariç herkesi güncelleyebilir.
                if (requestedUser.role === 2) {
                    return res.status(200).json({
                        message: 'You are not authorized to update this user.',
                        code: 0
                    });
                }
            }

            // Güncelleme işlemi (updatedBy alanını backend'de belirtiyoruz)
            const isUpdated = await updateUserById(requestedUserId, {
                ...updateData,
                updated_by: loggedInUserId
            });

            if (!isUpdated) {
                return res.status(200).json({
                    message: 'Failed to update user.',
                    code: 0
                });
            }

            return res.status(200).json({
                message: 'User updated successfully.',
                code: 1
            });
        } catch (error) {
            console.error('Error updating user by ID:', error);
            return res.status(200).json({
                message: 'An error occurred.',
                error: error.message,
                code: 0
            });
        }
    } else {
        // Sadece PUT metodu kabul edilir
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
