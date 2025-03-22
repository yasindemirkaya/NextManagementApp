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
                message: responseMessages.tasks.getById[lang].taskIdRequired,
                code: 0
            });
        }

        try {
            // Find task by ID
            const task = await Task.findById(id).lean();

            if (!task) {
                return res.status(200).json({
                    message: responseMessages.tasks.getById[lang].notFound,
                    code: 0
                });
            }

            let hasAccess = false;

            // Eğer userRole 2 (Super Admin) ise, doğrudan erişim izni ver
            if (userRole === 2) {
                hasAccess = true;
            } else {
                // Eğer assignment_type 0 ise, assignee_user dolu, assignee_group boş olmalı
                if (task.assignment_type === 0) {
                    if (task.assignee_user && task.assignee_user.length > 0 && !task.assignee_group) {
                        hasAccess = true;
                    }
                    // Eğer assignment_type 1 ise, assignee_group dolu, assignee_user boş olmalı
                } else if (task.assignment_type === 1) {
                    if (!task.assignee_user || task.assignee_user.length === 0 && task.assignee_group && task.assignee_group.length > 0) {
                        hasAccess = true;
                    }
                }
            }

            // No access control
            if (!hasAccess) {
                return res.status(200).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0
                });
            }

            let userIds = [];
            let groupIds = [];

            // Eğer assignment_type 0 ise, assignee_user dolu olmalı ve assignee_group boş olmalı
            if (task.assignment_type === 0) {
                if (task.assignee_user && task.assignee_user.length > 0 && !task.assignee_group) {
                    userIds = [...new Set([task.created_by, task.updated_by, ...task.assignee_user || []])];
                    groupIds = [];
                }
                // Eğer assignment_type 1 ise, assignee_group dolu olmalı ve assignee_user boş olmalı
            } else if (task.assignment_type === 1) {
                if (!task.assignee_user || task.assignee_user.length === 0 && task.assignee_group && task.assignee_group.length > 0) {
                    userIds = [...new Set([task.created_by, task.updated_by])]; // assignee_user boş, sadece userId'ler
                    groupIds = [...new Set(task.assignee_group || [])]; // assignee_group dolu olmalı
                }
            }

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
            const formattedTask = {
                ...task,
                start_date: formatDate(task.start_date),
                end_date: formatDate(task.end_date),
                created_by: task.created_by ? userMap[task.created_by] : null,
                updated_by: task.updated_by ? userMap[task.updated_by] : null,
                // assignment_type'e göre assignee_user ve assignee_group kontrolü
                assignee_user: task.assignment_type === 0
                    ? (task.assignee_user || []).map(id => userMap[id] || { id, name: 'Unknown User' })
                    : [], // assignment_type 1 ise assignee_user boş
                assignee_group: task.assignment_type === 1
                    ? (task.assignee_group || []).map(id => groupMap[id] || { id, name: 'Unknown Group' })
                    : [], // assignment_type 0 ise assignee_group boş
            };

            // Success response
            res.status(200).json({
                code: 1,
                message: responseMessages.tasks.getById[lang].success,
                task: formattedTask
            });
        } catch (error) {
            console.log(error)
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
