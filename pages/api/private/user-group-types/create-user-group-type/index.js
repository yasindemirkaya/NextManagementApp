// --------------------------------
// |
// | Service Name: Create User Group Type
// | Description: Service that allows admin to create a new user group type.
// | Parameters: type_name
// | Endpoint: /api/private/user-group-types/create-user-group-type
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import UserGroupType from '@/models/UserGroupType';
import User from '@/models/User';
import privateMiddleware from "@/middleware/private/index"

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            // Token'ı decode et ve kullanıcı rolünü al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: adminId, role } = decoded;

            // Super admin (2) değilse işlem reddedilir
            if (role !== 2) {
                return res.status(403).json({
                    message: "You do not have permission to create a user group type.",
                    code: 0,
                });
            }

            // Request body
            const { typeName } = req.body;

            if (!typeName) {
                return res.status(200).json({
                    message: "Type name is required.",
                    code: 0
                });
            }

            // Aynı type_name mevcut mu kontrol et
            const existingGroupType = await UserGroupType.findOne({ type_name: typeName });
            if (existingGroupType) {
                return res.status(200).json({
                    message: `A group type with the name "${typeName}" already exists.`,
                    code: 0
                });
            }

            // created_by ve updated_by kullanıcı bilgilerini al
            const createdByUser = await User.findById(adminId);
            if (!createdByUser) {
                return res.status(404).json({
                    message: "Created by user not found.",
                    code: 0
                });
            }
            const createdByName = `${createdByUser.first_name} ${createdByUser.last_name}`;

            // Yeni UserGroupType ekleme işlemi
            const newUserGroupType = new UserGroupType({
                type_name: typeName,
                created_by: createdByName,
                updated_by: createdByName,
            });

            await newUserGroupType.save();

            return res.status(200).json({
                message: "User group type successfully created.",
                code: 1,
                group_type: typeName,
                _id: newUserGroupType._id,
            });
        } catch (error) {
            console.error('Error creating user group type:', error);
            return res.status(500).json({
                message: "An error occurred.",
                error: error.message,
                code: 0
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default privateMiddleware(handler);
