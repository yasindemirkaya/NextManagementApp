// --------------------------------
// |
// | Service Name: Delete Project
// | Description: Service to delete a project from table.
// | Endpoint: /api/private/projects/delete-project
// |
// ------------------------------


import Project from '@/models/Project';
import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }

    let userRole, userId;
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = verify(token, process.env.JWT_SECRET);
        userRole = decoded?.role;
        userId = decoded?.id;
    } catch (error) {
        return res.status(200).json({
            message: responseMessages.common[lang].invalidToken,
            code: 0
        });
    }

    // Permission control
    if (userRole === 0) {
        return res.status(403).json({
            message: responseMessages.common[lang].noPermission
        });
    }

    // Request body
    const { projectId } = req.body;

    // Project ID required
    if (!projectId) {
        return res.status(400).json({
            code: 0,
            message: responseMessages.projects.delete[lang].projectIdRequired
        });
    }

    try {
        // Find project
        const project = await Project.findById(projectId);

        // Project Not Found
        if (!project) {
            return res.status(200).json({
                code: 0,
                message: responseMessages.projects.delete[lang].notFound
            });
        }

        // Eğer isteği yapan kullanıcı Admin ise o zaman kendi oluşturduğu projeleri silebilir, başka projeleri silemez
        if (userRole === 1 && project.created_by.toString() !== userId) {
            return res.status(403).json({
                code: 0,
                message: responseMessages.common[lang].noPermission
            });
        }

        // Delete project
        await project.deleteOne();

        // Response
        return res.status(200).json({
            code: 1,
            message: responseMessages.projects.delete[lang].success
        });
    } catch (error) {
        return res.status(500).json({
            code: 0,
            message: responseMessages.common[lang].errorOccured
        });
    }
};

export default privateMiddleware(handler);
