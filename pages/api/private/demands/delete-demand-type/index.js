// --------------------------------
// |
// | Service Name: Delete Demand Type
// | Description: Service that allows super admin to delete a demand type by ID.
// | Parameters: demandTypeId (as a body parameter)
// | Endpoint: /api/private/demands/delete-demand-type
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import DemandType from '@/models/DemandType';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'DELETE') {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { role } = decoded;

            // Permission control
            if (role !== 2) {
                return res.status(200).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0,
                });
            }

            // Request body
            const { demandTypeId } = req.body;

            // Demand Type id required
            if (!demandTypeId) {
                return res.status(200).json({
                    message: responseMessages.demands.deleteType[lang].idRequired,
                    code: 0
                });
            }

            // Find and delete demand type by ID
            const deletedDemandType = await DemandType.findByIdAndDelete(demandTypeId);

            // Demand type not found
            if (!deletedDemandType) {
                return res.status(200).json({
                    message: responseMessages.demands.deleteType[lang].notFound,
                    code: 0,
                });
            }

            // Success response
            return res.status(200).json({
                message: responseMessages.demands.deleteType[lang].success,
                code: 1,
                deleted_demand_type: deletedDemandType,
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message,
                code: 0
            });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
