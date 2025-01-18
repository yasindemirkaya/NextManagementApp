// --------------------------------
// |
// | Service Name: Update User Group Type
// | Description: Service that allows super admin to update a user group type's name.
// | Parameters: groupTypeId, newTypeName
// | Endpoint: /api/private/user-group-types/update-user-group
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import UserGroupType from '@/models/UserGroupType';
import User from '@/models/User';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'PUT') {
        try {
            // Token'ı decode et ve kullanıcının ID'sini ve rolünü al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: userId, role } = decoded;

            // Super admin (2) değilse işlem reddedilir
            if (role !== 2) {
                return res.status(403).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0,
                });
            }

            // Request body'den gerekli parametreleri al
            const { groupTypeId, newTypeName } = req.body;

            if (!groupTypeId || !newTypeName) {
                return res.status(400).json({
                    message: responseMessages.userGroupTypes.update[lang].idRequired,
                    code: 0,
                });
            }

            // Güncelleme yapılacak grup türünü bul
            const groupType = await UserGroupType.findById(groupTypeId);
            if (!groupType) {
                return res.status(404).json({
                    message: responseMessages.userGroupTypes.update[lang].groupNotFound,
                    code: 0,
                });
            }

            // Güncelleme yapan kullanıcının bilgilerini al
            const updatingUser = await User.findById(userId);
            if (!updatingUser) {
                return res.status(404).json({
                    message: responseMessages.common[lang].userNotFound,
                    code: 0,
                });
            }
            const updatedByName = `${updatingUser.first_name} ${updatingUser.last_name}`;

            // Grup türünün ismini ve updated_by alanını güncelle
            groupType.type_name = newTypeName;
            groupType.updated_by = updatedByName;

            await groupType.save();

            return res.status(200).json({
                message: responseMessages.userGroupTypes.update[lang].success,
                code: 1,
                updated_group_type: {
                    _id: groupType._id,
                    type_name: groupType.type_name,
                    updated_by: groupType.updated_by,
                    updatedAt: groupType.updatedAt,
                },
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccurred,
                error: error.message,
                code: 0,
            });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
