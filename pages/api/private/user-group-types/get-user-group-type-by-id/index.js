// --------------------------------
// |
// | Service Name: Get User Group Type By ID
// | Description: The service that fetches the user group type by ID.
// | Endpoint: /api/private/user-group-types/get-user-group-type-by-id
// |
// ------------------------------

import privateMiddleware from '@/middleware/private/index';
import UserGroupType from '@/models/UserGroupType';
import responseMessages from '@/static/responseMessages/messages';

const findUserGroupTypeById = async (id) => {
    return await UserGroupType.findById(id).lean();
};

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        try {
            const requestedGroupTypeId = req.query.id; // ID parametresini al

            // Group Type'ı ID ile bul
            const groupType = await findUserGroupTypeById(requestedGroupTypeId);

            if (!groupType) {
                return res.status(200).json({
                    message: responseMessages.userGroupTypes.getById[lang].notFound,
                    code: 0,
                });
            }

            // Group Type bilgilerini döndür
            return res.status(200).json({
                message: responseMessages.userGroupTypes.getById[lang].success,
                code: 1,
                groupType: {
                    id: groupType._id,
                    type_name: groupType.type_name,
                    created_by: groupType.created_by,
                    updated_by: groupType.updated_by,
                },
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message,
            });
        }
    } else {
        // Sadece GET isteği kabul edilir
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);