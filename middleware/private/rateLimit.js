import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many requests, please try again later.",
        code: 429,
    },
    standardHeaders: true, // Rate limit bilgilerini `RateLimit-*` başlıklarında döner
    legacyHeaders: false,  // Eski `X-RateLimit-*` başlıklarını kapatır
});

export default limiter;