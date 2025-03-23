// --------------------------------
// |
// | Service Name: Delete Task
// | Description: Service to delete a task from table.
// | Endpoint: /api/private/tasks/delete-task
// |
// ------------------------------


import Task from '@/models/Task';
import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE']);
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

    // Permission control
    if (userRole === 0) {
        return res.status(403).json({
            message: responseMessages.common[lang].noPermission
        });
    }

    // Request body
    const { taskId } = req.body;

    // Task ID required
    if (!taskId) {
        return res.status(400).json({
            code: 0,
            message: responseMessages.tasks.delete[lang].taskIdRequired
        });
    }

    try {
        // Find task
        const task = await Task.findById(taskId);

        // Task Not Found
        if (!task) {
            return res.status(200).json({
                code: 0,
                message: responseMessages.tasks.delete[lang].notFound
            });
        }

        // Eğer isteği yapan kullanıcı Admin ise o zaman kendi oluşturduğu taskları silebilir, başka taskları silemez
        if (userRole === 1 && task.created_by.toString() !== userId) {
            return res.status(403).json({
                code: 0,
                message: responseMessages.common[lang].noPermission
            });
        }

        // Delete task
        await task.deleteOne();

        // Response
        return res.status(200).json({
            code: 1,
            message: responseMessages.tasks.delete[lang].success
        });
    } catch (error) {
        return res.status(500).json({
            code: 0,
            message: responseMessages.common[lang].errorOccured
        });
    }
};

export default privateMiddleware(handler);
