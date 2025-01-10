const responseMessages = {
    // LOGIN
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
    },
    // REGISTER
    register: {
        en: {
            success: 'User registered successfully',
            emailAlreadyInUse: 'Email already in use',
            mobileAlreadyInUse: 'Mobile number already in use',
            allFieldsRequired: 'All fields are required',
            methodNotAllowed: 'Method not allowed',
            errorOccurred: 'An error occurred during registration',
        },
        tr: {
            success: 'Kullanıcı başarıyla kaydedildi',
            emailAlreadyInUse: 'E-posta adresi zaten kullanımda',
            mobileAlreadyInUse: 'Mobil numara zaten kullanımda',
            allFieldsRequired: 'Tüm alanlar gereklidir',
            methodNotAllowed: 'Yöntem izin verilmedi',
            errorOccurred: 'Kayıt sırasında bir hata oluştu',
        }
    }
};

export default responseMessages;
