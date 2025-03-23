// --------------------------------
// |
// | Service Name: Update Task
// | Description: Service for updating a task.
// | Endpoint: /api/private/tasks/update-task
// |
// ------------------------------

import Task from '@/models/Task';
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
    const { taskId, title, description, label, status, assignment_type, assignee_user, assignee_group, deadline, priority } = req.body;

    // Task ID required
    if (!taskId) {
        return res.status(200).json({
            code: 0,
            message: responseMessages.tasks.update[lang].taskIdRequired
        });
    }

    try {
        // Find task
        const task = await Task.findById(taskId);

        // Task Not Found
        if (!task) {
            return res.status(200).json({
                code: 0,
                message: responseMessages.tasks.update[lang].notFound
            });
        }

        // Kullanıcı Super Admin değilse, güncellemeye çalıştığı taskın oluşturucusu değilse o zaman o projeyi güncelleyemez
        if (userRole !== 2 && task.created_by.toString() !== userId) {
            return res.status(403).json({
                code: 0,
                message: responseMessages.common[lang].noPermission
            });
        }

        // Update task
        if (title) task.title = title;
        if (description) task.description = description;
        if (label) task.label = label;
        if (status) task.status = status;
        if (assignment_type) task.assignment_type = assignment_type;
        if (assignee_user !== undefined) task.assignee_user = assignee_user === "" ? null : assignee_user;
        if (assignee_group !== undefined) task.assignee_group = assignee_group === "" ? null : assignee_group;
        if (deadline) task.deadline = deadline;
        if (priority) task.priority = priority;

        task.updated_by = userId;
        await task.save();

        // Response
        return res.status(200).json({
            code: 1,
            message: responseMessages.tasks.update[lang].success,
        });
    } catch (error) {
        return res.status(500).json({
            code: 0,
            message: responseMessages.common[lang].errorOccured
        });
    }
};

export default privateMiddleware(handler);
