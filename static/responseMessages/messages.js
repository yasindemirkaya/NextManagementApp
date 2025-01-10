const responseMessages = {
    login: {
        en: {
            success: 'Successfully logged in. Redirecting to dashboard...',
            invalidCredentials: 'Invalid credentials. Please check your email or password.',
            userNotFound: 'User not found',
            methodNotAllowed: 'Method Not Allowed',
        },
        tr: {
            success: 'Giriş başarılı. Panele yönlendiriliyorsunuz...',
            invalidCredentials: 'Geçersiz bilgiler. Lütfen e-posta adresinizi veya şifrenizi kontrol edin.',
            userNotFound: 'Kullanıcı bulunamadı',
            methodNotAllowed: 'Yöntem İzin Verilmiyor',
        }
    }
};

export default responseMessages;
