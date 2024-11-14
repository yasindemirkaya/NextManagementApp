// --------------------------------
// |
// | Service Name: Change Password
// | Description: Service that allows the user to change their password.
// | Endpoint: /api/private/user/change-password
// |
// ------------------------------

import sequelize from '@/config/db';
import bcrypt from 'bcrypt';
import { verify } from 'jsonwebtoken';
import hashPassword from '@/helpers/hash';
import { isTokenExpiredServer } from '@/helpers/tokenVerifier';

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

const updateUserPasswordById = async (userId, newPassword) => {
    const [result] = await sequelize.query(
        'UPDATE users SET password = ? WHERE id = ?',
        {
            replacements: [newPassword, userId],
        }
    );
    return result;
};

export default async function handler(req, res) {
    if (req.method === 'PATCH') {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(200).json({
                    message: "You must be logged in to change your password.",
                    code: 0
                });
            }

            if (isTokenExpiredServer(token)) {
                return res.status(200).json({
                    message: "Token has expired. Please log in again.",
                    code: 0
                });
            }

            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const { currentPassword, newPassword, confirmPassword } = req.body;

            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.status(200).json({
                    message: 'Please provide all required fields.',
                    code: 0
                });
            }

            if (newPassword !== confirmPassword) {
                return res.status(200).json({
                    message: 'New password and confirm password do not match.',
                    code: 0
                });
            }

            const existingPassword = await getUserPasswordById(userId);
            if (!existingPassword) {
                return res.status(200).json({
                    message: 'User not found.',
                    code: 0
                });
            }

            const isMatch = await bcrypt.compare(currentPassword, existingPassword);
            if (!isMatch) {
                return res.status(200).json({
                    message: 'Current password is incorrect.',
                    code: 0
                });
            }

            const hashedPassword = await hashPassword(newPassword, 10);
            const result = await updateUserPasswordById(userId, hashedPassword);

            if (result.affectedRows === 0) {
                return res.status(500).json({ message: 'Failed to update password.' });
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
