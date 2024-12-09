// --------------------------------
// |
// | Service Name: Create User Group
// | Description: Service that allows admin or super admin to create a new user group.
// | Parameters: group_name, description, type, is_active, group_leader, created_by
// | Endpoint: /api/private/admin/create-user-group
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import UserGroup from '@/models/UserGroup'; // MongoDB uyumlu model
import privateMiddleware from "@/middleware/private/index";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            // Token'ı decode et ve kullanıcı rolünü al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: loggedInUserId, role } = decoded;

            // Kullanıcı admin (1) veya super admin (2) değilse işlem reddedilir
            if (role !== 1 && role !== 2) {
                return res.status(403).json({
                    message: "You do not have permission to create a user group.",
                    code: 0,
                });
            }

            // Request body
            const {
                groupName,
                description,
                type,
                isActive,
                groupLeader,
                members = [], // members opsiyonel, default olarak boş bir array
            } = req.body;

            // Gerekli alanların eksik olup olmadığını kontrol et
            if (!groupName || !type || groupLeader === undefined || isActive === undefined) {
                return res.status(200).json({
                    message: "Group name, type, group leader, and active status are required.",
                    code: 0,
                });
            }

            // Eğer members varsa, en az 2 kullanıcı olmalı
            if (members && members.length < 2) {
                return res.status(400).json({
                    message: "A group must have at least 2 members.",
                    code: 0,
                });
            }

            // Yeni kullanıcı grubu oluştur
            try {
                const newUserGroup = new UserGroup({
                    group_name: groupName,
                    description: description || null,
                    type: type,
                    is_active: isActive,
                    group_leader: groupLeader,
                    created_by: loggedInUserId,
                    members: members,
                });

                await newUserGroup.save(); // MongoDB'ye kaydet

                return res.status(200).json({
                    message: "User group successfully created.",
                    code: 1,
                    userGroup: newUserGroup,
                });
            } catch (error) {
                // Hata yakalama
                console.error('Error creating user group:', error);
                return res.status(500).json({
                    message: "An error occurred while creating the user group.",
                    error: error.message,
                    code: 0,
                });
            }
        } catch (error) {
            console.error('Error creating user group:', error);
            return res.status(500).json({
                message: "An error occurred.",
                error: error.message,
                code: 0,
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default privateMiddleware(handler);
