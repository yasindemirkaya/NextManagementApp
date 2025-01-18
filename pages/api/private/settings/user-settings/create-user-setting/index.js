// --------------------------------
// |
// | Service Name: Create User Settings
// | Description: Service that creates or updates a user's settings
// | Endpoint: /api/private/user/create-settings
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import UserSetting from '@/models/UserSetting';
import responseMessages from '@/static/responseMessages/messages';

// Kullanıcı ayarlarını oluştur veya güncelle
const createOrUpdateUserSettings = async (userId, settings) => {
    const existingSettings = await UserSetting.findOne({ userId }).lean();

    if (existingSettings) {
        // Eğer ayarlar varsa üzerine yazarak güncelle
        return await UserSetting.findByIdAndUpdate(existingSettings._id, settings, { new: true });
    } else {
        // Eğer ayarlar yoksa, yeni bir ayar oluştur
        const newSettings = new UserSetting({ userId, ...settings });
        return await newSettings.save();
    }
};

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'POST') {
        try {
            // Token'ı decode et ve kullanıcı id'sini al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Gönderilen body'den settings verilerini al
            const { language, theme } = req.body;

            // language veya theme alanı olmalı
            if (!language && !theme) {
                return res.status(400).json({
                    message: responseMessages.userSettings.create[lang].missingFields,
                    code: 0,
                });
            }

            const settings = {};
            if (language) settings.language = language;
            if (theme) settings.theme = theme;

            // Ayarları oluştur veya güncelle
            const userSettings = await createOrUpdateUserSettings(userId, settings);

            // Başarıyla ayarları oluşturduktan sonra dön
            return res.status(200).json({
                code: 1,
                message: responseMessages.userSettings.create[lang].success,
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
        // Sadece POST isteği kabul edilir
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
