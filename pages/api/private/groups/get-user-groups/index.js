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

import { verify } from 'jsonwebtoken';
import privateMiddleware from "@/middleware/private/index";
import UserGroup from '@/models/UserGroup';
import User from '@/models/User';

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

        const { is_active, type, group_leader, created_by, limit, page } = req.query;

        // Kullanıcı rolüne göre parametre kontrolü
        if (userRole === 1) {
            // Rol 1 (admin) ise, group_leader ve created_by parametrelerini kullanamaz
            if (group_leader || created_by) {
                return res.status(200).json({
                    message: 'You are not allowed to use "group_leader" or "created_by" parameters.',
                    code: 0
                });
            }
        }

        // MongoDB sorgusunu başlat
        const filter = {};

        // is_active
        if (is_active) {
            filter.is_active = is_active === 'true';
        }

        // type
        if (type) {
            filter.type = type;
        }

        // group_leader
        if (group_leader) {
            filter.group_leader = group_leader;
        }

        // created_by
        if (created_by) {
            filter.created_by = created_by;
        }

        // Sayfalama için limit ve skip hesaplaması
        const limitValue = limit ? Number(limit) : 10;
        const pageValue = page ? Number(page) : 1;
        const skipValue = (pageValue - 1) * limitValue;

        try {
            // Toplam grup sayısını al
            const totalGroups = await UserGroup.countDocuments(filter);

            // Kullanıcı gruplarını MongoDB'den sorgula
            const groups = await UserGroup.find(filter)
                .limit(limitValue)
                .skip(skipValue)
                .exec();

            // Benzersiz user ID'lerini topla
            const userIds = new Set();
            groups.forEach(group => {
                if (group.created_by) userIds.add(group.created_by);
                if (group.updated_by) userIds.add(group.updated_by);
                if (group.group_leader) userIds.add(group.group_leader);
            });

            // Kullanıcı bilgilerini al
            let users = [];
            if (userIds.size > 0) {
                users = await User.find({ '_id': { $in: Array.from(userIds) } }).exec();
            }

            // Kullanıcıları bir Map'e dönüştür
            const userMap = new Map();
            users.forEach(user => {
                userMap.set(user._id.toString(), `${user.first_name} ${user.last_name}`);
            });

            // Gruplara kullanıcı adlarını ekle
            const formattedGroups = groups.map(group => ({
                ...group.toObject(),
                created_by: userMap.get(group.created_by?.toString()) || group.created_by,
                updated_by: userMap.get(group.updated_by?.toString()) || group.updated_by,
                group_leader: userMap.get(group.group_leader?.toString()) || group.group_leader,
            }));

            res.status(200).json({
                code: 1,
                message: 'User groups successfully fetched.',
                total: totalGroups,
                currentPage: pageValue,
                totalPages: Math.ceil(totalGroups / limitValue),
                groups: formattedGroups
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