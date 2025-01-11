// --------------------------------
// |
// | Service Name: Update Notification
// | Description: Updates the "is_seen" status of a notification.
// | Endpoint: /api/private/notifications/update-notification
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import PersonalNotification from '@/models/PersonalNotification';
import GroupNotification from '@/models/GroupNotification';
import UserGroup from '@/models/UserGroup';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'PUT') {
        const { notificationId, type } = req.body;

        // Kullanıcı kimliğini doğrula
        let userId;
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            userId = decoded?.id;
        } catch (error) {
            return res.status(200).json({
                message: responseMessages.common[lang].invalidToken,
                code: 0
            });
        }

        // Gerekli alanları kontrol et
        if (!notificationId || type === undefined) {
            return res.status(200).json({
                code: 0,
                message: responseMessages.notifications.update[lang].idRequired
            });
        }

        try {
            // Type 0 ise bildirim personalNotification içinde aranır
            if (type === 0) {
                // PersonalNotification kontrolü
                const notification = await PersonalNotification.findById(notificationId);

                if (!notification) {
                    return res.status(200).json({
                        code: 0,
                        message: responseMessages.notifications.update[lang].notFound
                    });
                }

                // Kullanıcı doğrulaması
                if (notification.user.toString() !== userId) {
                    return res.status(200).json({
                        code: 0,
                        message: responseMessages.common[lang].noPermission
                    });
                }

                // Bildirimi güncelle
                notification.is_seen = true;
                await notification.save();

                return res.status(200).json({
                    code: 1,
                    message: responseMessages.notifications.update[lang].seenSuccess,
                    notification
                });
            }
            // Type 1 ise bildirim groupNotifications içerisinde aranır
            else if (type === 1) {
                // GroupNotification kontrolü
                const notification = await GroupNotification.findById(notificationId);

                if (!notification) {
                    return res.status(200).json({
                        code: 0,
                        message: responseMessages.notifications.update[lang].notFound
                    });
                }

                // Grup liderliği doğrulaması
                const userGroup = await UserGroup.findById(notification.group);
                if (!userGroup) {
                    return res.status(200).json({
                        code: 0,
                        message: responseMessages.notifications.update[lang].groupNotFound
                    });
                }

                if (userGroup.group_leader.toString() !== userId) {
                    return res.status(200).json({
                        code: 0,
                        message: responseMessages.notifications.update[lang].noPermission
                    });
                }

                // Bildirimi güncelle
                notification.is_seen = true;
                await notification.save();

                return res.status(200).json({
                    code: 1,
                    message: responseMessages.notifications.update[lang].seenSuccess,
                    notification
                });
            } else {
                // Geçersiz type
                return res.status(400).json({
                    code: 0,
                    message: responseMessages.notifications.update[lang].invalidType
                });
            }
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
