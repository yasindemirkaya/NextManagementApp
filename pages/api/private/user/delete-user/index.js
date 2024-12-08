// --------------------------------
// |
// | Service Name: Delete User
// | Description: Service that deletes the user's account permanently.
// | Endpoint: /api/private/user/delete-user
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import User from '@/models/User';
import privateMiddleware from "@/middleware/private/index"

const deleteUserById = async (userId) => {
    // Kullanıcıyı veritabanından sil
    const result = await User.deleteOne({ _id: userId });
    return result;
};

const handler = async (req, res) => {
    if (req.method === 'DELETE') {
        try {
            // Token'ı decode et ve kullanıcı id'sini al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Kullanıcıyı silme işlemi
            const result = await deleteUserById(userId);

            // Silinen belge sayısını kontrol et
            if (result.deletedCount === 0) {
                return res.status(200).json({
                    message: 'User not found or already deleted',
                    code: 0
                });
            }

            // Başarılı silme yanıtı
            return res.status(200).json({
                message: 'Your account has been successfully deleted',
                code: 1
            });
        } catch (error) {
            console.error('Error deleting user account:', error);
            return res.status(500).json({ message: 'An error occurred', error: error.message });
        }
    } else {
        // Sadece DELETE isteği kabul edilir
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default privateMiddleware(handler);