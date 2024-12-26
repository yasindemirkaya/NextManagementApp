// --------------------------------
// |
// | Service Name: Get Notification by ID
// | Description: Fetch a specific notification by ID for the logged-in user.
// | Parameters: id (ID of the notification)
// | Endpoint: /api/private/notifications/get-notification-by-id
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import PersonalNotification from '@/models/PersonalNotification';
import GroupNotification from '@/models/GroupNotification';
import UserGroup from '@/models/UserGroup';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        const { id } = req.query;

        // Token'dan kullanıcı bilgilerini al
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
            // İlk olarak PersonalNotification modelinde bildirim arıyoruz
            let notification = await PersonalNotification.findOne({ _id: id, user: userId });

            // Eğer bulunamazsa, GroupNotification modelinde aramaya devam ediyoruz
            if (!notification) {
                notification = await GroupNotification.findOne({ _id: id, group: { $in: await UserGroup.find({ members: userId }).select('_id') } });
            }

            // Eğer bildirim bulunamazsa hata döndür
            if (!notification) {
                return res.status(200).json({
                    code: 0,
                    message: 'Notification not found or you do not have permission to view it.'
                });
            }

            // Başarılı yanıt döndür
            res.status(200).json({
                code: 1,
                message: 'Notification retrieved successfully',
                notification
            });
        } catch (error) {
            console.error('Error while fetching notification:', error);
            res.status(500).json({ message: 'An error occurred while fetching notification', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;
