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
import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import responseMessages from '@/static/responseMessages/messages';

const formatDate = (date) => (date ? new Date(date).toISOString().split('T')[0] : null);

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        let userRole, userId;
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            userRole = decoded?.role;
            userId = decoded.id;
        } catch (error) {
            return res.status(200).json({
                message: responseMessages.common[lang].invalidToken,
                code: 0
            });
        }

        // Request query
        const { type, project_lead, status, assignment_type, limit, page, search } = req.query;
        let queryOptions = {};

        if (type) queryOptions.type = type;
        if (project_lead) queryOptions.project_lead = project_lead;
        if (status) queryOptions.status = status;
        if (assignment_type) queryOptions.assignment_type = assignment_type;

        // Search
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

            let projects = await Project.find(queryOptions)
                .limit(limitValue || 0)
                .skip(skipValue)
                .lean();

            // Project lead
            const projectLeads = projects.map(p => p.project_lead).filter(Boolean);
            const uniqueUserIds = [...new Set(projectLeads)];

            const users = await User.find({ _id: { $in: uniqueUserIds } }, '_id first_name last_name');

            const userMap = users.reduce((acc, user) => {
                acc[user._id] = {
                    id: user._id,
                    name: `${user.first_name} ${user.last_name}`,
                };
                return acc;
            }, {});

            // Projects object
            projects = projects.map(p => ({
                ...p,
                start_date: formatDate(p.start_date),
                end_date: formatDate(p.end_date),
                project_lead: userMap[p.project_lead] || null
            }));

            // Response
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
            res.status(500).json({
                error: responseMessages.projects.get[lang].failedToFetch
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
