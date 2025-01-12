// --------------------------------
// |
// | Service Name: Get Dashboard Statistics
// | Description: Service to get dashboard statistics data
// | Endpoint: /api/private/statistics/get-dashboard-statistics
// |
// ------------------------------

import User from '@/models/User';
import UserGroup from '@/models/UserGroup';
import UserGroupType from '@/models/UserGroupType';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        try {
            // Toplam kayıt sayısını getir
            const [userCount, userGroupCount, userGroupTypeCount] = await Promise.all([
                User.countDocuments(),
                UserGroup.countDocuments(),
                UserGroupType.countDocuments()
            ]);

            res.status(200).json({
                code: 1,
                message: responseMessages.statistics.dashboard[lang].success,
                data: {
                    userCount,
                    userGroupCount,
                    userGroupTypeCount
                }
            });
        } catch (error) {
            res.status(500).json({
                code: 0,
                message: responseMessages.statistics.dashboard[lang].failedToFetch
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
