// --------------------------------
// |
// | Service Name: Get Project By ID
// | Description: Service that fetches a project based on its ID.
// | Parameters: id
// | Endpoints:
// | /api/private/projects/get-project/:id
// |
// ------------------------------

import Project from '@/models/Project';
import User from '@/models/User';
import UserGroup from '@/models/UserGroup';
import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import responseMessages from '@/static/responseMessages/messages';
import mongoose from 'mongoose';

const formatDate = (date) => (date ? new Date(date).toISOString().split('T')[0] : null);

const handler = async (req, res) => {
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        let userRole, userId;
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            userRole = decoded?.role;
            userId = decoded.id;
        } catch (error) {
            return res.status(200).json({ message: responseMessages.common[lang].invalidToken, code: 0 });
        }

        // Request params
        const { id } = req.query;

        if (!id) {
            return res.status(200).json({
                message: responseMessages.projects.getById[lang].projectIdRequired,
                code: 0
            });
        }

        try {
            // Find project by ID
            const project = await Project.findById(id).lean();

            if (!project) {
                return res.status(200).json({
                    message: responseMessages.projects.getById[lang].notFound,
                    code: 0
                });
            }

            // Find user groups for access control
            let hasAccess = false;

            if (userRole !== 2) {
                const userObjectId = new mongoose.Types.ObjectId(userId);
                const userGroups = await UserGroup.find({ members: userObjectId }, '_id');
                const userGroupIds = userGroups.map(group => group._id);
                hasAccess =
                    userId === project.created_by?.toString() ||
                    userId === project.project_lead?.toString() ||
                    project.assignee_user?.some(assignee => assignee.toString() === userId) ||
                    project.assignee_group?.some(group => userGroupIds.includes(group.toString()));
            } else {
                hasAccess = true;
            }

            // No access control
            if (!hasAccess) {
                return res.status(200).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0
                });
            }

            // Find users and groups for assignee_user and assignee_group formatting
            const userIds = [...new Set([project.created_by, project.project_lead, project.updated_by, ...project.assignee_user || []])];
            const groupIds = [...new Set(project.assignee_group || [])];

            const users = await User.find({ _id: { $in: userIds } }, '_id first_name last_name');
            const groups = await UserGroup.find({ _id: { $in: groupIds } }, '_id group_name');

            // Map users
            const userMap = users.reduce((acc, user) => {
                acc[user._id] = { id: user._id, name: `${user.first_name} ${user.last_name}` };
                return acc;
            }, {});

            // Map user groups
            const groupMap = groups.reduce((acc, group) => {
                acc[group._id] = { id: group._id, name: group.group_name };
                return acc;
            }, {});

            // Format response project
            const formattedProject = {
                ...project,
                start_date: formatDate(project.start_date),
                end_date: formatDate(project.end_date),
                created_by: project.created_by ? userMap[project.created_by] : null,
                updated_by: project.updated_by ? userMap[project.updated_by] : null,
                project_lead: userMap[project.project_lead] || { id: project.project_lead, name: 'Unknown User' },
                assignee_user: (project.assignee_user || []).map(id => userMap[id] || { id, name: 'Unknown User' }),
                assignee_group: (project.assignee_group || []).map(id => groupMap[id] || { id, name: 'Unknown Group' }),
            };

            // Success response
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
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
