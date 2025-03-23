// --------------------------------
// |
// | Service Name: Get Task Label By ID
// | Description: Service that fetches the task label by ID.
// | Endpoint: /api/private/tasks/get-task-label-by-id
// |
// ------------------------------

import privateMiddleware from '@/middleware/private/index';
import TaskLabel from '@/models/TaskLabel';
import responseMessages from '@/static/responseMessages/messages';

// Find task label by ID
const findTaskLabelById = async (id) => {
    return await TaskLabel.findById(id).lean();
};

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        try {
            // ID from query
            const taskId = req.query.id;

            // Find task label
            const taskLabel = await findTaskLabelById(taskId);

            // Task label not found
            if (!taskLabel) {
                return res.status(200).json({
                    message: responseMessages.tasks.getLabelById[lang].notFound,
                    code: 0,
                });
            }

            // Success response
            return res.status(200).json({
                message: responseMessages.tasks.getLabelById[lang].success,
                code: 1,
                task_label: {
                    id: taskLabel._id,
                    label_name: taskLabel.type_name,
                    created_by: taskLabel.created_by,
                    updated_by: taskLabel.updated_by,
                },
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message,
            });
        }
    } else {
        // Sadece GET isteği kabul edilir
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
