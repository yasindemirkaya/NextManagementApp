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
                // type=0 veya type=2 ise personalNotifications'dan bildirimleri al
                const personalNotifications = await PersonalNotification.find({ created_by: userId });
                notifications = [...notifications, ...personalNotifications];
            }

            if (type === '1' || type === '2') {
                // type=1 veya type=2 ise groupNotifications'dan bildirimleri al
                const groupNotifications = await GroupNotification.find({ created_by: userId });
                notifications = [...notifications, ...groupNotifications];
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
            console.error('Error while fetching my notifications:', error);
            res.status(500).json({ message: 'An error occurred while fetching notifications', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;
