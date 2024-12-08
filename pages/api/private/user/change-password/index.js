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
    if (req.method === 'PATCH') {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const { currentPassword, newPassword, confirmPassword } = req.body;

            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.status(200).json({
                    message: 'Please provide all required fields.',
                    code: 0
                });
            }

            // Yeni şifre ve Şifreyi onayla alanları eşleşmelidir.
            if (newPassword !== confirmPassword) {
                return res.status(200).json({
                    message: 'New password and confirm password do not match.',
                    code: 0
                });
            }

            // Kullanıcının varolan şifresini al
            const existingPassword = await getUserPasswordById(userId);
            if (!existingPassword) {
                return res.status(200).json({
                    message: 'User not found.',
                    code: 0
                });
            }

            // currentPassword ve existingPassword eşleşmelidir.
            const isMatch = await bcrypt.compare(currentPassword, existingPassword);
            if (!isMatch) {
                return res.status(200).json({
                    message: 'Current password is incorrect.',
                    code: 0
                });
            }

            // Yeni şifre mevcut şifreyle aynı olamaz
            if (newPassword === currentPassword) {
                return res.status(200).json({
                    message: 'New password cannot be the same as the current password.',
                    code: 0
                });
            }

            const hashedPassword = await hashPassword(newPassword, 10);
            const result = await updateUserPasswordById(userId, hashedPassword);

            if (result.modifiedCount === 0) {
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
}

export default privateMiddleware(handler);