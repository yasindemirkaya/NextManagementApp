// --------------------------------
// |
// | Service Name: Get All Users
// | Description: Service that fetches all users based on various filters.
// | Parameters: is_active, is_verified, role, created_by, updated_by
// | Endpoints:
// | /api/private/users/get-users
// | /api/private/users/get-users?is_active=true
// | /api/private/users/get-users?is_verified=true
// | /api/private/users/get-users?role=2
// | /api/private/users/get-users?created_by=035275ae-69fd-4fab-ad58-c0f3ed2a18d9
// | /api/private/users/get-users?updated_by=035275ae-69fd-4fab-ad58-c0f3ed2a18d9
// |
// ------------------------------

import User from '@/models/User';
import { verify } from 'jsonwebtoken';
import privateMiddleware from "@/middleware/private/index";
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    // İsteğin yapıldığı dil
    const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

    if (req.method === 'GET') {
        // Token'ı decode et ve kullanıcı rolünü al
        let userRole;
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            userRole = decoded?.role;
        } catch (error) {
            // INVALID TOKEN
            return res.status(200).json({
                message: responseMessages.common[lang].invalidToken,
                code: 0
            });
        }

        // Role kontrolü: Eğer userRole 0 ise, veri döndürme 
        // if (userRole === 0) {
        //     return res.status(403).json({
        //         message: responseMessages.common[lang].noPermission,
        //         code: 0
        //     });
        // }

        const { is_active, is_verified, role, created_by, updated_by, limit, page, search } = req.query;

        // Base query options
        let queryOptions = {};

        // is_active
        if (is_active) {
            queryOptions.is_active = is_active === 'true';
        }

        // is_verified
        if (is_verified) {
            queryOptions.is_verified = is_verified === 'true';
        }

        // role
        if (role) {
            queryOptions.role = role;
        }

        // created_by
        if (created_by) {
            queryOptions.created_by = created_by;
        }

        // updated_by
        if (updated_by) {
            queryOptions.updated_by = updated_by;
        }

        // Search functionality
        if (search) {
            // `search` parametresiyle kullanıcı adı, soyadı veya e-posta adresinde arama yapılabilir
            queryOptions.$or = [
                { first_name: { $regex: search, $options: 'i' } },
                { last_name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // İstekte bulunan kullanıcının rolüne göre dönen veriyi filtreleme
        // if (userRole === 1) {
        //     queryOptions.role = { $in: [0, 1, 2] };
        // }

        // Sayfalama ayarları (Varsayılan değerler kullanılırsa tüm verileri getiririz)
        let limitValue = limit ? parseInt(limit) : null;
        let pageValue = page ? parseInt(page) : null;
        let skipValue = (pageValue && limitValue) ? (pageValue - 1) * limitValue : 0;

        try {
            // Toplam kullanıcı sayısını al
            const totalUsers = await User.countDocuments(queryOptions);
            // Toplam sayfa sayısını hesapla
            const totalPages = limitValue ? Math.ceil(totalUsers / limitValue) : 1;

            // Kullanıcıları getir
            const users = limitValue && pageValue
                ? await User.find(queryOptions)
                    .limit(limitValue)
                    .skip(skipValue)
                : await User.find(queryOptions);

            // Kullanıcıları `created_by` ve `updated_by` ile birlikte almak için populate kullanımı
            const userIds = new Set();
            users.forEach(user => {
                if (user.created_by) userIds.add(user.created_by);
                if (user.updated_by) userIds.add(user.updated_by);
            });

            let userInfoMap = {};
            if (userIds.size > 0) {
                const userInfos = await User.find({ '_id': { $in: Array.from(userIds) } }, 'first_name last_name');
                userInfos.forEach(user => {
                    userInfoMap[user._id.toString()] = `${user.first_name} ${user.last_name}`;
                });
            }

            // Kullanıcı bilgilerini "created_by" ve "updated_by" alanlarına ekle
            const formattedUsers = users.map(user => ({
                ...user.toObject(),
                created_by: userInfoMap[user.created_by?.toString()] || user.created_by,
                updated_by: userInfoMap[user.updated_by?.toString()] || user.updated_by,
            }));

            res.status(200).json({
                code: 1,
                message: responseMessages.users[lang].success,
                users: formattedUsers,
                pagination: {
                    totalData: totalUsers,
                    totalPages: totalPages,
                    currentPage: pageValue,
                    limit: limitValue
                }
            });
        } catch (error) {
            res.status(500).json({
                error: responseMessages.users[lang].failedToFetch
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            message: responseMessages.common[lang].methodNotAllowed
        });
    }
};

export default privateMiddleware(handler);
