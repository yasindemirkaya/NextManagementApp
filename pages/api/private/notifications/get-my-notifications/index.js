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
import User from '@/models/User';
import UserGroup from '@/models/UserGroup';
import { formatDate } from '@/helpers/dateFormatter';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

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
                message: responseMessages.common[lang].invalidToken,
                code: 0
            });
        }

        try {
            // Sayfalama için limit ve page parametrelerini ayarla
            const limitValue = limit ? parseInt(limit) : 10; // Varsayılan limit
            const pageValue = page ? parseInt(page) : 1; // Varsayılan sayfa
            const skipValue = (pageValue - 1) * limitValue;

            let allNotifications = [];

            // Personal Notifications
            if (type === '0' || type === '2') {
                const personalNotifications = await PersonalNotification.find({ created_by: userId });

                // User bilgilerini ekle
                const personalNotificationsWithDetails = await Promise.all(
                    personalNotifications.map(async (notification) => {
                        const user = await User.findById(notification.user); // user ID'si ile kullanıcı sorgusu
                        return {
                            ...notification.toObject(),
                            date: formatDate(notification.date),
                            createdAt: formatDate(new Date(notification.createdAt)),
                            updatedAt: formatDate(new Date(notification.updatedAt)),
                            user: user ? `${user.first_name} ${user.last_name}` : null // Kullanıcı adı ve soyadı
                        };
                    })
                );

                allNotifications = [...allNotifications, ...personalNotificationsWithDetails];
            }

            // Group Notifications
            if (type === '1' || type === '2') {
                const groupNotifications = await GroupNotification.find({ created_by: userId });

                // Group bilgilerini ekle
                const groupNotificationsWithDetails = await Promise.all(
                    groupNotifications.map(async (notification) => {
                        const group = await UserGroup.findById(notification.group); // group ID'si ile grup sorgusu
                        return {
                            ...notification.toObject(),
                            date: formatDate(notification.date),
                            createdAt: formatDate(new Date(notification.createdAt)),
                            updatedAt: formatDate(new Date(notification.updatedAt)),
                            group: group ? group.group_name : null // Grup adı
                        };
                    })
                );

                allNotifications = [...allNotifications, ...groupNotificationsWithDetails];
            }

            // Tüm bildirimleri sıralayın (en güncel ilk sırada)
            const sortedNotifications = allNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Limiti ve sayfalamayı uygulayın
            const paginatedNotifications = sortedNotifications.slice(skipValue, skipValue + limitValue);

            // Toplam bildirim sayısı
            const totalNotifications = sortedNotifications.length;

            // Eğer bildirim yoksa
            if (paginatedNotifications.length === 0) {
                return res.status(200).json({
                    code: 0,
                    message: responseMessages.notifications.getMy[lang].notFound
                });
            }

            // Pagination bilgisi ekleyerek yanıt dön
            res.status(200).json({
                code: 1,
                message: responseMessages.notifications.getMy[lang].success,
                notifications: paginatedNotifications,
                pagination: {
                    totalData: totalNotifications,
                    totalPages: Math.ceil(totalNotifications / limitValue),
                    currentPage: pageValue,
                    limit: limitValue
                }
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
