// --------------------------------
// |
// | Service Name: Get Task By ID
// | Description: Service that fetches a task based on its ID.
// | Parameters: id
// | Endpoints:
// | /api/private/tasks/get-task/:id
// |
// ------------------------------

import Task from '@/models/Task';
import User from '@/models/User';
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

        const { id } = req.query;

        if (!id) {
            return res.status(200).json({
                message: responseMessages.tasks.getById[lang].taskIdRequired,
                code: 0
            });
        }

        try {
            const task = await Task.findById(id).lean();

            if (!task) {
                return res.status(200).json({
                    message: responseMessages.tasks.getById[lang].notFound,
                    code: 0
                });
            }

            let hasAccess = false;

            if (userRole === 2) {
                hasAccess = true;
            } else {
                if (task.assignment_type === 0) {
                    if (task.assignee_user && task.assignee_user.length > 0 && !task.assignee_group) {
                        hasAccess = true;
                    }
                } else if (task.assignment_type === 1) {
                    if (!task.assignee_user || task.assignee_user.length === 0 && task.assignee_group && task.assignee_group.length > 0) {
                        hasAccess = true;
                    }
                }
            }

            if (!hasAccess) {
                return res.status(200).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0
                });
            }

            let userIds = [task.created_by, task.updated_by].filter(Boolean);
            let groupIds = [];

            if (task.assignment_type === 0) {
                if (task.assignee_user && task.assignee_user.length > 0 && !task.assignee_group) {
                    userIds = [...new Set([...userIds, ...(task.assignee_user || [])])];
                }
            } else if (task.assignment_type === 1) {
                if ((!task.assignee_user || task.assignee_user.length === 0) && task.assignee_group && task.assignee_group.length > 0) {
                    groupIds = [...new Set([...groupIds, ...(task.assignee_group || [])])];
                }
            }

            const users = await User.find({ _id: { $in: userIds } }, '_id first_name last_name');

            const userMap = users.reduce((acc, user) => {
                acc[user._id.toString()] = { id: user._id, name: `${user.first_name} ${user.last_name}` };
                return acc;
            }, {});

            const formattedTask = {
                ...task,
                start_date: formatDate(task.start_date),
                end_date: formatDate(task.end_date),
                deadline: formatDate(task.deadline),
                created_by: task.created_by ? userMap[task.created_by.toString()] || { id: task.created_by, name: 'Unknown User' } : null,
                updated_by: task.updated_by ? userMap[task.updated_by.toString()] || { id: task.updated_by, name: 'Unknown User' } : null,
                assignee_user: task.assignment_type === 0
                    ? (task.assignee_user || []).map(id => userMap[id.toString()] || { id, name: 'Unknown User' })
                    : [],
                assignee_group: [],
            };

            res.status(200).json({
                code: 1,
                message: responseMessages.tasks.getById[lang].success,
                task: formattedTask
            });
        } catch (error) {
            res.status(500).json({
                message: responseMessages.tasks.getById[lang].failedToFetch,
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
