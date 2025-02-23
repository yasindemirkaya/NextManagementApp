// --------------------------------
// |
// | Service Name: Get Project Type By ID
// | Description: Service that fetches the project type by ID.
// | Endpoint: /api/private/projects/get-project-type-by-id
// |
// ------------------------------

import privateMiddleware from '@/middleware/private/index';
import ProjectType from '@/models/ProjectType';
import responseMessages from '@/static/responseMessages/messages';

// Find Project Type By ID
const findProjectTypeById = async (id) => {
    return await ProjectType.findById(id).lean();
};

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        try {
            // ID from query
            const requestedProjectTypeId = req.query.id;

            // Find project type
            const projectType = await findProjectTypeById(requestedProjectTypeId);

            // Project type not found
            if (!projectType) {
                return res.status(200).json({
                    message: responseMessages.projects.getTypeById[lang].notFound,
                    code: 0,
                });
            }

            // Success response
            return res.status(200).json({
                message: responseMessages.projects.getTypeById[lang].success,
                code: 1,
                project_type: {
                    id: projectType._id,
                    type_name: projectType.type_name,
                    created_by: projectType.created_by,
                    updated_by: projectType.updated_by,
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
