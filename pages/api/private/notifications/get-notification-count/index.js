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

const handler = async (req, res) => {
    if (req.method === 'GET') {
        // Token'dan kullanıcı bilgilerini al
        let userId;
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            userId = decoded?.id; // İstek yapan kullanıcının ID'si
        } catch (error) {
            return res.status(200).json({
                message: 'Invalid token, please log in again.',
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
                message: 'Notification count retrieved successfully',
                totalNotificationCount
            });
        } catch (error) {
            console.error('Error while fetching notification count:', error);
            res.status(500).json({ message: 'An error occurred while fetching the notification count', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;
