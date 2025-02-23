// --------------------------------
// |
// | Service Name: Update Project Type
// | Description: Service that allows super admin to update a project type's name.
// | Parameters: projectTypeId, newTypeName
// | Endpoint: /api/private/projects/update-project-type
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import ProjectType from '@/models/ProjectType';
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
            const { projectTypeId, newTypeName } = req.body;

            // Payload control
            if (!projectTypeId || !newTypeName) {
                return res.status(200).json({
                    message: responseMessages.projects.updateType[lang].idRequired,
                    code: 0,
                });
            }

            // Project type not found
            const projectType = await ProjectType.findById(projectTypeId);
            if (!projectType) {
                return res.status(200).json({
                    message: responseMessages.projects.updateType[lang].notFound,
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

            // Update project type
            const updatedByName = `${updatingUser.first_name} ${updatingUser.last_name}`;

            projectType.type_name = newTypeName;
            projectType.updated_by = updatedByName;

            await projectType.save();

            // Success response
            return res.status(200).json({
                message: responseMessages.projects.updateType[lang].success,
                code: 1,
                project_type: {
                    id: projectType._id,
                    type_name: projectType.type_name,
                    updated_by: projectType.updated_by,
                    updatedAt: projectType.updatedAt,
                },
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
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
