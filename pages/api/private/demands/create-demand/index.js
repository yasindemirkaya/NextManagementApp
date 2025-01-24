// --------------------------------
// |
// | Service Name: Create Demand
// | Description: Service used for standard users to submit requests to their administrators
// | Parameters: title, description, targetId, start_date, end_date, status, admin_response
// | Endpoint: /api/private/demand/create-demand
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import Demand from '@/models/Demand';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'POST') {
        try {
            // Token'ı decode et ve kullanıcı bilgilerini al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: userId, role } = decoded;

            // Sadece standart kullanıcılar (role 0) talep oluşturabilir
            if (role !== 0) {
                return res.status(403).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0,
                });
            }

            // Talep formu verileri
            const { title, description, targetId, start_date, end_date } = req.body;

            if (!title || !description || !targetId) {
                return res.status(200).json({
                    message: responseMessages.demands.create[lang].allFieldsRequired,
                    code: 0
                });
            }

            // Talep verisini kaydet
            const newDemand = new Demand({
                userId,
                targetId,
                title,
                description,
                start_date,
                end_date,
                status: 0, // Başlangıçta talep durumu 0
                admin_response: "", // Başlangıçta boş admin cevabı
            });

            await newDemand.save();

            return res.status(200).json({
                message: responseMessages.demands.create[lang].success,
                code: 1,
                demandId: newDemand._id
            });

        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message,
                code: 0
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
}

export default privateMiddleware(handler);
