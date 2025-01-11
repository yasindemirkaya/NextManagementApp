// --------------------------------
// |
// | Service Name: Get User Group By ID
// | Description: The service that brings the user group whose ID is sent.
// | Endpoint: /api/private/group/get-user-group-by-id
// |
// ------------------------------

import privateMiddleware from '@/middleware/private/index';
import UserGroup from '@/models/UserGroup';
import User from '@/models/User';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        try {
            const groupId = req.query.id;

            // Kullanıcı grubunu ID ile bul
            const group = await UserGroup.findById(groupId).lean();

            if (!group) {
                return res.status(200).json({
                    message: responseMessages.group[lang].notFound,
                    code: 0,
                });
            }

            // Benzersiz user ID'lerini topla
            const userIds = new Set();
            if (group.created_by) userIds.add(group.created_by);
            if (group.updated_by) userIds.add(group.updated_by);
            if (group.group_leader) userIds.add(group.group_leader);

            // Kullanıcı bilgilerini al
            let users = [];
            if (userIds.size > 0) {
                users = await User.find({ '_id': { $in: Array.from(userIds) } }).lean();
            }

            // Kullanıcıları bir Map'e dönüştür
            const userMap = new Map();
            users.forEach(user => {
                userMap.set(user._id.toString(), `${user.first_name} ${user.last_name}`);
            });

            // Kullanıcı grubuna kullanıcı adlarını ekle
            const formattedGroup = {
                ...group,
                created_by: userMap.get(group.created_by?.toString()) || group.created_by,
                updated_by: userMap.get(group.updated_by?.toString()) || group.updated_by,
                group_leader: userMap.get(group.group_leader?.toString()) || group.group_leader,
                group_leader_id: group.group_leader ? group.group_leader.toString() : null, // ID'yi ekliyoruz
            };

            return res.status(200).json({
                message: responseMessages.group[lang].success,
                code: 1,
                group: formattedGroup,
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
