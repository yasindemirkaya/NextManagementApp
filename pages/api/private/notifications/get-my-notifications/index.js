// --------------------------------
// |
// | Service Name: Get My Notifications
// | Description: Fetch notifications created by the logged-in user based on type.
// | Parameters: type (0, 1, 2)
// | Endpoint: /api/private/notifications/get-my-notifications
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import PersonalNotification from '@/models/PersonalNotification';
import GroupNotification from '@/models/GroupNotification';
import { formatDate } from '@/helpers/dateFormatter';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        const { type, limit, page } = req.query;

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

            // Sayfalama için limit ve page parametrelerini ayarla
            const limitValue = limit ? parseInt(limit) : null;
            const pageValue = page ? parseInt(page) : 1;
            const skipValue = limitValue && pageValue ? (pageValue - 1) * limitValue : 0;

            let totalPersonalNotifications = 0;
            let totalGroupNotifications = 0;

            // Personal Notifications
            if (type === '0' || type === '2') {
                // Kullanıcının yarattığı kişisel bildirimleri al
                const personalNotifications = await PersonalNotification.find({ created_by: userId })
                    .limit(limitValue)
                    .skip(skipValue);

                totalPersonalNotifications = personalNotifications.length;

                if (personalNotifications.length > 0) {
                    const personalNotificationsWithFormattedDates = personalNotifications.map((notification) => ({
                        ...notification.toObject(),
                        date: formatDate(notification.date), // Formatlı tarih
                        createdAt: formatDate(notification.createdAt) // Formatlı createdAt
                    }));

                    notifications = [...notifications, ...personalNotificationsWithFormattedDates];
                }
            }

            // Group Notifications
            if (type === '1' || type === '2') {
                // Kullanıcının yarattığı grup bildirimlerini al
                const groupNotifications = await GroupNotification.find({ created_by: userId })
                    .limit(limitValue)
                    .skip(skipValue);

                totalGroupNotifications = groupNotifications.length;

                if (groupNotifications.length > 0) {
                    const groupNotificationsWithFormattedDates = groupNotifications.map((notification) => ({
                        ...notification.toObject(),
                        date: formatDate(notification.date), // Formatlı tarih
                        createdAt: formatDate(notification.createdAt) // Formatlı createdAt
                    }));

                    notifications = [...notifications, ...groupNotificationsWithFormattedDates];
                }
            }

            // `type` parametresine göre totalNotifications'ı ayarlıyoruz
            let totalNotifications = 0;
            if (type === '0') {
                totalNotifications = totalPersonalNotifications;
            } else if (type === '1') {
                totalNotifications = totalGroupNotifications;
            } else if (type === '2') {
                totalNotifications = totalPersonalNotifications + totalGroupNotifications;
            }

            // Eğer bildirim yoksa
            if (notifications.length === 0) {
                return res.status(200).json({
                    code: 0,
                    message: 'No notifications found'
                });
            }

            // limit değeri null ise, totalData'ya eşit yap
            const finalLimit = limitValue || notifications.length;

            // Pagination bilgisi ekleyerek yanıt dön
            res.status(200).json({
                code: 1,
                message: 'Notifications retrieved successfully',
                notifications,
                pagination: {
                    totalData: totalNotifications, // Total bildirim sayısı
                    totalPages: Math.ceil(totalNotifications / finalLimit),
                    currentPage: pageValue,
                    limit: finalLimit
                }
            });
        } catch (error) {
            console.error('Error while fetching my notifications:', error);
            res.status(500).json({ message: 'An error occurred while fetching notifications', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;
