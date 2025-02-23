// --------------------------------
// |
// | Service Name: Delete Project Type
// | Description: Service that allows super admin to delete a project type by ID.
// | Parameters: projectTypeId (as a body parameter)
// | Endpoint: /api/private/projects/delete-project-type
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import ProjectType from '@/models/ProjectType';
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
            const { projectTypeId } = req.body;

            // Project Type id required
            if (!projectTypeId) {
                return res.status(200).json({
                    message: responseMessages.projects.deleteType[lang].idRequired,
                    code: 0
                });
            }

            // Find and delete project type by ID
            const deletedProjectType = await ProjectType.findByIdAndDelete(projectTypeId);

            // Project type not found
            if (!deletedProjectType) {
                return res.status(200).json({
                    message: responseMessages.projects.deleteType[lang].notFound,
                    code: 0,
                });
            }

            // Success response
            return res.status(200).json({
                message: responseMessages.projects.deleteType[lang].success,
                code: 1,
                deleted_project_type: deletedProjectType,
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
