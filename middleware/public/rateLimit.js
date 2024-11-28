import rateLimit from "express-rate-limit";

// Kullanıcı agent kontrolü
const skipGoogleBot = (req) => {
    const userAgent = req.headers["user-agent"] || "";
    return userAgent.toLowerCase().includes("googlebot");
};

// Rate limit ayarları
const publicApiRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100, // 1 dakikada 100 isteğe izin verilir
    message: {
        message: "Too many requests. Please wait and try again later.",
        code: 429,
    },
    standardHeaders: true, // `RateLimit-*` başlıklarını döndürür
    legacyHeaders: false,  // Eski başlıkları devre dışı bırakır
    skip: skipGoogleBot, // Googlebot için sınırı atlar
});

export default publicApiRateLimiter;
