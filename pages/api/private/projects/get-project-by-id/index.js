// --------------------------------
// |
// | Service Name: Get Project By ID
// | Description: Service that brings the details of the project whose ID is sent.
// | Endpoint: /api/private/demands/get-project-by-id
// |
// ------------------------------

import Project from '@/models/Project';
import User from '@/models/User';
import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import responseMessages from '@/static/responseMessages/messages';

const formatDate = (date) => (date ? new Date(date).toISOString().split('T')[0] : null);

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method !== 'GET') {
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }

    let userRole;
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = verify(token, process.env.JWT_SECRET);
        userRole = decoded?.role;
    } catch (error) {
        return res.status(200).json({
            message: responseMessages.common[lang].invalidToken,
            code: 0
        });
    }

    // Authorization control
    if (userRole === 0) {
        return res.status(403).json({
            message: responseMessages.common[lang].noPermission
        });
    }

    // Request
    const { id } = req.query;

    // Project ID required
    if (!id) {
        return res.status(400).json({
            message: responseMessages.projects.getById[lang].projectIdRequired
        });
    }

    try {
        // Find project by id
        const project = await Project.findById(id).lean();

        // Project Not Found
        if (!project) {
            return res.status(404).json({
                message: responseMessages.projects.getById[lang].notFound
            });
        }

        // Format project_lead, created_by and updated_by
        const userIds = [project.project_lead, project.created_by, project.updated_by].filter(Boolean);
        const users = await User.find({ _id: { $in: userIds } }, '_id first_name last_name');

        const userMap = users.reduce((acc, user) => {
            acc[user._id] = {
                id: user._id,
                name: `${user.first_name} ${user.last_name}`,
            };
            return acc;
        }, {});

        // Format response
        const formattedProject = {
            ...project,
            start_date: formatDate(project.start_date),
            end_date: formatDate(project.end_date),
            project_lead: userMap[project.project_lead] || null,
            created_by: userMap[project.created_by] || null,
            updated_by: userMap[project.updated_by] || null
        };

        // Response
        res.status(200).json({
            code: 1,
            message: responseMessages.projects.getById[lang].success,
            project: formattedProject
        });
    } catch (error) {
        res.status(500).json({
            message: responseMessages.projects.getById[lang].failedToFetch
        });
    }
};

export default privateMiddleware(handler);
