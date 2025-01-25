// --------------------------------
// |
// | Service Name: Update Demand
// | Description: Service for updating the status and response of the request.
// | Parameters: status, admin_response
// | Endpoint: /api/private/demand/update-demand
// |
// ------------------------------

import Demand from '@/models/Demand';
import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }

    // Token control
    let userRole, userId;
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = verify(token, process.env.JWT_SECRET);
        userRole = decoded?.role;
        userId = decoded?.id;
    } catch (error) {
        return res.status(200).json({
            message: responseMessages.common[lang].invalidToken,
            code: 0
        });
    }

    // Permission control
    if (userRole === 0) {
        return res.status(403).json({
            message: responseMessages.common[lang].noPermission
        });
    }

    // Req body
    const { demandId, status, admin_response } = req.body;

    if (!demandId || !["0", "1", "2", "3"].includes(status) || !admin_response) {
        return res.status(400).json({
            code: 0,
            message: responseMessages.demands.update[lang].missingFields
        });
    }

    try {
        const demand = await Demand.findById(demandId);

        if (!demand) {
            return res.status(200).json({
                code: 0,
                message: responseMessages.demands.update[lang].notFound
            });
        }

        if (userRole !== 2 && demand.targetId.toString() !== userId) {
            return res.status(403).json({
                code: 0,
                message: responseMessages.common[lang].noPermission
            });
        }

        demand.status = status;
        demand.admin_response = admin_response;
        await demand.save();

        return res.status(200).json({
            code: 1,
            message: responseMessages.demands.update[lang].success,
            demand
        });
    } catch (error) {
        return res.status(500).json({
            code: 0,
            message: responseMessages.common[lang].errorOccured
        });
    }
};

export default privateMiddleware(handler);
