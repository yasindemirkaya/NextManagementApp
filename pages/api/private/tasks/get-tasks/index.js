// --------------------------------
// |
// | Service Name: Get All Tasks
// | Description: Service that fetches all tasks based on various filters.
// | Parameters: label, assignment_type, assignee_user, assignee_group, project_id, priority, status, search, limit, page
// | Endpoints:
// | /api/private/tasks/get-tasks
// | /api/private/tasks/get-tasks?label=Development
// | /api/private/tasks/get-tasks?assignment_type=0
// | /api/private/tasks/get-tasks?assignee_user=123
// | /api/private/tasks/get-tasks?assignee_group=123
// | /api/private/tasks/get-tasks?project_id=123
// | /api/private/tasks/get-tasks?priority=Medium
// | /api/private/tasks/get-tasks?status=ToDo
// |
// ------------------------------

import Task from '@/models/Task';
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
        const { label, assignment_type, assignee_user, assignee_group, project_id, priority, status, search, limit, page } = req.query;
        let queryOptions = {};

        if (userRole !== 2) {
            const userObjectId = new mongoose.Types.ObjectId(userId);
            const userGroups = await UserGroup.find({ members: userObjectId }, '_id');
            const userGroupIds = userGroups.map(group => group._id);
            queryOptions.$or = [
                { created_by: userObjectId },
                { assignee_user: userObjectId },
                { $and: [{ assignment_type: 2 }, { assignee_group: { $in: userGroupIds } }] }
            ];
        }

        // Search options
        if (label) queryOptions.label = label;
        if (assignment_type) queryOptions.assignment_type = assignment_type;
        if (assignee_user) queryOptions.assignee_user = assignee_user;
        if (assignee_group) queryOptions.assignee_group = assignee_group;
        if (project_id) queryOptions.project_id = project_id;
        if (priority) queryOptions.priority = priority;
        if (status) queryOptions.status = status;
        if (search) {
            queryOptions.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        let limitValue = limit ? parseInt(limit) : null;
        let pageValue = page ? parseInt(page) : null;
        let skipValue = (pageValue && limitValue) ? (pageValue - 1) * limitValue : 0;

        try {
            const totalTasks = await Task.countDocuments(queryOptions);
            const totalPages = limitValue ? Math.ceil(totalTasks / limitValue) : 1;

            let tasks = await Task.find(queryOptions).limit(limitValue || 0).skip(skipValue).lean();

            const userIds = [
                ...new Set(
                    tasks.flatMap(t => {
                        if (t.assignment_type === 0) {
                            return Array.isArray(t.assignee_user) ? t.assignee_user : [];
                        }
                        return [];
                    })
                ),
            ];

            const groupIds = [
                ...new Set(
                    tasks.flatMap(t => {
                        if (t.assignment_type === 1) {
                            return Array.isArray(t.assignee_group) ? t.assignee_group : [];
                        }
                        return [];
                    })
                ),
            ];

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

            // Format response task
            tasks = tasks.map(t => {
                // Başlangıç ve bitiş tarihlerini formatla
                const formattedTask = {
                    ...t,
                    start_date: formatDate(t.start_date),
                    end_date: formatDate(t.end_date)
                };

                // Eğer assignment_type 0 ise assignee_user, 1 ise assignee_group dolu olacak şekilde işlem yap
                if (t.assignment_type === 0) {
                    formattedTask.assignee_user = (t.assignee_user || []).map(id => userMap[id] || { id, name: 'Unknown User' });
                    formattedTask.assignee_group = []; // assignee_group boş olur
                } else if (t.assignment_type === 1) {
                    formattedTask.assignee_group = (t.assignee_group || []).map(id => groupMap[id] || { id, name: 'Unknown Group' });
                    formattedTask.assignee_user = []; // assignee_user boş olur
                }

                return formattedTask;
            });

            // Success response
            res.status(200).json({
                code: 1,
                message: responseMessages.tasks.get[lang].success,
                tasks,
                pagination: {
                    totalData: totalTasks,
                    totalPages,
                    currentPage: pageValue,
                    limit: limitValue
                }
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: responseMessages.tasks.get[lang].failedToFetch });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: responseMessages.common[lang].methodNotAllowed });
    }
};

export default privateMiddleware(handler);