// --------------------------------
// |
// | Service Name: Get Notification Count
// | Description: Fetch the total number of notifications for the logged-in user.
// | Endpoint: /api/private/notifications/get-notification-count
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import PersonalNotification from '@/models/PersonalNotification';
import GroupNotification from '@/models/GroupNotification';
import UserGroup from '@/models/UserGroup';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        // Token'dan kullanıcı bilgilerini al
        let userId;
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            userId = decoded?.id; // İstek yapan kullanıcının ID'si
        } catch (error) {
            return res.status(200).json({
                message: responseMessages.common[lang].invalidToken,
                code: 0
            });
        }

        try {
            // Personal notifications sayısını al (is_seen: false olanları)
            const personalCount = await PersonalNotification.countDocuments({
                user: userId,
                is_seen: false
            });

            // Kullanıcının grup üyeliklerini al
            const userGroups = await UserGroup.find({ members: userId }).select('_id');
            const groupIds = userGroups.map(group => group._id);

            // Group notifications sayısını al (is_seen: false olanları)
            const groupCount = await GroupNotification.countDocuments({
                group: { $in: groupIds },
                is_seen: false
            });

            // Toplam bildirimi hesapla
            const totalNotificationCount = personalCount + groupCount;

            // Yanıt döndür
            res.status(200).json({
                code: 1,
                message: responseMessages.notifications.getCount[lang].success,
                totalNotificationCount
            });
        } catch (error) {
            res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message
            });
        }
    } else {
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default handler;
