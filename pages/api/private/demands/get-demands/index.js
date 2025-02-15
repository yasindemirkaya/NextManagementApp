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
import User from '@/models/User';
import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import responseMessages from '@/static/responseMessages/messages';
import demandTypes from '@/static/data/demands/demandTypes';
import demandStatuses from '@/static/data/demands/demandStatuses';

const formatDate = (date) => (date ? new Date(date).toISOString().split('T')[0] : null);

const handler = async (req, res) => {
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        let userRole, userIdFromToken;
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            userRole = decoded?.role;
            userIdFromToken = decoded.id;
        } catch (error) {
            return res.status(200).json({
                message: responseMessages.common[lang].invalidToken,
                code: 0
            });
        }

        if (userRole === 0) {
            req.query.userId = userIdFromToken;
        }

        if (userRole === 1) {
            req.query.targetId = userIdFromToken;
        }

        const { status, userId, targetId, limit, page, search } = req.query;
        let queryOptions = {};

        if (status) queryOptions.status = status;
        if (userId) queryOptions.userId = userId;
        if (targetId) queryOptions.targetId = targetId;

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

            let demands = await Demand.find(queryOptions)
                .limit(limitValue || 0)
                .skip(skipValue)
                .lean();

            const targetIds = demands.map(d => d.targetId).filter(Boolean);
            const userIds = demands.map(d => d.userId).filter(Boolean);
            const uniqueUserIds = [...new Set([...targetIds, ...userIds])];

            const users = await User.find({ _id: { $in: uniqueUserIds } }, '_id first_name last_name');

            const userMap = users.reduce((acc, user) => {
                acc[user._id] = {
                    id: user._id,
                    user: user.first_name + ' ' + user.last_name,
                };
                return acc;
            }, {});

            demands = demands.map(d => {
                const status = demandStatuses.find(status => String(status.id) === String(d.status));
                const type = demandTypes.find(type => String(type.id) === String(d.title));

                return {
                    ...d,
                    title: type ? type.typeName : null,
                    start_date: formatDate(d.start_date),
                    end_date: formatDate(d.end_date),
                    targetId: userMap[d.targetId] || null,
                    userId: userMap[d.userId] || null,
                    status: {
                        value: d.status,
                        label: status ? status.typeName : null
                    }
                };
            });

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
