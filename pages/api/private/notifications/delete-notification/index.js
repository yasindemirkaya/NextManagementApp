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
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'DELETE') {
        const { notificationId } = req.body;

        if (!notificationId) {
            return res.status(400).json({
                code: 0,
                message: responseMessages.notifications.delete[lang].idRequired
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
                    message: responseMessages.notifications.delete[lang].notFound
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
                    message: responseMessages.common[lang].invalidToken,
                    code: 0
                });
            }

            // Role kontrolü: Eğer userRole 0 ise, veri döndürme (kullanıcı yetkisi yok)
            if (userRole === 0) {
                return res.status(200).json({
                    message: responseMessages.common[lang].noPermission,
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
                    message: responseMessages.notifications.delete[lang].notAuthorized
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
                message: responseMessages.notifications.delete[lang].success
            });

        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccurred,
                error: error.message
            });
        }
    } else {
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
}

export default handler;
