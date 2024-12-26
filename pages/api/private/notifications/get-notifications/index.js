// --------------------------------
// |
// | Service Name: Get Notifications
// | Description: Fetch notifications based on type for the logged-in user.
// | Parameters: type (0, 1, 2)
// | Endpoint: /api/private/notifications/get-notifications
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import PersonalNotification from '@/models/PersonalNotification';
import GroupNotification from '@/models/GroupNotification';
import UserGroup from '@/models/UserGroup';
import User from '@/models/User'; // Kullanıcı modelini ekliyoruz
import { formatDate } from '@/helpers/dateFormatter'; // formatDate fonksiyonunu import et

const handler = async (req, res) => {
    if (req.method === 'GET') {
        const { type } = req.query;

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
            let notifications = [];

            if (type === '0' || type === '2') {
                // Personal notifications al
                const personalNotifications = await PersonalNotification.find({ user: userId });

                // Kullanıcı bilgilerini al
                const userIds = [...new Set(personalNotifications.map((n) => n.created_by))];
                const users = await User.find({ _id: { $in: userIds } });

                // `created_by` alanını kullanıcı adları ile değiştir
                const personalNotificationsWithUser = personalNotifications.map((notification) => {
                    const user = users.find((u) => u._id.toString() === notification.created_by.toString());
                    const fullName = user ? `${user.first_name} ${user.last_name}` : 'Unknown User';

                    // date ve createdAt alanlarını formatla
                    return {
                        ...notification.toObject(),
                        created_by: fullName,
                        date: formatDate(notification.date), // Formatlı tarih
                        createdAt: formatDate(notification.createdAt) // Formatlı createdAt
                    };
                });

                notifications = [...notifications, ...personalNotificationsWithUser];
            }

            if (type === '1' || type === '2') {
                // Kullanıcının bulunduğu grupları bul
                const userGroups = await UserGroup.find({ members: userId });
                const groupIds = userGroups.map(group => group._id);

                // Bu gruplara ait bildirimleri al
                const groupNotifications = await GroupNotification.find({ group: { $in: groupIds } });

                // Kullanıcı bilgilerini al
                const groupUserIds = [...new Set(groupNotifications.map((n) => n.created_by))];
                const groupUsers = await User.find({ _id: { $in: groupUserIds } });

                // Grup adlarını ve `created_by` alanını değiştir
                const groupNotificationsWithDetails = groupNotifications.map((notification) => {
                    const group = userGroups.find((g) => g._id.toString() === notification.group.toString());
                    const groupName = group ? group.group_name : 'Unknown Group';

                    const creator = groupUsers.find((u) => u._id.toString() === notification.created_by.toString());
                    const creatorName = creator ? `${creator.first_name} ${creator.last_name}` : 'Unknown User';

                    // date ve createdAt alanlarını formatla
                    return {
                        ...notification.toObject(),
                        group: groupName,
                        created_by: creatorName,
                        date: formatDate(notification.date), // Formatlı tarih
                        createdAt: formatDate(notification.createdAt) // Formatlı createdAt
                    };
                });

                notifications = [...notifications, ...groupNotificationsWithDetails];
            }

            if (notifications.length === 0) {
                // Eğer hiçbir bildirim bulunmazsa hata döndür
                return res.status(200).json({
                    code: 0,
                    message: 'Notifications not found'
                });
            }

            // Başarılı yanıt döndür
            res.status(200).json({
                code: 1,
                message: 'Notifications retrieved successfully',
                notifications
            });
        } catch (error) {
            console.error('Error while fetching notifications:', error);
            res.status(500).json({ message: 'An error occurred while fetching notifications', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;
