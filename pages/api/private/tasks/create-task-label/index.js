// --------------------------------
// |
// | Service Name: Create Task Label
// | Description: Service to create a new task label
// | Parameters: labelName
// | Endpoint: /api/private/tasks/create-task-label
// |
// ------------------------------


import { verify } from 'jsonwebtoken';
import TaskLabel from '@/models/TaskLabel';
import User from '@/models/User';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'POST') {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: adminId, role } = decoded;

            // Permission control
            if (role !== 2) {
                return res.status(200).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0,
                });
            }

            // Request body
            const { labelName } = req.body;

            // Label name control
            if (!labelName) {
                return res.status(200).json({
                    message: responseMessages.tasks.createLabel[lang].nameRequired,
                    code: 0
                });
            }

            // Existing label name
            const existingLabel = await TaskLabel.findOne({ label_name: labelName });
            if (existingLabel) {
                return res.status(200).json({
                    message: responseMessages.tasks.createLabel[lang].alreadyExist,
                    code: 0
                });
            }

            // Created by not found
            const createdByUser = await User.findById(adminId);
            if (!createdByUser) {
                return res.status(200).json({
                    message: responseMessages.tasks.createLabel[lang].createdByNotFound,
                    code: 0
                });
            }
            const createdByName = `${createdByUser.first_name} ${createdByUser.last_name}`;

            // Create new task label
            const newTaskLabel = new TaskLabel({
                label_name: labelName,
                created_by: createdByName,
                updated_by: createdByName,
            });

            await newTaskLabel.save();

            // Success response
            return res.status(200).json({
                message: responseMessages.tasks.createLabel[lang].success,
                code: 1,
                label_name: labelName,
                id: newTaskLabel._id,
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message,
                code: 0
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
}

export default privateMiddleware(handler);
