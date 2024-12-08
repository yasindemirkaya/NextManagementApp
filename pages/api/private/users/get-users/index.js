import sequelize from '@/config/db';
import { verify } from 'jsonwebtoken';
import privateMiddleware from "@/middleware/private/index"

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

        const { is_active, is_verified, status, created_by, updated_by } = req.query;

        // Base query
        let query = 'SELECT id, first_name, last_name, email, mobile, is_active, is_verified, role, created_by, updated_by, createdAt, updatedAt FROM users WHERE 1=1';
        const replacements = [];

        // is_active 
        if (is_active) {
            query += ' AND is_active = ?';
            replacements.push(is_active === 'true' ? 1 : 0);
        }

        // is_verified
        if (is_verified) {
            query += ' AND is_verified = ?';
            replacements.push(is_verified === 'true' ? 1 : 0);
        }

        // status
        if (status) {
            query += ' AND role = ?';
            replacements.push(status);
        }

        // created_by
        if (created_by) {
            query += ' AND created_by = ?';
            replacements.push(created_by);
        }

        // updated_by
        if (updated_by) {
            query += ' AND updated_by = ?';
            replacements.push(updated_by);
        }

        // İstekte bulunan kullanıcının rolüne göre dönen veriyi filtreleme
        if (userRole === 1) {
            // Eğer admin ise sadece kendi gibi adminleri ve standard userları görebilir
            query += ' AND role IN (0, 1)';
        } else if (userRole === 2) {
            // Eğer rol 2 ise, tüm kullanıcıları döndür
            // query'ye ek bir şey eklemeye gerek yok çünkü zaten tüm kullanıcılar çekiliyor
        } else {
            // Diğer durumlar için
        }

        try {
            const [users, metadata] = await sequelize.query(query, { replacements });

            // Benzersiz created_by ve updated_by ID'lerini topla
            const userIds = new Set();
            users.forEach(user => {
                if (user.created_by) userIds.add(user.created_by);
                if (user.updated_by) userIds.add(user.updated_by);
            });

            // Kullanıcı bilgilerini al
            let usersInfo = [];
            if (userIds.size > 0) {
                const userQuery = `
                    SELECT id, first_name, last_name 
                    FROM users 
                    WHERE id IN (${Array.from(userIds).map(() => '?').join(',')})
                `;
                const [userResults] = await sequelize.query(userQuery, { replacements: Array.from(userIds) });
                usersInfo = userResults;
            }

            // Kullanıcıları bir Map'e dönüştür
            const userMap = new Map();
            usersInfo.forEach(user => {
                userMap.set(user.id, `${user.first_name} ${user.last_name}`);
            });

            // Kullanıcı bilgilerini "created_by" ve "updated_by" alanlarına ekle
            const formattedUsers = users.map(user => ({
                ...user,
                created_by: userMap.get(user.created_by) || user.created_by,
                updated_by: userMap.get(user.updated_by) || user.updated_by,
            }));

            res.status(200).json({
                code: 1,
                message: 'Users successfully fetched.',
                users: formattedUsers
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users from the database' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default privateMiddleware(handler);
