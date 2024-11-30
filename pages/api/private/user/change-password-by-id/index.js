// --------------------------------
// |
// | Service Name: Change Password
// | Description: Service that allows admins to change a user's password.
// | Endpoint: /api/private/user/change-password-by-id
// |
// ------------------------------

import sequelize from '@/config/db';
import bcrypt from 'bcrypt';
import { verify } from 'jsonwebtoken';
import hashPassword from '@/helpers/hash';
import privateMiddleware from "@/middleware/private/index"

// ID'si gönderilen kullanıcının şifresini getir
const getUserPasswordById = async (userId) => {
    const [user] = await sequelize.query(
        'SELECT password FROM users WHERE id = ?',
        {
            replacements: [userId],
            type: sequelize.QueryTypes.SELECT
        }
    );
    return user ? user.password : null;
};

// Kullanıcının şifresini güncelle
const updateUserPasswordById = async (userId, newPassword) => {
    const [result] = await sequelize.query(
        'UPDATE users SET password = ? WHERE id = ?',
        {
            replacements: [newPassword, userId],
        }
    );
    return result;
};

// Kullanıcıyı ID'sine göre veritabanından almak
const getUserById = async (userId) => {
    const [user] = await sequelize.query(
        'SELECT id, role, password FROM users WHERE id = ?',
        {
            replacements: [userId],
            type: sequelize.QueryTypes.SELECT
        }
    );
    return user || null;  // Eğer kullanıcı bulunursa döndür, yoksa null
};

const handler = async (req, res) => {
    if (req.method === 'PATCH') {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const loggedInUserRole = decoded.role;

            // Request body
            const { userId, newPassword, confirmPassword } = req.body;

            // Şifre değişikliği için gerekli alanların kontrolü
            if (!userId || !newPassword || !confirmPassword) {
                return res.status(200).json({
                    message: 'Please provide all required fields.',
                    code: 0
                });
            }

            // Yeni şifre ve doğrulama şifresinin eşleşip eşleşmediğini kontrol et
            if (newPassword !== confirmPassword) {
                return res.status(200).json({
                    message: 'New password and confirm password do not match.',
                    code: 0
                });
            }

            // Şifresi değiştirilecek kullanıcıyı ID'si ile bul
            const userToChange = await getUserById(userId);

            // Kullanıcı bulunamadıysa hata döndür
            if (!userToChange) {
                return res.status(200).json({
                    message: 'User not found.',
                    code: 0
                });
            }

            // Standard user (role 0), sadece kendi şifresini değiştirebilir
            if (loggedInUserRole === 0) {
                return res.status(403).json({
                    message: 'You are not authorized to change passwords.',
                    code: 0
                });
            }
            // Admin (role 1), sadece standard user (role 0) şifresini değiştirebilir
            if (loggedInUserRole === 1) {
                if (userToChange.role === 1 || userToChange.role === 2) {
                    return res.status(403).json({
                        message: 'You are not authorized to change passwords of other admins or super admins.',
                        code: 0
                    });
                }
            }

            // Super admin (role 2), sadece admin (role 1) ve standard user (role 0) şifresini değiştirebilir
            if (loggedInUserRole === 2) {
                if (userToChange.role === 2) {
                    return res.status(403).json({
                        message: 'You are not authorized to change another super admin’s password.',
                        code: 0
                    });
                }
            }

            // Kullanıcının mevcut şifresini kontrol et
            const existingPassword = await getUserPasswordById(userId);
            if (!existingPassword) {
                return res.status(200).json({
                    message: 'User not found.',
                    code: 0
                });
            }

            const isMatch = await bcrypt.compare(newPassword, existingPassword);  // bcrypt.compare() kullanıyoruz

            if (isMatch) {
                return res.status(200).json({
                    message: 'New password cannot be the same as the current password.',
                    code: 0
                });
            }

            // Herhangi bir sorun yoksa şifreyi güncelle
            const hashedPassword = await hashPassword(newPassword, 10);
            const result = await updateUserPasswordById(userId, hashedPassword);

            if (result.affectedRows === 0) {
                return res.status(200).json({ message: 'Failed to update password.' });
            }

            return res.status(200).json({
                message: 'Password successfully changed.',
                code: 1
            });
        } catch (error) {
            console.error('Error changing password:', error);
            return res.status(500).json({ message: 'An error occurred', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['PATCH']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default privateMiddleware(handler);
