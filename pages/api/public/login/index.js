// --------------------------------
// |
// | Service Name: Login
// | Description: Service that logs user in.
// | Endpoint: /api/public/login
// |
// ------------------------------


import sequelize from '@/config/db';
import { sign } from 'jsonwebtoken'
import { compare } from 'bcrypt'
import { serialize } from 'cookie';

// Kullanıcıyı veritabanından bulup doğrulama işlemi
const findUserByEmail = async (email) => {
    const [users] = await sequelize.query('SELECT * FROM users WHERE email = ?', {
        replacements: [email],
    });
    return users.length > 0 ? users[0] : null;
};

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { email, password } = req.body;

            // Kullanıcıyı veritabanından bul
            const user = await findUserByEmail(email);

            if (user) {
                // Kullanıcının şifresini kontrol et
                const isPasswordValid = await compare(password, user.password); // Hashlenmiş şifre ile karşılaştır

                if (isPasswordValid) {
                    // Başarılı giriş, JWT oluştur
                    const token = sign({
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    }, process.env.JWT_SECRET, {
                        expiresIn: '1h' // Token süresi
                    });

                    // Token'ı cookie'ye set et
                    res.setHeader('Set-Cookie', serialize('token', token, {
                        httpOnly: false, // Tarayıcı tarafından erişilebilir
                        secure: process.env.NODE_ENV === 'production', // HTTPS üzerinden çalışır (production'da)
                        maxAge: 60 * 60, // 1 saat (saniye cinsinden)
                        sameSite: 'Strict', // CSRF koruması
                        path: '/', // Tüm yollar için geçerli
                    }));

                    return res.status(200).json({
                        message: 'Success',
                        code: 1,
                        user: {
                            id: user.id,
                            email: user.email,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            role: user.role
                        },
                    });
                } else {
                    // Şifre yanlış
                    return res.status(200).json({
                        message: 'Invalid credentials. Please check your email or password.',
                        code: 0
                    });
                }
            } else {
                // Kullanıcı bulunamadı
                return res.status(200).json({
                    message: 'User not found',
                    code: 0,
                });
            }
        } else {
            // Sadece POST isteğine izin ver
            res.setHeader('Allow', ['POST']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        res.status(503).json({
            message: error.message,
            data: [],
            code: 0
        })
    }

}