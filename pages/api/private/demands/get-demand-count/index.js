// --------------------------------
// |
// | Service Name: Get Demand Count
// | Description: Fetch the total number of demands assigned to the logged-in user.
// | Endpoint: /api/private/demands/get-demand-count
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import Demand from '@/models/Demand';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
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

        // Kullanıcının rolü Admin (1) veya Super Admin (2) değilse erişim reddedilir
        if (![1, 2].includes(userRole)) {
            return res.status(403).json({
                message: responseMessages.common[lang].noPermission,
                code: 0
            });
        }

        try {
            const demandCount = await Demand.countDocuments({ targetId: userId });

            res.status(200).json({
                code: 1,
                message: responseMessages.demands.getCount[lang].success,
                totalDemandCount: demandCount
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
