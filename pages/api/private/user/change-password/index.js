// --------------------------------
// |
// | Service Name: Change Password
// | Description: Service that allows the user to change their password.
// | Endpoint: /api/private/user/change-password
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import hashPassword from '@/helpers/hash';
import User from '@/models/User';
import privateMiddleware from "@/middleware/private/index"
import responseMessages from '@/static/responseMessages/messages';

const getUserPasswordById = async (userId) => {
    const user = await User.findById(userId);
    return user ? user.password : null;
};

const updateUserPasswordById = async (userId, newPassword) => {
    const result = await User.updateOne(
        { _id: userId },
        { $set: { password: newPassword } }
    );
    return result;
};

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'PATCH') {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const { currentPassword, newPassword, confirmPassword } = req.body;

            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.status(200).json({
                    message: responseMessages.user.changePassword[lang].allFieldsRequired,
                    code: 0
                });
            }

            // Yeni şifre ve Şifreyi onayla alanları eşleşmelidir.
            if (newPassword !== confirmPassword) {
                return res.status(200).json({
                    message: responseMessages.user.changePassword[lang].passwordsDoNotMatch,
                    code: 0
                });
            }

            // Kullanıcının varolan şifresini al
            const existingPassword = await getUserPasswordById(userId);
            if (!existingPassword) {
                return res.status(200).json({
                    message: responseMessages.user.changePassword[lang].userNotFound,
                    code: 0
                });
            }

            // currentPassword ve existingPassword eşleşmelidir.
            const isMatch = await bcrypt.compare(currentPassword, existingPassword);
            if (!isMatch) {
                return res.status(200).json({
                    message: responseMessages.user.changePassword[lang].currentIncorrect,
                    code: 0
                });
            }

            // Yeni şifre mevcut şifreyle aynı olamaz
            if (newPassword === currentPassword) {
                return res.status(200).json({
                    message: responseMessages.user.changePassword[lang].cannotBeSame,
                    code: 0
                });
            }

            const hashedPassword = await hashPassword(newPassword, 10);
            const result = await updateUserPasswordById(userId, hashedPassword);

            if (result.modifiedCount === 0) {
                return res.status(200).json({
                    message: responseMessages.user.changePassword[lang].failedToUpdate,
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
}

export default privateMiddleware(handler);