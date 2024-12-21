// --------------------------------
// |
// | Service Name: Get User Group Type By ID
// | Description: The service that fetches the user group type by ID.
// | Endpoint: /api/private/user-group-types/get-user-group-type-by-id
// |
// ------------------------------

import privateMiddleware from '@/middleware/private/index';
import UserGroupType from '@/models/UserGroupType'; // userGroupTypes koleksiyonunu temsil eden model

const findUserGroupTypeById = async (id) => {
    return await UserGroupType.findById(id).lean();
};

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const requestedGroupTypeId = req.query.id; // ID parametresini al

            // Group Type'ı ID ile bul
            const groupType = await findUserGroupTypeById(requestedGroupTypeId);

            if (!groupType) {
                return res.status(200).json({
                    message: 'Group Type not found',
                    code: 0,
                });
            }

            // Group Type bilgilerini döndür
            return res.status(200).json({
                message: 'Group Type fetched successfully',
                code: 1,
                groupType: {
                    id: groupType._id,
                    type_name: groupType.type_name,
                    created_by: groupType.created_by,
                    updated_by: groupType.updated_by,
                },
            });
        } catch (error) {
            console.error('Error fetching group type:', error);
            return res.status(500).json({
                message: 'An error occurred',
                error: error.message,
            });
        }
    } else {
        // Sadece GET isteği kabul edilir
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default privateMiddleware(handler);