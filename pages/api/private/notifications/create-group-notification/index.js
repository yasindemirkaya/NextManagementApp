// --------------------------------
// |
// | Service Name: Create Group Notification
// | Description: Service to create group notifications for user groups.
// | Parameters: title, description, type, createdBy, group (array of user group IDs), date, isSeen
// | Endpoint: /api/private/notifications/create-group-notification
// |
// ------------------------------

import { verify } from 'jsonwebtoken'; // Token doğrulama
import GroupNotification from '@/models/GroupNotification';
import UserGroup from '@/models/UserGroup';  // UserGroup modelini import et

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { title, description, type, group, date } = req.body;

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
        if (!title || !description || !type || !group || group.length === 0) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            // Group içindeki her bir group ID'sinin UserGroup koleksiyonunda olup olmadığını kontrol et
            const validGroups = await UserGroup.find({ '_id': { $in: group } });

            // Eğer geçersiz bir group ID'si varsa, hata döndür
            if (validGroups.length !== group.length) {
                return res.status(400).json({
                    message: 'One or more group IDs are invalid',
                    code: 0,
                });
            }

            // Yeni GroupNotification oluştur
            const newGroupNotification = new GroupNotification({
                title,
                description,
                type,
                created_by: userId, // Token'dan alınan kullanıcı ID'si
                group, // Grup ID'leri
                date: date || new Date(), // Eğer date verilmemişse, şu anki zamanı kullan
            });

            // Yeni bildirimi kaydet
            await newGroupNotification.save();

            // Başarılı yanıt döndür
            res.status(200).json({
                code: 1,
                message: 'Group notification created successfully',
                notification: newGroupNotification,
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
