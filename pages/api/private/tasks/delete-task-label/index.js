// --------------------------------
// |
// | Service Name: Delete Task Label
// | Description: Service that allows super admin to delete a Task Label by ID.
// | Parameters: taskId (as a body parameter)
// | Endpoint: /api/private/tasks/delete-task-label
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import TaskLabel from '@/models/TaskLabel';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'DELETE') {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { role } = decoded;

            // Permission control
            if (role !== 2) {
                return res.status(200).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0,
                });
            }

            // Request body
            const { taskLabelId } = req.body;

            // Task Label ID required
            if (!taskLabelId) {
                return res.status(200).json({
                    message: responseMessages.tasks.deleteLabel[lang].idRequired,
                    code: 0
                });
            }

            // Find and delete Task Label by ID
            const deletedTaskLabel = await TaskLabel.findByIdAndDelete(taskLabelId);

            // Task Label not found
            if (!deletedTaskLabel) {
                return res.status(200).json({
                    message: responseMessages.tasks.deleteLabel[lang].notFound,
                    code: 0,
                });
            }

            // Success response
            return res.status(200).json({
                message: responseMessages.tasks.deleteLabel[lang].success,
                code: 1,
                deleted_task_label: deletedTaskLabel,
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message,
                code: 0
            });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
