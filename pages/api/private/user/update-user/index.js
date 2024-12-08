// --------------------------------
// |
// | Service Name: Update User
// | Description: Service that the user updates their own data.
// | Parameters: first_name, last_name, email, mobile is_active, is_verified, updated_by
// | Endpoint: /api/private/user/update-user
// |
// ------------------------------

import { verify } from 'jsonwebtoken';
import privateMiddleware from "@/middleware/private/index"
import User from '@/models/User'; // User modelini import ediyoruz

// Update methodu
const updateUserById = async (id, userData) => {
    const { firstName, lastName, email, mobile, isActive, isVerified, updatedBy } = userData;

    // Kullanıcıyı id ile bul ve güncelle
    const user = await User.findByIdAndUpdate(
        id,
        {
            first_name: firstName,
            last_name: lastName,
            email,
            mobile,
            is_active: isActive,
            is_verified: isVerified,
            updated_by: updatedBy // updatedBy artık token'dan alınıyor
        },
        { new: true } // Güncellenen kullanıcıyı geri döndür
    );

    return { success: true, user };
};

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            // Token'ı decode et ve kullanıcı id'sini al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Kullanıcıyı MongoDB'den al
            const user = await User.findById(userId);

            // Kullanıcı bulunamazsa
            if (!user) {
                return res.status(200).json({
                    message: 'User not found',
                    code: 0
                });
            }

            // Gelen veriyi al
            const { firstName, lastName, email, mobile, isActive, isVerified } = req.body;

            // Email ya da mobil numara zaten var mı diye kontrol et
            const emailExists = await User.findOne({ email });
            const mobileExists = await User.findOne({ mobile });

            if ((emailExists && emailExists.id !== userId) || (mobileExists && mobileExists.id !== userId)) {
                return res.status(200).json({
                    message: 'Email or mobile number already in use.',
                    code: 0
                });
            }

            // Güncelleme işlemi
            const result = await updateUserById(userId, {
                firstName,
                lastName,
                email,
                mobile,
                isActive,
                isVerified,
                updatedBy: userId // updatedBy değeri burada token'dan alınan userId olarak atanır
            });

            // Eğer kullanıcı güncellenemediyse
            if (!result.user) {
                return res.status(200).json({
                    message: 'No changes were made.',
                    code: 0
                });
            }

            // Başarılı güncelleme yanıtı
            return res.status(200).json({
                message: 'User data successfully updated',
                code: 1
            });
        } catch (error) {
            // Hata mesajı
            console.error('Error updating user data:', error);
            return res.status(500).json({
                message: 'An error occurred',
                error: error.message
            });
        }
    } else {
        // Sadece PUT isteği kabul edilir
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default privateMiddleware(handler);
