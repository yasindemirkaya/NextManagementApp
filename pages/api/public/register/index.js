// --------------------------------
// |
// | Service Name: Register
// | Description: Service that creates a user account.
// | Parameters: first_name, last_name, email, password, mobile, is_active, is_verified, role
// | Endpoint: /api/public/register
// |
// ------------------------------

import User from '@/models/User';
import hashPassword from '@/helpers/hash';
import publicMiddleware from "@/middleware/public/index";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { firstName, lastName, email, password, mobile, userGroups } = req.body;

        // Data check
        if (!firstName || !lastName || !email || !password || !mobile) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            // MongoDB'de e-posta adresi ve mobil numaranın var olup olmadığını kontrol et
            const existingUser = await User.findOne({ email });
            const existingMobile = await User.findOne({ mobile });

            if (existingUser) {
                return res.status(409).json({ message: 'Email already in use' });
            }
            if (existingMobile) {
                return res.status(409).json({ message: 'Mobile number already in use' });
            }

            // Şifreyi hash'le
            const hashedPassword = await hashPassword(password, 10);

            // Yeni kullanıcı oluştur
            const newUser = new User({
                first_name: firstName,
                last_name: lastName,
                email,
                password: hashedPassword,
                mobile,
                is_active: true, // Kullanıcı aktif
                is_verified: false, // Kullanıcı doğrulanmamış
                role: 0, // Standart kullanıcı rolü
                created_by: null, // Başlangıçta null olacak
                updated_by: null, // Başlangıçta null olacak
                user_groups: userGroups || [] // Başlangıçta boş bir array olacak
            });

            // Kullanıcının ID'si ile created_by ve updated_by'yi ayarla
            newUser.created_by = newUser._id;
            newUser.updated_by = newUser._id;

            // Yeni kullanıcıyı veritabanına kaydet
            await newUser.save();

            // Kayıt başarılı olduğunda, HTTP yanıtını döndür
            res.status(200).json({
                result: true,
                message: 'User registered successfully',
                user: email
            });
        } catch (error) {
            console.error('Error in registration:', error);
            res.status(500).json({ message: 'An error occurred during registration', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default publicMiddleware(handler)