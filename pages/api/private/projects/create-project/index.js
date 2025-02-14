// --------------------------------
// | Service Name: Create Project
// | Description: Service used by managers to create a new project.
// | Parameters: title, description, type, start_date, end_date, project_lead, assignment_type, assignee_user, assignee_group
// | Endpoint: /api/private/projects/create-project
// --------------------------------

import { verify } from 'jsonwebtoken';
import Project from '@/models/Project';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
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
            const { title, description, type, start_date, end_date, project_lead, assignment_type, assignee_user, assignee_group } = req.body;

            // Zorunlu alan kontrolü
            if (!title || !description || !type || !start_date || !project_lead || assignment_type === undefined) {
                return res.status(400).json({
                    message: responseMessages.projects.create[lang].allFieldsRequired,
                    code: 0
                });
            }

            // assignment_type kontrolü
            if (assignment_type === 0 && (!assignee_user || assignee_user.length === 0)) {
                return res.status(400).json({
                    message: responseMessages.projects.create[lang].assigneeUserRequired,
                    code: 0
                });
            }

            if (assignment_type === 1 && (!assignee_group || assignee_group.length === 0)) {
                return res.status(400).json({
                    message: responseMessages.projects.create[lang].assigneeGroupRequired,
                    code: 0
                });
            }

            // Yeni proje oluştur
            const newProject = new Project({
                title,
                description,
                type,
                start_date,
                end_date: end_date || null,
                status: "To Do",
                project_lead,
                assignment_type,
                assignee_user: assignment_type === 0 ? assignee_user : [],
                assignee_group: assignment_type === 1 ? assignee_group : [],
                created_by: userId,
                updated_by: null
            });

            await newProject.save();

            return res.status(200).json({
                message: responseMessages.projects.create[lang].success,
                code: 1,
                projectId: newProject._id
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
