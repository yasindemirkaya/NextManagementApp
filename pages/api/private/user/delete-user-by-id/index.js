// --------------------------------
// |
// | Service Name: Delete User By ID
// | Description: Service that allows admins to delete a user by ID.
// | Endpoint: /api/private/user/delete-user-by-id
// |
// ------------------------------

import sequelize from '@/config/db';
import { verify } from 'jsonwebtoken';
import privateMiddleware from "@/middleware/private/index";

// Delete user by ID method
const deleteUserById = async (userId) => {
    const [result] = await sequelize.query(
        'DELETE FROM users WHERE id = ?',
        {
            replacements: [userId],
        }
    );
    return result;
};

const handler = async (req, res) => {
    if (req.method === 'DELETE') {
        try {
            // Authorization başlığındaki token'ı al ve çöz
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);

            // İşlemi yapan kullanıcının bilgileri
            const requestingUserId = decoded.id;
            const requestingUserRole = decoded.role;

            // Hesabı silinecek olan kullanıcının ID'si
            const { userId: targetUserId } = req.body;

            if (!targetUserId) {
                return res.status(200).json({
                    message: 'Target user ID is required',
                    code: 0
                });
            }

            // Super Admin (role: 2) her kullanıcıyı silebilir
            if (requestingUserRole === 2) {
                const result = await deleteUserById(targetUserId);
                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        message: 'User not found or already deleted',
                        code: 0
                    });
                }
                return res.status(200).json({
                    message: 'User account has been deleted successfully.',
                    code: 1
                });
            }

            // Admin (role: 1) sadece standart kullanıcıları (role: 0) silebilir
            if (requestingUserRole === 1) {
                // Silinmek istenen kullanıcının rolünü kontrol et
                const [users] = await sequelize.query(
                    'SELECT role FROM users WHERE id = ?',
                    {
                        replacements: [targetUserId],
                    }
                );

                if (users.length === 0) {
                    return res.status(200).json({
                        message: 'User not found',
                        code: 0
                    });
                }

                const targetUserRole = users[0].role;
                if (targetUserRole !== 0) {
                    return res.status(200).json({
                        message: 'Admins can only delete standard user accounts',
                        code: 0
                    });
                }

                const result = await deleteUserById(targetUserId);
                return res.status(200).json({
                    message: 'User account has been deleted successfully',
                    code: 1
                });
            }

            // Standart kullanıcı (role: 0) bu endpointi kullanamaz
            return res.status(200).json({
                message: 'You are not authorized to perform this action',
                code: 0
            });
        } catch (error) {
            console.error('Error deleting user by ID:', error);
            return res.status(200).json({ message: 'An error occurred', error: error.message });
        }
    } else {
        // Sadece DELETE isteği kabul edilir
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default privateMiddleware(handler);