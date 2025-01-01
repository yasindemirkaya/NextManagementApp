import Log from '@/models/Log';

export default async function logger(req, res, next) {
    try {
        // Kullanıcı Id'si (varsa)
        const userId = req.user ? req.user.id : null;

        // Kullanıcı username
        const userEmail = req.user ? req.user.email : null;

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

            // Eğer response bir stringse, onu JSON objesine çevir
            let parsedResponse = response;
            if (typeof response === 'string') {
                try {
                    parsedResponse = JSON.parse(response); // JSON string'ini objeye dönüştür
                } catch (error) {
                    console.log("Response JSON parsing error: ", error);
                }
            }

            try {
                // Log verisini MongoDB'ye kaydediyoruz
                await Log.create({
                    userId: userId,
                    userEmail: userEmail,
                    ip: ip,
                    userAgent: userAgent,
                    path: path,
                    request: request,
                    response: parsedResponse,
                    method: method,
                    guid: parsedResponse?.guid
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
