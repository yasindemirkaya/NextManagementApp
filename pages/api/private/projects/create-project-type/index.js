// --------------------------------
// |
// | Service Name: Create Project Type
// | Description: Service to create a new project type
// | Parameters: type_name
// | Endpoint: /api/private/projects/create-project-type
// |
// ------------------------------


import { verify } from 'jsonwebtoken';
import ProjectType from '@/models/ProjectType';
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
                    message: responseMessages.common[lang].noPermission,
                    code: 0,
                });
            }

            // Request body
            const { typeName } = req.body;

            // Type name control
            if (!typeName) {
                return res.status(200).json({
                    message: responseMessages.projects.createType[lang].nameRequired,
                    code: 0
                });
            }

            // Existing type name
            const existingProjecType = await ProjectType.findOne({ type_name: typeName });
            if (existingProjecType) {
                return res.status(200).json({
                    message: responseMessages.projects.createType[lang].alreadyExist,
                    code: 0
                });
            }

            // Created by not found
            const createdByUser = await User.findById(adminId);
            if (!createdByUser) {
                return res.status(200).json({
                    message: responseMessages.projects.createType[lang].createdByNotFound,
                    code: 0
                });
            }
            const createdByName = `${createdByUser.first_name} ${createdByUser.last_name}`;

            // Create new project type
            const newProjectType = new ProjectType({
                type_name: typeName,
                created_by: createdByName,
                updated_by: createdByName,
            });

            await newProjectType.save();

            // Success response
            return res.status(200).json({
                message: responseMessages.projects.createType[lang].success,
                code: 1,
                project_type: typeName,
                id: newProjectType._id,
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
