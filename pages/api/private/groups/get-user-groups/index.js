// --------------------------------
// |
// | Service Name: Get All User Groups
// | Description: Service that fetches all user groups based on various filters.
// | Parameters: is_active, type, group_leader, created_by
// | Endpoints:
// | /api/private/groups/get-user-groups
// | /api/private/groups/get-user-groups?is_active=true
// | /api/private/groups/get-user-groups?type=Web
// | /api/private/groups/get-user-groups?group_leader=035275ae-69fd-4fab-ad58-c0f3ed2a18d9
// | /api/private/groups/get-user-groups?created_by=035275ae-69fd-4fab-ad58-c0f3ed2a18d9
// |
// ------------------------------

import sequelize from '@/config/db';
import { verify } from 'jsonwebtoken';
import privateMiddleware from "@/middleware/private/index";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        // Token'ı decode et ve kullanıcı rolünü al
        let userRole;
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            userRole = decoded?.role;
        } catch (error) {
            return res.status(200).json({
                message: 'Invalid token, please log in again.',
                code: 0
            });
        }

        // Role kontrolü: Eğer userRole 0 ise, veri döndürme
        if (userRole === 0) {
            return res.status(403).json({
                message: 'You do not have permission to access this resource.',
                code: 0
            });
        }

        // Query parametrelerini al
        const { is_active, type, group_leader, created_by } = req.query;

        // Kullanıcı rolüne göre parametre kontrolü
        if (userRole === 1) {
            // Rol 1 ise, group_leader ve created_by parametrelerini kullanamaz
            if (group_leader || created_by) {
                return res.status(200).json({
                    message: 'You are not allowed to use "group_leader" or "created_by" parameters.',
                    code: 0
                });
            }
        }

        // Base query
        let query = 'SELECT id, group_name, description, type, is_active, group_leader, created_by, createdAt, updatedAt FROM user_groups WHERE 1=1';
        const replacements = [];

        // is_active
        if (is_active) {
            query += ' AND is_active = ?';
            replacements.push(is_active === 'true' ? 1 : 0);
        }

        // type
        if (type) {
            query += ' AND type = ?';
            replacements.push(type);
        }

        // group_leader
        if (group_leader) {
            query += ' AND group_leader = ?';
            replacements.push(group_leader);
        }

        // created_by
        if (created_by) {
            query += ' AND created_by = ?';
            replacements.push(created_by);
        }

        // İstekte bulunan kullanıcının rolüne göre dönen veriyi filtreleme
        if (userRole === 1) {
            // Eğer admin ise sadece kendi gibi adminleri ve standard userları görebilir
            query += ' AND role IN (0, 1)';
        } else if (userRole === 2) {
            // Eğer rol 2 ise, tüm kullanıcıları döndür
            // query'ye ek bir şey eklemeye gerek yok çünkü zaten tüm kullanıcılar çekiliyor
        } else {

        }

        try {
            const [userGroups, metadata] = await sequelize.query(query, { replacements });
            res.status(200).json({
                code: 1,
                message: 'User groups successfully fetched.',
                userGroups
            });
        } catch (error) {
            console.error('Error fetching user groups:', error);
            res.status(500).json({ error: 'Failed to fetch user groups from the database' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default privateMiddleware(handler);
