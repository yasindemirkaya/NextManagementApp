// --------------------------------
// |
// | Service Name: Get Service Logs
// | Description: Service that brings logs of requests made by users
// | Parameters: guid
// | Endpoint: /api/private/settings/service-logs/get-service-logs-by-guid
// |
// ------------------------------


import { verify } from 'jsonwebtoken';
import Log from '@/models/Log';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        try {
            // Token'ı decode et ve kullanıcı rolünü al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { role } = decoded;

            // Super admin (2) değilse işlem reddedilir
            if (role !== 2) {
                return res.status(200).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0,
                });
            }

            // Query parametresinden gelen guid al
            const { guid } = req.query;

            if (!guid) {
                return res.status(200).json({
                    code: 0,
                    message: responseMessages.serviceLogs[lang].guidRequired,
                });
            }

            // logs koleksiyonunda, guid ile eşleşen kayıtları sorgula
            const logs = await Log.find({ guid });

            if (logs.length === 0) {
                return res.status(200).json({
                    code: 0,
                    message: `${responseMessages.serviceLogs[lang].notFound} ${guid}.`,
                });
            }

            return res.status(200).json({
                code: 1,
                message: responseMessages.serviceLogs[lang].success,
                logs,
            });

        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message,
                code: 0,
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
