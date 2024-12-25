// --------------------------------
// |
// | Service Name: Update Notification
// | Description: Updates the "is_seen" status of a notification.
// | Endpoint: /api/private/notifications/update-notification
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import PersonalNotification from '@/models/PersonalNotification';
import GroupNotification from '@/models/GroupNotification';
import UserGroup from '@/models/UserGroup';

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        const { notificationId, type } = req.body;

        // Kullanıcı kimliğini doğrula
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

        // Gerekli alanları kontrol et
        if (!notificationId || type === undefined) {
            return res.status(200).json({
                code: 0,
                message: 'notificationId and type are required.'
            });
        }

        try {
            // Type 0 ise bildirim personalNotification içinde aranır
            if (type === 0) {
                // PersonalNotification kontrolü
                const notification = await PersonalNotification.findById(notificationId);

                if (!notification) {
                    return res.status(200).json({
                        code: 0,
                        message: 'Notification not found.'
                    });
                }

                // Kullanıcı doğrulaması
                if (notification.user.toString() !== userId) {
                    return res.status(200).json({
                        code: 0,
                        message: 'You do not have permission to update this notification.'
                    });
                }

                // Bildirimi güncelle
                notification.is_seen = true;
                await notification.save();

                return res.status(200).json({
                    code: 1,
                    message: 'Notification updated successfully.',
                    notification
                });
            }
            // Type 1 ise bildirim groupNotifications içerisinde aranır
            else if (type === 1) {
                // GroupNotification kontrolü
                const notification = await GroupNotification.findById(notificationId);

                if (!notification) {
                    return res.status(200).json({
                        code: 0,
                        message: 'Notification not found.'
                    });
                }

                // Grup liderliği doğrulaması
                const userGroup = await UserGroup.findById(notification.group);
                if (!userGroup) {
                    return res.status(200).json({
                        code: 0,
                        message: 'Group not found.'
                    });
                }

                if (userGroup.group_leader.toString() !== userId) {
                    return res.status(200).json({
                        code: 0,
                        message: 'You do not have permission to update this notification. Only your group member can update this notification.'
                    });
                }

                // Bildirimi güncelle
                notification.is_seen = true;
                await notification.save();

                return res.status(200).json({
                    code: 1,
                    message: 'Notification updated successfully.',
                    notification
                });
            } else {
                // Geçersiz type
                return res.status(400).json({
                    code: 0,
                    message: 'Invalid type value.'
                });
            }
        } catch (error) {
            console.error('Error while updating notification:', error);
            res.status(500).json({ message: 'An error occurred while updating the notification.', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;
