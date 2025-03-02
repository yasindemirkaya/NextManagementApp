// --------------------------------
// |
// | Service Name: Get All Projects
// | Description: Service that fetches all projects based on various filters.
// | Parameters: type, project_lead, status, assignment_type, search, limit, page
// | Endpoints:
// | /api/private/projects/get-projects
// | /api/private/projects/get-projects?type=Web
// | /api/private/projects/get-projects?project_lead=123
// | /api/private/projects/get-projects?status=ToDo
// | /api/private/projects/get-projects?assignment_type=0
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

        // Request body
        const { type, project_lead, status, assignment_type, limit, page, search } = req.query;
        let queryOptions = {};

        if (userRole !== 2) {
            const userObjectId = new mongoose.Types.ObjectId(userId);
            const userGroups = await UserGroup.find({ members: userObjectId }, '_id');
            const userGroupIds = userGroups.map(group => group._id);
            queryOptions.$or = [
                { created_by: userObjectId },
                { project_lead: userObjectId },
                { $and: [{ assignment_type: { $in: [0, 1] } }, { assignee_user: userObjectId }] },
                { $and: [{ assignment_type: 2 }, { assignee_group: { $in: userGroupIds } }] }
            ];
        }

        // Search options
        if (type) queryOptions.type = type;
        if (project_lead) queryOptions.project_lead = project_lead;
        if (status) queryOptions.status = status;
        if (assignment_type) queryOptions.assignment_type = assignment_type;
        if (search) {
            queryOptions.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { type: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        let limitValue = limit ? parseInt(limit) : null;
        let pageValue = page ? parseInt(page) : null;
        let skipValue = (pageValue && limitValue) ? (pageValue - 1) * limitValue : 0;

        try {
            const totalProjects = await Project.countDocuments(queryOptions);
            const totalPages = limitValue ? Math.ceil(totalProjects / limitValue) : 1;

            let projects = await Project.find(queryOptions).limit(limitValue || 0).skip(skipValue).lean();

            const userIds = [...new Set(projects.flatMap(p => [...(p.assignee_user || [])]))];
            const groupIds = [...new Set(projects.flatMap(p => [...(p.assignee_group || [])]))];

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
            projects = projects.map(p => ({
                ...p,
                start_date: formatDate(p.start_date),
                end_date: formatDate(p.end_date),
                assignee_user: (p.assignee_user || []).map(id => userMap[id] || { id, name: 'Unknown User' }),
                assignee_group: (p.assignee_group || []).map(id => groupMap[id] || { id, name: 'Unknown Group' })
            }));

            // Success response
            res.status(200).json({
                code: 1,
                message: responseMessages.projects.get[lang].success,
                projects,
                pagination: {
                    totalData: totalProjects,
                    totalPages,
                    currentPage: pageValue,
                    limit: limitValue
                }
            });
        } catch (error) {
            res.status(500).json({ error: responseMessages.projects.get[lang].failedToFetch });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: responseMessages.common[lang].methodNotAllowed });
    }
};

export default privateMiddleware(handler);