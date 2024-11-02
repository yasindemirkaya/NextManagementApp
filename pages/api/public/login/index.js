import sequelize from '@/config/db';

// Kullanıcıyı veritabanından bulup doğrulama işlemi
const findUserByEmail = async (email) => {
    const [users] = await sequelize.query('SELECT * FROM users WHERE email = ?', {
        replacements: [email],
    });
    return users.length > 0 ? users[0] : null;
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        // Kullanıcıyı veritabanından bul
        const user = await findUserByEmail(email);

        if (user) {
            // Kullanıcının şifresini kontrol et
            if (user.password === password) {
                // Başarılı giriş
                return res.status(200).json({ message: 'Success', data: user });
            } else {
                // Şifre yanlış
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            // Kullanıcı bulunamadı
            return res.status(404).json({ message: 'User not found' });
        }
    } else {
        // Sadece POST isteğine izin ver
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}