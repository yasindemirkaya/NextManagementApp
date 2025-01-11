// --------------------------------
// |
// | Service Name: Delete User Group By ID
// | Description: Service that allows admins to delete a user group by ID.
// | Endpoint: /api/private/user/delete-user-group
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import UserGroup from '@/models/UserGroup';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

// Delete user group by ID method
const deleteUserGroupById = async (groupId) => {
    // MongoDB'de silme işlemi
    const result = await UserGroup.findByIdAndDelete(groupId);
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

            // İşlemi yapan kullanıcının bilgileri
            const requestingUserRole = decoded.role;
            const requestingUserId = decoded.id;

            // Silinecek grup ID'si
            const { groupId: targetGroupId } = req.body;

            if (!targetGroupId) {
                return res.status(200).json({
                    message: responseMessages.group.delete[lang].groupIdRequired,
                    code: 0
                });
            }

            // Super Admin (role: 2) her grubu silebilir
            if (requestingUserRole === 2) {
                const result = await deleteUserGroupById(targetGroupId);
                if (!result) {
                    return res.status(404).json({
                        message: responseMessages.group.delete[lang].notFound,
                        code: 0
                    });
                }
                return res.status(200).json({
                    message: responseMessages.group.delete[lang].success,
                    code: 1
                });
            }

            // Admin (role: 1) sadece kendi oluşturduğu grupları silebilir
            if (requestingUserRole === 1) {
                // Silinmek istenen grubun yaratıcısını kontrol et
                const group = await UserGroup.findById(targetGroupId).select('created_by');
                if (!group) {
                    return res.status(404).json({
                        message: responseMessages.group.delete[lang].notFound,
                        code: 0
                    });
                }

                if (group.created_by.toString() !== requestingUserId) {
                    return res.status(403).json({
                        message: responseMessages.group.delete[lang].adminPermission,
                        code: 0
                    });
                }

                const result = await deleteUserGroupById(targetGroupId);
                if (!result) {
                    return res.status(404).json({
                        message: responseMessages.group.delete[lang].notFound,
                        code: 0
                    });
                }

                return res.status(200).json({
                    message: responseMessages.group.delete[lang].success,
                    code: 1
                });
            }

            // Standart kullanıcı (role: 0) bu endpointi kullanamaz
            return res.status(403).json({
                message: responseMessages.common[lang].noPermission,
                code: 0
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message,
                code: 0
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
