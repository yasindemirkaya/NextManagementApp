// --------------------------------
// |
// | Service Name: Delete Notification
// | Description: Service to delete a notification.
// | Parameters: notificationId
// | Endpoint: /api/private/notifications/delete-notification
// |
// ------------------------------

import PersonalNotification from '@/models/PersonalNotification';
import GroupNotification from '@/models/GroupNotification';
import { verify } from 'jsonwebtoken';

const handler = async (req, res) => {
    if (req.method === 'DELETE') {
        const { notificationId } = req.body;

        if (!notificationId) {
            return res.status(400).json({
                code: 0,
                message: 'Notification ID is required.'
            });
        }

        let notification;

        // Notification'ı personalNotifications ve groupNotifications koleksiyonlarında arayalım
        try {
            notification = await PersonalNotification.findById(notificationId) ||
                await GroupNotification.findById(notificationId);

            if (!notification) {
                return res.status(200).json({
                    code: 0,
                    message: 'Notification not found.'
                });
            }

            // Token'dan userRole bilgisini alalım
            let userRole;
            try {
                const token = req.headers.authorization?.split(' ')[1];
                const decoded = verify(token, process.env.JWT_SECRET);
                userRole = decoded?.role;
            } catch (error) {
                return res.status(401).json({
                    message: 'Invalid token, please log in again.',
                    code: 0
                });
            }

            // Role kontrolü: Eğer userRole 0 ise, veri döndürme (kullanıcı yetkisi yok)
            if (userRole === 0) {
                return res.status(200).json({
                    message: 'You do not have permission to access this resource.',
                    code: 0
                });
            }

            // Notification'ı sadece sahibi silebilir. created_by ile istek atan kullanıcının ID'si aynı olmalı.
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded?.id;  // Kullanıcının ID'si

            if (notification.created_by.toString() !== userId) {
                return res.status(200).json({
                    code: 0,
                    message: 'You can only delete your own notification.'
                });
            }

            // Notification'ı silme işlemi
            if (notification instanceof PersonalNotification) {
                await PersonalNotification.findByIdAndDelete(notificationId);
            } else {
                await GroupNotification.findByIdAndDelete(notificationId);
            }

            return res.status(200).json({
                code: 1,
                message: 'Notification deleted successfully.'
            });

        } catch (error) {
            console.error('Error in deleting notification:', error);
            return res.status(500).json({ message: 'An error occurred while deleting the notification', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler;
