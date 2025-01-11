// --------------------------------
// |
// | Service Name: Create User Group
// | Description: Service that allows admin or super admin to create a new user group.
// | Parameters: group_name, description, type, is_active, group_leader, created_by
// | Endpoint: /api/private/admin/create-user-group
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import UserGroup from '@/models/UserGroup';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'POST') {
        try {
            // Token'ı decode et ve kullanıcı rolünü al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: loggedInUserId, role } = decoded;

            // Kullanıcı admin (1) veya super admin (2) değilse işlem reddedilir
            if (role !== 1 && role !== 2) {
                return res.status(403).json({
                    message: responseMessages.common[lang].noPermission,
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
                    message: responseMessages.group.create[lang].requiredParams,
                    code: 0,
                });
            }

            // Eğer members varsa, en az 2 kullanıcı olmalı
            if (members && members.length < 2) {
                return res.status(200).json({
                    message: responseMessages.group.create[lang].minMembers,
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
                    message: responseMessages.group.create[lang].success,
                    code: 1,
                    userGroup: newUserGroup,
                });
            } catch (error) {
                // Hata yakalama
                console.error('Error creating user group:', error);
                return res.status(500).json({
                    message: responseMessages.common[lang].errorOccured,
                    error: error.message,
                    code: 0,
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred.",
                error: error.message,
                code: 0,
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
