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
        let query = 'SELECT id, group_name, description, type, is_active, group_leader, created_by, updated_by, createdAt, updatedAt FROM user_groups WHERE 1=1';
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

        try {
            const [groups] = await sequelize.query(query, { replacements });

            // Benzersiz user ID'lerini topla
            const userIds = new Set();
            groups.forEach(group => {
                if (group.created_by) userIds.add(group.created_by);
                if (group.updated_by) userIds.add(group.updated_by);
                if (group.group_leader) userIds.add(group.group_leader);  // group_leader ekle
            });

            // Kullanıcı bilgilerini al
            let users = [];
            if (userIds.size > 0) {
                const userQuery = `
                    SELECT id, first_name, last_name 
                    FROM users 
                    WHERE id IN (${Array.from(userIds).map(() => '?').join(',')})
                `;
                const [userResults] = await sequelize.query(userQuery, { replacements: Array.from(userIds) });
                users = userResults;
            }

            // Kullanıcıları bir Map'e dönüştür
            const userMap = new Map();
            users.forEach(user => {
                userMap.set(user.id, `${user.first_name} ${user.last_name}`);
            });

            // Gruplara kullanıcı adlarını ekle
            const formattedGroups = groups.map(group => ({
                ...group,
                created_by: userMap.get(group.created_by) || group.created_by,
                updated_by: userMap.get(group.updated_by) || group.updated_by,
                group_leader: userMap.get(group.group_leader) || group.group_leader,
            }));

            res.status(200).json({
                code: 1,
                message: 'User groups successfully fetched.',
                groups: formattedGroups
            });
        } catch (error) {
            console.error('Error fetching user groups:', error);
            res.status(500).json({ error: 'Failed to fetch user groups from the database' });
        }

        try {
            const [groups, metadata] = await sequelize.query(query, { replacements });
            res.status(200).json({
                code: 1,
                message: 'User groups successfully fetched.',
                groups
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
