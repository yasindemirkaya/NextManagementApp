// --------------------------------
// |
// | Service Name: Get User Group Types
// | Description: Service that allows super admin to get a list of all user group types.
// | Parameters: None
// | Endpoint: /api/private/user-group-types/get-user-group-types
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import UserGroupType from '@/models/UserGroupType';
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

            // Sadece Super admin (2) erişebilir.
            if (role != 2) {
                return res.status(403).json({
                    message: responseMessages.common[lang].noPermission,
                    code: 0,
                });
            }

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

            // UserGroupTypes koleksiyonunda arama ve sayfalama işlemi
            const userGroupTypes = await UserGroupType.find(searchQuery)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            const totalUsers = await UserGroupType.countDocuments(searchQuery); // Toplam kullanıcı sayısı
            const totalPages = Math.ceil(totalUsers / limit); // Toplam sayfa sayısı

            return res.status(200).json({
                message: responseMessages.userGroupTypes.get[lang].success,
                code: 1,
                user_group_types: userGroupTypes,
                pagination: {
                    totalData: totalUsers,
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