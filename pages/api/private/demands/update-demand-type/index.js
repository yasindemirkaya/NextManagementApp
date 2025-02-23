// --------------------------------
// |
// | Service Name: Update Demand Type
// | Description: Service that allows super admin to update a demand type's name.
// | Parameters: demandTypeId, newTypeName
// | Endpoint: /api/private/demands/update-demand-type
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import DemandType from '@/models/DemandType';
import User from '@/models/User';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'PUT') {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: userId, role } = decoded;

            // Permission control
            if (role !== 2) {
                return res.status(200).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0,
                });
            }

            // Request body
            const { demandTypeId, newTypeName } = req.body;

            // Payload control
            if (!demandTypeId || !newTypeName) {
                return res.status(200).json({
                    message: responseMessages.demands.updateType[lang].idRequired,
                    code: 0,
                });
            }

            // Demand type not found
            const demandType = await DemandType.findById(demandTypeId);
            if (!demandType) {
                return res.status(200).json({
                    message: responseMessages.demands.updateType[lang].notFound,
                    code: 0,
                });
            }

            // Updating user not found
            const updatingUser = await User.findById(userId);
            if (!updatingUser) {
                return res.status(200).json({
                    message: responseMessages.common[lang].userNotFound,
                    code: 0,
                });
            }

            // Update demand type
            const updatedByName = `${updatingUser.first_name} ${updatingUser.last_name}`;

            demandType.type_name = newTypeName;
            demandType.updated_by = updatedByName;

            await demandType.save();

            // Success response
            return res.status(200).json({
                message: responseMessages.demands.updateType[lang].success,
                code: 1,
                demand_type: {
                    id: demandType._id,
                    type_name: demandType.type_name,
                    updated_by: demandType.updated_by,
                    updatedAt: demandType.updatedAt,
                },
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccurred,
                error: error.message,
                code: 0,
            });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
