// --------------------------------
// |
// | Service Name: Delete User Group Type
// | Description: Service that allows super admin to delete a user group type by ID.
// | Parameters: groupTypeId (as a body parameter)
// | Endpoint: /api/private/user-group-types/delete-user-group-type
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import UserGroupType from '@/models/UserGroupType';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'DELETE') {
        try {
            // Token'ı decode et ve kullanıcı rolünü al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { role } = decoded;

            // Super admin (2) değilse işlem reddedilir
            if (role !== 2) {
                return res.status(403).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0,
                });
            }

            // Request body'den groupTypeId'yi al
            const { groupTypeId } = req.body;

            if (!groupTypeId) {
                return res.status(400).json({
                    message: responseMessages.userGroupTypes.delete[lang].groupTypeIdRequired,
                    code: 0
                });
            }

            // Belirtilen ID ile grup tipini bul ve sil
            const deletedGroupType = await UserGroupType.findByIdAndDelete(groupTypeId);

            if (!deletedGroupType) {
                return res.status(404).json({
                    message: responseMessages.userGroupTypes.delete[lang].groupTypeNotFound,
                    code: 0,
                });
            }

            return res.status(200).json({
                message: responseMessages.userGroupTypes.delete[lang].success,
                code: 1,
                deleted_group_type: deletedGroupType,
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message,
                code: 0
            });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
