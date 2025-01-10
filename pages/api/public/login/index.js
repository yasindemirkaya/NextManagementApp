// --------------------------------
// |
// | Service Name: Login
// | Description: Service that logs user in.
// | Endpoint: /api/public/login
// |
// ------------------------------

import User from '@/models/User';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { serialize } from 'cookie';
import publicMiddleware from "@/middleware/public/index";
import responseMessages from '@/static/responseMessages/messages';

const handler = async (req, res) => {
    try {
        // İsteğin yapıldığı dil
        const lang = req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en';

        if (req.method === 'POST') {
            const { email, password } = req.body;

            // Kullanıcıyı MongoDB'den email ile bul
            const user = await User.findOne({ email });

            if (user) {
                // Kullanıcının şifresini kontrol et
                const isPasswordValid = await compare(password, user.password); // Hashlenmiş şifre ile karşılaştır

                if (isPasswordValid) {
                    // Başarılı giriş, JWT oluştur
                    const token = sign({
                        id: user._id,
                        email: user.email,
                        role: user.role,
                    }, process.env.JWT_SECRET, {
                        expiresIn: '1h'
                    });

                    // Token'ı cookie'ye set et
                    res.setHeader('Set-Cookie', serialize('token', token, {
                        httpOnly: false, // Tarayıcı tarafından erişilebilir
                        secure: process.env.NODE_ENV === 'production', // HTTPS üzerinden çalışır (production'da)
                        maxAge: 60 * 60, // 1 saat (saniye cinsinden)
                        sameSite: 'Strict', // CSRF koruması
                        path: '/', // Tüm yollar için geçerli
                    }));

                    // SUCCESS
                    return res.status(200).json({
                        message: responseMessages.login[lang].success,
                        code: 1,
                        user: {
                            id: user._id,
                            email: user.email,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            role: user.role
                        },
                        token: token
                    });
                } else {
                    // INVALID CREDENTIALS
                    return res.status(200).json({
                        message: responseMessages.login[lang].invalidCredentials,
                        code: 0
                    });
                }
            } else {
                // USER NOT FOUND
                return res.status(200).json({
                    message: responseMessages.login[lang].userNotFound,
                    code: 0,
                });
            }
        } else {
            // Sadece POST isteğine izin ver
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({
                message: responseMessages.common[lang].methodNotAllowed
            });
        }
    } catch (error) {
        res.status(503).json({
            message: error.message,
            data: [],
            code: 0
        });
    }
}

export default publicMiddleware(handler);