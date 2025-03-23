// --------------------------------
// |
// | Service Name: Update Project
// | Description: Service for updating a project.
// | Endpoint: /api/private/project/update-project
// |
// ------------------------------

import Project from '@/models/Project';
import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
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

    // Request body
    const { projectId, project_lead, title, description, type, start_date, end_date, status, assignment_type, assignee_user, assignee_group } = req.body;

    // Project ID required
    if (!projectId) {
        return res.status(200).json({
            code: 0,
            message: responseMessages.projects.update[lang].projectIdRequired
        });
    }

    try {
        // Find project
        const project = await Project.findById(projectId);

        // Project Not Found
        if (!project) {
            return res.status(200).json({
                code: 0,
                message: responseMessages.projects.update[lang].notFound
            });
        }

        // Kullanıcı Super Admin değilse, güncellemeye çalıştığı projenin oluşturucusu ya da leadi değilse o zaman o projeyi güncelleyemez
        if (userRole !== 2 && project.created_by.toString() !== userId && project.project_lead.toString() !== userId) {
            return res.status(403).json({
                code: 0,
                message: responseMessages.common[lang].noPermission
            });
        }

        // Update project
        if (project_lead) project.project_lead = project_lead;
        if (title) project.title = title;
        if (description) project.description = description;
        if (start_date) project.start_date = start_date;
        if (end_date) project.end_date = end_date;
        if (status) project.status = status;
        if (assignment_type) project.assignment_type = assignment_type;
        if (assignee_user) project.assignee_user = assignee_user;
        if (assignee_group) project.assignee_group = assignee_group;
        if (type) project.type = type;

        project.updated_by = userId;
        await project.save();

        // Response
        return res.status(200).json({
            code: 1,
            message: responseMessages.projects.update[lang].success,
        });
    } catch (error) {
        return res.status(500).json({
            code: 0,
            message: responseMessages.common[lang].errorOccured
        });
    }
};

export default privateMiddleware(handler);
