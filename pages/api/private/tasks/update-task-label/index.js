// --------------------------------
// |
// | Service Name: Update Task Label
// | Description: Service that allows super admin to update a task label's name.
// | Parameters: taskLabelId, labelName
// | Endpoint: /api/private/tasks/update-task-label
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index';
import TaskLabel from '@/models/TaskLabel';
import User from '@/models/User';
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'PUT') {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: userId, role } = decoded;

            // Permission control
            if (role !== 2) {
                return res.status(200).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0,
                });
            }

            // Request body
            const { taskLabelId, labelName } = req.body;

            // Payload control
            if (!taskLabelId || !labelName) {
                return res.status(200).json({
                    message: responseMessages.tasks.updateLabel[lang].idRequired,
                    code: 0,
                });
            }

            // Task label not found
            const taskLabel = await TaskLabel.findById(taskLabelId);
            if (!taskLabel) {
                return res.status(200).json({
                    message: responseMessages.tasks.updateLabel[lang].notFound,
                    code: 0,
                });
            }

            // Updating user not found
            const updatingUser = await User.findById(userId);
            if (!updatingUser) {
                return res.status(200).json({
                    message: responseMessages.common[lang].userNotFound,
                    code: 0,
                });
            }

            // Update Task label
            const updatedByName = `${updatingUser.first_name} ${updatingUser.last_name}`;

            taskLabel.label_name = labelName;
            taskLabel.updated_by = updatedByName;

            await taskLabel.save();

            // Success response
            return res.status(200).json({
                message: responseMessages.tasks.updateLabel[lang].success,
                code: 1,
                task_label: {
                    id: taskLabel._id,
                    label_name: taskLabel.label_name,
                    updated_by: taskLabel.updated_by,
                    updatedAt: taskLabel.updatedAt,
                },
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message,
                code: 0,
            });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
