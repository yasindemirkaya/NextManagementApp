// --------------------------------
// |
// | Service Name: Update User By ID
// | Description: Service that allows administrators to update other users' accounts.
// | Parameters: id, first_name, last_name, email, mobile, role, is_active, is_verified
// | Endpoint: /api/private/user/update-user-by-id
// |
// ------------------------------

import User from '@/models/User';
import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index'

// Kullanıcıyı ID'ye göre veritabanında bul
const findUserById = async (id) => {
    return await User.findById(id);
};

const updateUserById = async (id, updateData) => {
    // ID'yi de updateData'ya ekleyelim
    updateData.updatedAt = new Date();
    return await User.findByIdAndUpdate(id, updateData, { new: true });
};

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            // Token decode et ve kullanıcı bilgilerini al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: loggedInUserId, role: loggedInUserRole } = decoded;

            // Standard User'lar (role: 0) bu servisi kullanamaz
            if (loggedInUserRole === 0) {
                return res.status(403).json({
                    message: 'You are not authorized to access this service.',
                    code: 0
                });
            }

            // Request body ve id'yi alın
            const { id: requestedUserId, ...updateData } = req.body;

            if (!requestedUserId) {
                return res.status(400).json({
                    message: 'User ID is required.',
                    code: 0
                });
            }

            // Güncellenen kullanıcıyı bul
            const requestedUser = await findUserById(requestedUserId);
            if (!requestedUser) {
                return res.status(404).json({
                    message: 'User not found.',
                    code: 0
                });
            }

            // Yetki kontrolü
            if (loggedInUserRole === 1) {
                // Admin, sadece Standard User'ları (role: 0) güncelleyebilir
                if (requestedUser.role !== 0) {
                    return res.status(403).json({
                        message: 'You are not authorized to update this user.',
                        code: 0
                    });
                }
            } else if (loggedInUserRole === 2) {
                // Super Admin, kendisi gibi Super Adminler hariç herkesi güncelleyebilir.
                if (requestedUser.role === 2) {
                    return res.status(403).json({
                        message: 'You are not authorized to update this user.',
                        code: 0
                    });
                }
            }

            // Güncelleme işlemi (updatedBy alanını backend'de belirtiyoruz)
            const isUpdated = await updateUserById(requestedUserId, {
                ...updateData,
                updated_by: loggedInUserId
            });

            if (!isUpdated) {
                return res.status(500).json({
                    message: 'Failed to update user.',
                    code: 0
                });
            }

            return res.status(200).json({
                message: 'User updated successfully.',
                code: 1
            });
        } catch (error) {
            // Mongoose hatası kontrolü
            if (error.name === 'MongoError' && error.code === 11000) {
                return res.status(400).json({
                    message: 'Email or mobile number already in use.',
                    code: 0
                });
            }

            return res.status(500).json({
                message: 'An error occurred.',
                error: error.message,
                code: 0
            });
        }
    } else {
        // Sadece PUT metodu kabul edilir
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default privateMiddleware(handler);