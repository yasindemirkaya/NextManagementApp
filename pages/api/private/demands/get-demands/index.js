// --------------------------------
// |
// | Service Name: Get All Demands
// | Description: Service that fetches all demands based on various filters.
// | Parameters: status, userId, targetId
// | Endpoints:
// | /api/private/demands/get-demands
// | /api/private/demands/get-demands?status=0
// | /api/private/demands/get-demands?userId=123
// | /api/private/demands/get-demands?targetId=456
// |
// ------------------------------

import Demand from '@/models/Demand';
import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        let userRole;
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            userRole = decoded?.role;
        } catch (error) {
            return res.status(200).json({
                message: responseMessages.common[lang].invalidToken,
                code: 0
            });
        }

        // No permission for standard users
        if (userRole === 0) {
            return res.status(403).json({
                message: responseMessages.common[lang].noPermission,
                code: 0
            });
        }

        const { status, userId, targetId, limit, page, search } = req.query;
        let queryOptions = {};

        if (status) {
            queryOptions.status = status;
        }

        if (userId) {
            queryOptions.userId = userId;
        }

        if (targetId) {
            queryOptions.targetId = targetId;
        }

        if (search) {
            queryOptions.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let limitValue = limit ? parseInt(limit) : null;
        let pageValue = page ? parseInt(page) : null;
        let skipValue = (pageValue && limitValue) ? (pageValue - 1) * limitValue : 0;

        try {
            const totalDemands = await Demand.countDocuments(queryOptions);
            const totalPages = limitValue ? Math.ceil(totalDemands / limitValue) : 1;

            const demands = limitValue && pageValue
                ? await Demand.find(queryOptions)
                    .limit(limitValue)
                    .skip(skipValue)
                : await Demand.find(queryOptions);

            res.status(200).json({
                code: 1,
                message: responseMessages.demands.get[lang].success,
                demands,
                pagination: {
                    totalData: totalDemands,
                    totalPages,
                    currentPage: pageValue,
                    limit: limitValue
                }
            });
        } catch (error) {
            res.status(500).json({
                error: responseMessages.demands.get[lang].failedToFetch
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
