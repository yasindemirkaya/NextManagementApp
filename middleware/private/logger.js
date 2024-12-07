import Log from '@/models/Log';

export default async function logger(req, res, next) {
    try {
        // Kullanıcı Id'si (varsa)
        const userId = req.user ? req.user.userId : null;

        // IP adresi
        const ip = req.connection.remoteAddress;

        // User Agent bilgisi
        const userAgent = req.headers['user-agent'];

        // URL
        const path = req.url;

        // HTTP Method (GET, POST, vb.)
        const method = req.method;

        // İstek verisi
        const request = JSON.stringify({ ...req.query, ...req.body });

        // Response yazılmadan önce orijinal send metodunu kaydediyoruz
        const originalSend = res.send;

        res.send = async (...args) => {
            const response = args[0] || {};

            try {
                // Log verisini veritabanına kaydediyoruz
                await Log.create({
                    userId: userId,
                    ip: ip,
                    userAgent: userAgent,
                    path: path,
                    request: request,
                    response: JSON.stringify(response),  // response da JSON olarak saklanabilir
                    method: method,
                });
            } catch (error) {
                console.log("DB Log Error: ", error);
            }

            // Orijinal response metodunu çağırıyoruz
            return originalSend.apply(res, args);
        };
    } catch (error) {
        console.log("Log Error: ", error);
    }

    next();
}
