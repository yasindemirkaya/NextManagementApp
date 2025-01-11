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
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

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
                message: responseMessages.common[lang].invalidToken,
                code: 0
            });
        }

        // Role kontrolü: Admin veya Super Admin olmalı
        if (![1, 2].includes(loggedInUserRole)) {
            return res.status(200).json({
                message: responseMessages.common[lang].noPermission,
                code: 0
            });
        }

        // Data check
        if (!title || !description || !type || !groups || groups.length === 0) {
            return res.status(200).json({
                code: 0,
                message: responseMessages.notifications.createGroup[lang].allFieldsRequired,
            });
        }

        try {
            // Groups içindeki her bir user group ID'sinin userGroups koleksiyonunda olup olmadığını kontrol et
            const validGroups = await UserGroup.find({ '_id': { $in: groups } });

            // Eğer geçersiz bir user group ID'si varsa, hata döndür
            if (validGroups.length !== groups.length) {
                return res.status(200).json({
                    message: responseMessages.notifications.createGroup[lang].invalidGroup,
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
                message: responseMessages.notifications.createGroup[lang].success,
                notifications: savedNotifications,
            });
        } catch (error) {
            res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message
            });
        }
    } else {
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default handler;
