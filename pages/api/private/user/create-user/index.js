// --------------------------------
// |
// | Service Name: Create User
// | Description: Service that allows admin or super admin to create a new user.
// | Parameters: first_name, last_name, email, password, mobile, is_active, is_verified, role, created_by
// | Endpoint: /api/private/admin/create-user
// |
// ------------------------------

import { Op } from 'sequelize';
import hashPassword from '@/helpers/hash';
import { verify } from 'jsonwebtoken';
import { isTokenExpiredServer } from '@/helpers/tokenVerifier';
import User from '@/models/User';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // JWT token doğrulama
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    message: "You must be logged in as admin to create a user.",
                    code: 0
                });
            }

            // Token'ın süresi dolmuş mu diye kontrol et
            if (isTokenExpiredServer(token)) {
                return res.status(401).json({
                    message: "Token has expired. Please log in again.",
                    code: 0
                });
            }

            // Token'ı decode et ve kullanıcı rolünü al
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: adminId, role } = decoded;

            // Kullanıcı admin (1) veya super admin (2) değilse işlem reddedilir
            if (role !== 1 && role !== 2) {
                return res.status(403).json({
                    message: "You do not have permission to create a user.",
                    code: 0,
                });
            }

            // Request body
            const {
                firstName,
                lastName,
                email,
                mobile,
                password,
                isActive,
                isVerified,
                role: userRole,
            } = req.body;

            if (!firstName || !lastName || !email || !password || !mobile || isActive === undefined || isVerified === undefined || userRole === undefined) {
                return res.status(200).json({
                    message: "All fields are required.",
                    code: 0
                });
            }

            // Existing user kontrolü
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [{ email }, { mobile }],
                },
            });

            if (existingUser) {
                return res.status(200).json({
                    message: "Email or mobile number already in use.",
                    code: 0,
                });
            }

            // Şifreyi hash'le
            const hashedPassword = await hashPassword(password, 10);

            // Yeni kullanıcı oluştur
            const newUser = await User.create({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: hashedPassword,
                mobile: mobile,
                is_active: isActive,
                is_verified: isVerified,
                role: userRole,
                created_by: adminId,
            });

            return res.status(200).json({
                message: "User successfully created.",
                code: 1,
                user: email
            });
        } catch (error) {
            console.error('Error creating user:', error);
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