// --------------------------------
// | Service Name: Create Task
// | Description: Service used by managers or project leads to create a new task for their projects..
// | Parameters: title, description, label, status, assignee_user, assignee_group, project_id, deadline, priority, assignment_type, created_by, updated_by
// | Endpoint: /api/private/projects/create-project
// --------------------------------

import { verify } from 'jsonwebtoken';
import Project from '@/models/Task';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'POST') {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: userId, role } = decoded;

            // Standart kullanıcılar proje oluşturamaz.
            if (role === 0) {
                return res.status(403).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0,
                });
            }

            // Request body
            const { title, description, label, assignee_user, assignee_group, project_id, deadline, priority, assignment_type } = req.body;

            // Zorunlu alan kontrolü
            if (!title || !description || !label || !assignee_user || !assignee_group || !project_id || !deadline || assignment_type === undefined) {
                return res.status(400).json({
                    message: responseMessages.tasks.create[lang].allFieldsRequired,
                    code: 0
                });
            }

            // assignment_type ve assignee_user kontrolü
            if (assignment_type === 0 && (!assignee_user || assignee_user.length === 0)) {
                return res.status(400).json({
                    message: responseMessages.tasks.create[lang].assigneeUserRequired,
                    code: 0
                });
            }

            // assignment_type ve assignee_group kontrolü
            if (assignment_type === 1 && (!assignee_group || assignee_group.length === 0)) {
                return res.status(400).json({
                    message: responseMessages.tasks.create[lang].assigneeGroupRequired,
                    code: 0
                });
            }

            // Yeni task oluştur
            const newTask = new Project({
                title,
                description,
                label,
                assignee_user: assignment_type === 0 ? assignee_user : null,
                assignee_group: assignment_type === 1 ? assignee_group : null,
                project_id,
                deadline,
                status: "To Do",
                priority: priority || 'Low',
                created_by: userId,
                updated_by: null
            });

            await newTask.save();

            return res.status(200).json({
                message: responseMessages.tasks.create[lang].success,
                code: 1,
                projectId: newTask._id
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
