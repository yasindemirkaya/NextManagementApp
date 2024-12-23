// --------------------------------
// |
// | Service Name: Create Personal Notification
// | Description: Service to create personal notifications for users.
// | Parameters: title, description, type, createdBy, user (array of user IDs), date, isSeen
// | Endpoint: /api/private/notifications/create-personal-notification
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import PersonalNotification from '@/models/PersonalNotification';
import User from '@/models/User';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { title, description, type, users, date } = req.body;

        // Token'dan kullanıcı bilgilerini al
        let loggedInUserRole;
        let loggedInUserId;
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            loggedInUserRole = decoded?.role;
            loggedInUserId = decoded?.id;  // Bu, isteği yapan kullanıcının ID'si
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
        if (!title || !description || !type || !users || users.length === 0) {
            return res.status(200).json({
                code: 0,
                message: 'All fields are required'
            });
        }

        try {
            // Users içindeki her bir user ID'sinin User koleksiyonunda olup olmadığını kontrol et
            const validUsers = await User.find({ '_id': { $in: users } });

            // Eğer geçersiz bir user ID'si varsa, hata döndür
            if (validUsers.length !== users.length) {
                return res.status(200).json({
                    message: 'One or more user IDs are invalid',
                    code: 0,
                });
            }

            // Bildirimlerin tamamını array'e ekle
            const notifications = users.map(userId => ({
                title,
                description,
                type,
                created_by: loggedInUserId,  // Burada her bir bildirimde kullanıcıyı işaret ediyoruz
                user: userId,
                date: date || new Date(),
            }));

            // Tüm bildirimleri topluca kaydet
            const savedNotifications = await PersonalNotification.insertMany(notifications);

            // Başarılı yanıt döndür
            res.status(200).json({
                code: 1,
                message: 'Personal notifications created successfully',
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
