// --------------------------------
// |
// | Service Name: Get All Users
// | Description: Service that fetches all users in the Users table.
// | Parameters: is_active, is_verified, status 
// | Endpoints: /api/public/users/get-users 
// | /api/public/users/get-users?is_active=true
// | /api/public/users/get-users?is_verified=true
// | /api/public/users/get-users?status=1
// | /api/public/users/get-users?is_active=true&is_verified=true&status=2
// ------------------------------

import sequelize from '@/config/db';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        const { is_active, is_verified, status } = req.query;

        // Base query
        let query = 'SELECT id, first_name, last_name, email, mobile, is_active, is_verified, role, created_at, updated_at FROM users WHERE 1=1';
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

        try {
            const [users, metadata] = await sequelize.query(query, { replacements });
            res.status(200).json(users);
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