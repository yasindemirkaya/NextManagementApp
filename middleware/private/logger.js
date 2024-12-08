import Log from '@/models/Log';

export default async function logger(req, res, next) {
    try {
        // Kullanıcı Id'si (varsa)
        const userId = req.user ? req.user.userId : null;

        // IP adresi
        const ip = req.connection.remoteAddress || req.socket.remoteAddress;

        // User Agent bilgisi
        const userAgent = req.headers['user-agent'];

        // URL
        const path = req.originalUrl || req.url;

        // HTTP Method (GET, POST, vb.)
        const method = req.method;

        // İstek verisi
        const request = {
            query: req.query,
            body: req.body,
        };

        // Response yazılmadan önce orijinal send metodunu kaydediyoruz
        const originalSend = res.send;

        res.send = async (...args) => {
            const response = args[0] || {};

            try {
                // Log verisini MongoDB'ye kaydediyoruz
                await Log.create({
                    userId: userId,
                    ip: ip,
                    userAgent: userAgent,
                    path: path,
                    request: request, // İstek verisini JSON formatında saklıyoruz
                    response: response,  // Response'u doğrudan saklıyoruz
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
