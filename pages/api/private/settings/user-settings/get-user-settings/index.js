// --------------------------------
// |
// | Service Name: Get User Settings
// | Description: Service that brings the user's settings
// | Endpoint: /api/private/user/get-settings
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import UserSetting from '@/models/UserSetting';
import responseMessages from '@/static/responseMessages/messages';

// Kullanıcı ayarlarını bul
const findUserSettingsByUserId = async (userId) => {
    return await UserSetting.findOne({ userId }).lean();
};

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        try {
            // Token'ı decode et ve kullanıcı id'sini al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Kullanıcının ayarlarını al
            const userSettings = await findUserSettingsByUserId(userId);

            if (!userSettings) {
                return res.status(200).json({
                    message: responseMessages.userSettings.get[lang].notFound,
                    code: 0,
                });
            }

            // Kullanıcı ayarlarını döndür
            return res.status(200).json({
                code: 1,
                message: responseMessages.userSettings.get[lang].success,
                settings: {
                    language: userSettings.language,
                    theme: userSettings.theme,
                },
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message,
            });
        }
    } else {
        // Sadece GET isteği kabul edilir
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
