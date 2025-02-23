// --------------------------------
// |
// | Service Name: Create Demand Type
// | Description: Service to create a new demand type
// | Parameters: type_name
// | Endpoint: /api/private/demands/create-demand-type
// |
// ------------------------------


import { verify } from 'jsonwebtoken';
import DemandType from '@/models/DemandType';
import User from '@/models/User';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'POST') {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: adminId, role } = decoded;

            // Permission control
            if (role !== 2) {
                return res.status(200).json({
                    message: responseMessages.demands.createType[lang].noPermission,
                    code: 0,
                });
            }

            // Request body
            const { typeName } = req.body;

            // Type name control
            if (!typeName) {
                return res.status(200).json({
                    message: responseMessages.demands.createType[lang].nameRequired,
                    code: 0
                });
            }

            // Existing type name
            const existingDemandType = await DemandType.findOne({ type_name: typeName });
            if (existingDemandType) {
                return res.status(200).json({
                    message: responseMessages.demands.createType[lang].alreadyExist,
                    code: 0
                });
            }

            // Created by not found
            const createdByUser = await User.findById(adminId);
            if (!createdByUser) {
                return res.status(200).json({
                    message: responseMessages.demands.createType[lang].createdByNotFound,
                    code: 0
                });
            }
            const createdByName = `${createdByUser.first_name} ${createdByUser.last_name}`;

            // Create new demand type
            const newDemandType = new DemandType({
                type_name: typeName,
                created_by: createdByName,
                updated_by: createdByName,
            });

            await newDemandType.save();

            // Success response
            return res.status(200).json({
                message: responseMessages.demands.createType[lang].success,
                code: 1,
                demand_type: typeName,
                id: newDemandType._id,
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
