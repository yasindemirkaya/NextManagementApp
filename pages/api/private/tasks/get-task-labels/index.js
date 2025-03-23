// --------------------------------
// |
// | Service Name: Get Task Labels
// | Description: Service to fetch all task labels from the database.
// | Parameters: None
// | Endpoint: /api/private/tasks/get-task-labels
// ------------------------------

import { verify } from 'jsonwebtoken';
import TaskLabel from '@/models/TaskLabel';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        try {
            // Token'ı decode et ve kullanıcı rolünü al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { role } = decoded;

            // Parametreleri al
            const { page = 1, limit = 10, search = '' } = req.query;
            const skip = (page - 1) * limit;

            // Arama kriterlerini oluştur
            const searchQuery = search ? {
                $or: [
                    { label_name: { $regex: search, $options: 'i' } }, // label_name alanında arama
                    { created_by: { $regex: search, $options: 'i' } }  // created_by alanında arama
                ]
            } : {};

            // TaskLabel koleksiyonunda arama ve sayfalama işlemi
            const TaskLabels = await TaskLabel.find(searchQuery)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            const totalTasks = await TaskLabel.countDocuments(searchQuery); // Toplam talep türü sayısı
            const totalPages = Math.ceil(totalTasks / limit); // Toplam sayfa sayısı

            return res.status(200).json({
                message: responseMessages.tasks.getLabels[lang].success,
                code: 1,
                task_labels: TaskLabels,
                pagination: {
                    totalData: totalTasks,
                    totalPages: totalPages,
                    currentPage: parseInt(page),
                    limit: parseInt(limit),
                }
            });
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message,
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
