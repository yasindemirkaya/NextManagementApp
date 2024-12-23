// --------------------------------
// |
// | Service Name: Update Notification
// | Description: Service to update the "is_seen" field of a notification.
// | Parameters: notificationId
// | Endpoint: /api/private/notifications/update-notification
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import PersonalNotification from '@/models/PersonalNotification';
import GroupNotification from '@/models/GroupNotification';
import UserGroup from '@/models/UserGroup';

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        const { notificationId } = req.body;

        // Token'dan kullanıcı bilgilerini al
        let loggedInUserRole;
        let loggedInUserId;
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            loggedInUserRole = decoded?.role;
            loggedInUserId = decoded?.id;
        } catch (error) {
            return res.status(200).json({
                message: 'Invalid token, please log in again.',
                code: 0
            });
        }

        // Data kontrolü: notificationId gerekli
        if (!notificationId) {
            return res.status(200).json({
                code: 0,
                message: 'Notification ID is required'
            });
        }

        try {
            // 1. Adım: notificationId'yi personalNotifications veya groupNotifications içinde bul
            const personalNotification = await PersonalNotification.findById(notificationId);
            const groupNotification = await GroupNotification.findById(notificationId);

            if (personalNotification) {
                // 2. Adım: personalNotifications içinde ise, "user" ile karşılaştırma yap
                if (personalNotification.user.toString() === loggedInUserId.toString()) {
                    // 3. Adım: eşleşirse "is_seen" değerini true yap
                    personalNotification.is_seen = true;
                    await personalNotification.save();
                    return res.status(200).json({
                        code: 1,
                        message: 'Notification updated successfully',
                        notification: personalNotification
                    });
                } else {
                    return res.status(200).json({
                        message: 'This notification is not yours to update. You can only update your own notifications.',
                        code: 0
                    });
                }
            }

            if (groupNotification) {
                // 2. Adım: groupNotifications içinde ise, "group" ile karşılaştırma yap
                const userGroup = await UserGroup.findById(groupNotification.group);

                if (userGroup && userGroup.group_leader.toString() === loggedInUserId.toString()) {
                    // 3. Adım: eşleşirse "is_seen" değerini true yap
                    groupNotification.is_seen = true;
                    await groupNotification.save();
                    return res.status(200).json({
                        code: 1,
                        message: 'Notification updated successfully',
                        notification: groupNotification
                    });
                } else {
                    return res.status(200).json({
                        message: 'You do not have permission to update this notification. Only the group leader can update this notification.',
                        code: 0
                    });
                }
            }

            // Eğer notification her iki koleksiyonda da bulunmazsa:
            return res.status(200).json({
                message: 'Notification not found',
                code: 0
            });
        } catch (error) {
            console.error('Error while updating notification:', error);
            res.status(500).json({ message: 'An error occurred while updating the notification', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;
