// --------------------------------
// |
// | Service Name: Create Group Notification
// | Description: Service to create group notifications for user groups.
// | Parameters: title, description, type, createdBy, group (array of user group IDs), date, isSeen
// | Endpoint: /api/private/notifications/create-group-notification
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import GroupNotification from '@/models/GroupNotification';
import UserGroup from '@/models/UserGroup';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { title, description, type, groups, date } = req.body;

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

        // Role kontrolü: Admin veya Super Admin olmalı
        if (![1, 2].includes(loggedInUserRole)) {
            return res.status(200).json({
                message: 'You do not have permission to access this resource.',
                code: 0
            });
        }

        // Data check
        if (!title || !description || !type || !groups || groups.length === 0) {
            return res.status(200).json({
                code: 0,
                message: 'All fields are required'
            });
        }

        try {
            // Groups içindeki her bir user group ID'sinin userGroups koleksiyonunda olup olmadığını kontrol et
            const validGroups = await UserGroup.find({ '_id': { $in: groups } });

            // Eğer geçersiz bir user group ID'si varsa, hata döndür
            if (validGroups.length !== groups.length) {
                return res.status(200).json({
                    message: 'One or more user group IDs are invalid',
                    code: 0,
                });
            }

            // Bildirimlerin tamamını array'e ekle
            const notifications = groups.map(groupId => ({
                title,
                description,
                type,
                created_by: loggedInUserId,
                group: groupId,
                date: date || new Date(),
            }));

            // Tüm bildirimleri topluca kaydet
            const savedNotifications = await GroupNotification.insertMany(notifications);

            // Başarılı yanıt döndür
            res.status(200).json({
                code: 1,
                message: 'Group notification(s) created successfully',
                notifications: savedNotifications,
            });
        } catch (error) {
            console.error('Error while creating notification:', error);
            res.status(500).json({ message: 'An error occurred while creating the notification', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;
