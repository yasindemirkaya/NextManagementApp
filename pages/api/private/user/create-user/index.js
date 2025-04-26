// --------------------------------
// |
// | Service Name: Create User
// | Description: Service that allows admin or super admin to create a new user.
// | Parameters: first_name, last_name, email, password, mobile, is_active, is_verified, role, created_by
// | Endpoint: /api/private/user/create-user
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import hashPassword from '@/helpers/hash';
import User from '@/models/User';
import privateMiddleware from "@/middleware/private/index"
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'POST') {
        try {
            // Token'ı decode et ve kullanıcı rolünü al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: adminId, role } = decoded;

            // Kullanıcı admin (1) veya super admin (2) değilse işlem reddedilir
            if (role !== 1 && role !== 2) {
                return res.status(403).json({
                    message: responseMessages.user.createUser[lang].noPermission,
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
                    message: responseMessages.user.createUser[lang].allFieldsRequired,
                    code: 0
                });
            }

            // Şifreyi hash'le
            const hashedPassword = await hashPassword(password, 10);

            // Yeni kullanıcı oluştur
            try {
                const newUser = new User({
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

                await newUser.save();

                return res.status(200).json({
                    message: responseMessages.user.createUser[lang].success,
                    code: 1,
                    user: email
                });
            } catch (error) {
                // MongoDB Unique constraint hatası
                if (error.code === 11000) {
                    return res.status(200).json({
                        message: responseMessages.user.createUser[lang].emailOrMobileInUse,
                        code: 0,
                    });
                }

                // Diğer hataları yakala
                return res.status(500).json({
                    message: responseMessages.common[lang].errorOccured,
                    error: error.message,
                    code: 0
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: responseMessages.common[lang].errorOccured,
                error: error.message,
                code: 0
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
}

export default privateMiddleware(handler);
