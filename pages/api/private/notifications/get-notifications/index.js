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
import User from '@/models/User';
import { formatDate } from '@/helpers/dateFormatter';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        const { type, limit, page } = req.query;

        let userId;
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            userId = decoded?.id;
        } catch (error) {
            return res.status(200).json({
                message: 'Invalid token, please log in again.',
                code: 0
            });
        }

        try {
            const limitValue = limit ? parseInt(limit) : 4; // Varsayılan limit
            const pageValue = page ? parseInt(page) : 1; // Varsayılan sayfa
            const skipValue = (pageValue - 1) * limitValue;

            let allNotifications = [];

            // Personal Notifications
            if (type === '0' || type === '2') {
                const personalNotifications = await PersonalNotification.find({ user: userId });
                const userIds = [...new Set(personalNotifications.map((n) => n.created_by))];
                const users = await User.find({ _id: { $in: userIds } });

                const personalNotificationsWithDetails = personalNotifications.map((notification) => {
                    const user = users.find((u) => u._id.toString() === notification.created_by.toString());
                    const fullName = user ? `${user.first_name} ${user.last_name}` : 'Unknown User';

                    return {
                        ...notification.toObject(),
                        created_by: fullName,
                        date: formatDate(notification.date),
                        createdAt: formatDate(new Date(notification.createdAt)),
                        updatedAt: formatDate(new Date(notification.updatedAt))
                    };
                });

                allNotifications = [...allNotifications, ...personalNotificationsWithDetails];
            }

            // Group Notifications
            if (type === '1' || type === '2') {
                const userGroups = await UserGroup.find({ members: userId });
                const groupIds = userGroups.map(group => group._id);

                const groupNotifications = await GroupNotification.find({ group: { $in: groupIds } });
                const groupUserIds = [...new Set(groupNotifications.map((n) => n.created_by))];
                const groupUsers = await User.find({ _id: { $in: groupUserIds } });

                const groupNotificationsWithDetails = groupNotifications.map((notification) => {
                    const group = userGroups.find((g) => g._id.toString() === notification.group.toString());
                    const groupName = group ? group.group_name : 'Unknown Group';

                    const creator = groupUsers.find((u) => u._id.toString() === notification.created_by.toString());
                    const creatorName = creator ? `${creator.first_name} ${creator.last_name}` : 'Unknown User';

                    return {
                        ...notification.toObject(),
                        group: groupName,
                        created_by: creatorName,
                        date: formatDate(notification.date),
                        createdAt: formatDate(new Date(notification.createdAt)),
                        updatedAt: formatDate(new Date(notification.updatedAt))
                    };
                });

                allNotifications = [...allNotifications, ...groupNotificationsWithDetails];
            }

            // Tüm bildirimleri sıralayın (en güncel ilk sırada)
            const sortedNotifications = allNotifications.sort((a, b) => b.createdAt - a.createdAt);

            // Limiti ve sayfalamayı uygulayın
            const paginatedNotifications = sortedNotifications.slice(skipValue, skipValue + limitValue);

            if (paginatedNotifications.length === 0) {
                return res.status(200).json({
                    code: 0,
                    message: 'Notifications not found'
                });
            }

            // Pagination bilgisi ekleyin
            return res.status(200).json({
                code: 1,
                message: 'Notifications retrieved successfully',
                notifications: paginatedNotifications,
                pagination: {
                    totalData: sortedNotifications.length,
                    totalPages: Math.ceil(sortedNotifications.length / limitValue),
                    currentPage: pageValue,
                    limit: limitValue
                }
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