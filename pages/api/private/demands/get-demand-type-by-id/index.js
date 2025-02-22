// --------------------------------
// |
// | Service Name: Get Demand Type By ID
// | Description: Service that fetches the demand type by ID.
// | Endpoint: /api/private/demands/get-demand-type-by-id
// |
// ------------------------------

import privateMiddleware from '@/middleware/private/index';
import DemandType from '@/models/DemandType';
import responseMessages from '@/static/responseMessages/messages';

// Find Demand Type By ID
const findDemandTypeById = async (id) => {
    return await DemandType.findById(id).lean();
};

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        try {
            // ID from query
            const requestedDemandTypeId = req.query.id;

            // Find demand type
            const demandType = await findDemandTypeById(requestedDemandTypeId);

            // Demand type not found
            if (!demandType) {
                return res.status(200).json({
                    message: responseMessages.demands.getTypeById[lang].notFound,
                    code: 0,
                });
            }

            // Success response
            return res.status(200).json({
                message: responseMessages.demands.getTypeById[lang].success,
                code: 1,
                demand_type: {
                    id: demandType._id,
                    type_name: demandType.type_name,
                    created_by: demandType.created_by,
                    updated_by: demandType.updated_by,
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
