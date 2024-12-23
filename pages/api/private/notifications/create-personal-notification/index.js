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

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { title, description, type, user, date } = req.body;

        // Token'dan kullanıcı bilgilerini al
        let userRole;
        let userId;
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            userRole = decoded?.role;
            userId = decoded?.id;
        } catch (error) {
            return res.status(200).json({
                message: 'Invalid token, please log in again.',
                code: 0
            });
        }

        // Role kontrolü: Admin veya Super Admin olmalı
        if (userRole !== 1 && userRole !== 2) {
            return res.status(403).json({
                message: 'You do not have permission to access this resource.',
                code: 0
            });
        }

        // Data check
        if (!title || !description || !type || !user || user.length === 0) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            // Yeni PersonalNotification oluştur
            const newNotification = new PersonalNotification({
                title,
                description,
                type,
                created_by: userId, // Token'dan alınan kullanıcı ID'si
                user, // Kullanıcılar array
                date: date || new Date(), // Eğer date verilmemişse, şu anki zamanı kullan
            });

            // Yeni bildirimi kaydet
            await newNotification.save();

            // Başarılı yanıt döndür
            res.status(200).json({
                code: 1,
                message: 'Personal notification created successfully',
                notification: newNotification,
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