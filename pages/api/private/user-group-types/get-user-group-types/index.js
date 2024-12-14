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

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            // Token'ı decode et ve kullanıcı rolünü al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { role } = decoded;

            // Super admin (2) ya da Admin (1) değilse işlem reddedilir
            if (role == 1) {
                return res.status(403).json({
                    message: "You do not have permission to access the user group types.",
                    code: 0,
                });
            }

            // UserGroupTypes koleksiyonundaki tüm grup tiplerini al
            const userGroupTypes = await UserGroupType.find().sort({ createdAt: -1 });

            return res.status(200).json({
                message: "User group types successfully retrieved.",
                code: 1,
                user_group_types: userGroupTypes,
            });
        } catch (error) {
            console.error('Error retrieving user group types:', error);
            return res.status(500).json({
                message: "An error occurred while retrieving user group types.",
                error: error.message,
                code: 0
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default privateMiddleware(handler);
