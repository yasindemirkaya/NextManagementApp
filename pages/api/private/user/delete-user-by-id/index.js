// --------------------------------
// |
// | Service Name: Delete User By ID
// | Description: Service that allows admins to delete a user by ID.
// | Endpoint: /api/private/user/delete-user-by-id
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import User from '@/models/User';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

// Delete user by ID method
const deleteUserById = async (userId) => {
    // Kullanıcıyı veritabanından sil
    const result = await User.deleteOne({ _id: userId });
    return result;
};

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'DELETE') {
        try {
            // Authorization başlığındaki token'ı al ve çöz
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);

            // İşlemi yapan kullanıcının rolünü al
            const requestingUserRole = decoded.role;

            // Hesabı silinecek olan kullanıcının ID'si
            const { userId: targetUserId } = req.body;

            if (!targetUserId) {
                return res.status(200).json({
                    message: responseMessages.user.deleteUserById[lang].userIdRequired,
                    code: 0
                });
            }

            // Super Admin (role: 2) her kullanıcıyı silebilir
            if (requestingUserRole === 2) {
                const result = await deleteUserById(targetUserId);
                if (result.deletedCount === 0) {
                    return res.status(200).json({
                        message: responseMessages.user.deleteUserById[lang].notFound,
                        code: 0
                    });
                }
                return res.status(200).json({
                    message: responseMessages.user.deleteUserById[lang].success,
                    code: 1
                });
            }

            // Admin (role: 1) sadece standart kullanıcıları (role: 0) silebilir
            if (requestingUserRole === 1) {
                const targetUser = await User.findById(targetUserId);

                if (!targetUser) {
                    return res.status(200).json({
                        message: responseMessages.user.deleteUserById[lang].notFound,
                        code: 0
                    });
                }

                const targetUserRole = targetUser.role;
                if (targetUserRole !== 0) {
                    return res.status(200).json({
                        message: responseMessages.user.deleteUserById[lang].adminPermission,
                        code: 0
                    });
                }

                const result = await deleteUserById(targetUserId);
                return res.status(200).json({
                    message: responseMessages.user.deleteUserById[lang].success,
                    code: 1
                });
            }

            // Standart kullanıcı (role: 0) bu endpointi kullanamaz
            return res.status(200).json({
                message: responseMessages.common[lang].noPermission,
                code: 0
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message
            });
        }
    } else {
        // Sadece DELETE isteği kabul edilir
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);