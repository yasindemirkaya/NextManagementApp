// --------------------------------
// |
// | Service Name: Get All Users
// | Description: Service that fetches all users in the Users table.
// | Parameters: is_active, is_verified, status 
// | Endpoints: 
// | /api/private/users/get-users 
// | /api/private/users/get-users?is_active=true
// | /api/private/users/get-users?is_verified=true
// | /api/private/users/get-users?status=1
// | /api/private/users/get-users?is_active=true&is_verified=true&status=2
// |
// ------------------------------

import sequelize from '@/config/db';
import { verify } from 'jsonwebtoken';
import { isTokenExpiredServer } from '@/helpers/tokenVerifier';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        // JWT token'ı doğrulama
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(200).json({
                message: "You must be logged in to get this user's data.",
                code: 0
            });
        }

        // Token'ın süresi dolmuşsa kontrol et
        if (isTokenExpiredServer(token)) {
            return res.status(401).json({
                message: 'Token has expired, please log in again.',
                code: 0
            });
        }

        // Token'ı decode et ve kullanıcı rolünü al
        let userRole;
        try {
            const decoded = verify(token, process.env.JWT_SECRET);
            userRole = decoded?.role;
        } catch (error) {
            return res.status(401).json({
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

        const { is_active, is_verified, status } = req.query;

        // Base query
        let query = 'SELECT id, first_name, last_name, email, mobile, is_active, is_verified, role, createdAt, updatedAt FROM users WHERE 1=1';
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
            const [users, metadata] = await sequelize.query(query, { replacements });
            res.status(200).json({
                code: 1,
                message: 'Users successfully fetched.',
                users
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

export default handler;