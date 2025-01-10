// --------------------------------
// |
// | Service Name: Change Password
// | Description: Service that allows admins to change a user's password.
// | Endpoint: /api/private/user/change-password-by-id
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import hashPassword from '@/helpers/hash';
import User from '@/models/User';
import privateMiddleware from '@/middleware/private/index';
import responseMessages from '@/static/responseMessages/messages';

// ID'si gönderilen kullanıcının şifresini getir
const getUserById = async (userId) => {
    return await User.findById(userId);
};

// Kullanıcının şifresini güncelle
const updateUserPasswordById = async (userId, newPassword) => {
    return await User.updateOne(
        { _id: userId },
        { $set: { password: newPassword } }
    );
};

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

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
                    message: responseMessages.user.changePassword[lang].provideAllFields,
                    code: 0
                });
            }

            // Yeni şifre ve doğrulama şifresinin eşleşip eşleşmediğini kontrol et
            if (newPassword !== confirmPassword) {
                return res.status(200).json({
                    message: responseMessages.user.changePassword[lang].passwordsDoNotMatch,
                    code: 0
                });
            }

            // Şifresi değiştirilecek kullanıcıyı ID'si ile bul
            const userToChange = await getUserById(userId);

            if (!userToChange) {
                return res.status(200).json({
                    message: responseMessages.user.changePassword[lang].userNotFound,
                    code: 0
                });
            }

            // Yetki kontrolleri
            if (loggedInUserRole === 0) {
                return res.status(403).json({
                    message: responseMessages.user.changePassword[lang].noPermission,
                    code: 0
                });
            }

            if (loggedInUserRole === 1 && (userToChange.role === 1 || userToChange.role === 2)) {
                return res.status(403).json({
                    message: responseMessages.user.changePassword[lang].notAuthorized,
                    code: 0
                });
            }

            if (loggedInUserRole === 2 && userToChange.role === 2) {
                return res.status(403).json({
                    message: responseMessages.user.changePassword[lang].notAuthorized2,
                    code: 0
                });
            }

            // Mevcut şifre kontrolü
            const existingPassword = userToChange.password;
            const isMatch = await bcrypt.compare(newPassword, existingPassword);

            if (isMatch) {
                return res.status(200).json({
                    message: responseMessages.user.changePassword[lang].cannotBeSame,
                    code: 0
                });
            }

            // Şifreyi güncelle
            const hashedPassword = await hashPassword(newPassword, 10);
            const result = await updateUserPasswordById(userId, hashedPassword);

            if (result.modifiedCount === 0) {
                return res.status(200).json({
                    message: responseMessages.user.changePassword[lang].failedToUpdate,
                    code: 0
                });
            }

            return res.status(200).json({
                message: responseMessages.user.changePassword[lang].success,
                code: 1
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message
            });
        }
    } else {
        res.setHeader('Allow', ['PATCH']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
