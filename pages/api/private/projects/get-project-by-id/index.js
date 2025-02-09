// --------------------------------
// |
// | Service Name: Get Project By ID
// | Description: Service that brings the details of the project whose ID is sent.
// | Endpoint: /api/private/demands/get-project-by-id
// |
// ------------------------------

import Project from '@/models/Project';
import User from '@/models/User';
import UserGroup from '@/models/UserGroup';
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

    // Token control
    let userId;
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = verify(token, process.env.JWT_SECRET);
        userId = decoded?.id;
    } catch (error) {
        return res.status(200).json({
            message: responseMessages.common[lang].invalidToken,
            code: 0
        });
    }

    // Request query
    const { id } = req.query;

    // Project ID required
    if (!id) {
        return res.status(400).json({
            message: responseMessages.projects.getById[lang].projectIdRequired,
            code: 0
        });
    }

    try {
        // Find projects
        const project = await Project.findById(id).lean();

        // Project Not Found
        if (!project) {
            return res.status(404).json({
                message: responseMessages.projects.getById[lang].notFound,
                code: 0
            });
        }

        // Format users
        const userIds = [project.project_lead, project.created_by, project.updated_by].filter(Boolean);
        const users = await User.find({ _id: { $in: userIds } }, '_id first_name last_name');

        // Map users
        const userMap = users.reduce((acc, user) => {
            acc[user._id] = {
                id: user._id,
                name: `${user.first_name} ${user.last_name}`,
            };
            return acc;
        }, {});

        // Find users in user groups
        const userGroups = await UserGroup.find({ members: userId }, '_id');
        const userGroupIds = userGroups.map(group => group._id.toString());

        // Access control
        const hasAccess =
            userId === project.created_by?.toString() ||
            userId === project.project_lead?.toString() ||
            project.assignee_users?.some(assignee => assignee.toString() === userId) ||
            project.assignee_groups?.some(group => userGroupIds.includes(group.toString()));

        // No access
        if (!hasAccess) {
            return res.status(403).json({
                message: responseMessages.common[lang].noPermission,
                code: 0
            });
        }

        // Format project
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
            message: responseMessages.projects.getById[lang].failedToFetch,
            code: 0
        });
    }
};

export default privateMiddleware(handler);
