// --------------------------------
// |
// | Service Name: Get Demand By ID
// | Description: Service that brings the details of the request whose ID is sent.
// | Endpoint: /api/private/demands/get-demand-by-id
// |
// ------------------------------

import Demand from '@/models/Demand';
import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method !== 'GET') {
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }

    // ID required
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({
            message: responseMessages.demands.getById[lang].idRequired
        });
    }

    let userId, userRole;
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = verify(token, process.env.JWT_SECRET);
        userId = decoded?.id;
        userRole = decoded?.role;
    } catch (error) {
        return res.status(200).json({
            message: responseMessages.common[lang].invalidToken,
            code: 0
        });
    }

    try {
        const demand = await Demand.findById(id);
        if (!demand) {
            return res.status(404).json({
                message: responseMessages.demands.getById[lang].notFound
            });
        }

        // Kullanıcı yetkilendirme: Talep sahibi, hedef kişi veya super admin olmalı
        if (userRole !== 2 && demand.userId.toString() !== userId && demand.targetId.toString() !== userId) {
            return res.status(403).json({
                message: responseMessages.common[lang].noPermission
            });
        }

        // Success
        res.status(200).json({
            code: 1,
            message: responseMessages.demands.getById[lang].success,
            demand
        });
    } catch (error) {
        res.status(500).json({
            error: responseMessages.demands.getById[lang].failedToFetch
        });
    }
};

export default privateMiddleware(handler);