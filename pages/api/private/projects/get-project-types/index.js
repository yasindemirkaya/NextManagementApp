// --------------------------------
// |
// | Service Name: Get Project Types
// | Description: Service to fetch all project types from the database.
// | Parameters: None
// | Endpoint: /api/private/projects/get-project-types
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import ProjectType from '@/models/ProjectType';
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
                    { type_name: { $regex: search, $options: 'i' } }, // type_name alanında arama
                    { created_by: { $regex: search, $options: 'i' } }  // created_by alanında arama
                ]
            } : {};

            // ProjectTypes koleksiyonunda arama ve sayfalama işlemi
            const ProjectTypes = await ProjectType.find(searchQuery)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            const totalProjects = await ProjectType.countDocuments(searchQuery); // Toplam talep türü sayısı
            const totalPages = Math.ceil(totalProjects / limit); // Toplam sayfa sayısı

            return res.status(200).json({
                message: responseMessages.projects.getTypes[lang].success,
                code: 1,
                project_types: ProjectTypes,
                pagination: {
                    totalData: totalProjects,
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
