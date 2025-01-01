// --------------------------------
// |
// | Service Name: Get Service Logs
// | Description: Kullanıcıların yaptıkları isteklerin loglarını getiren servis
// | Parameters: guid
// | Endpoint: /api/private/logs/get-service-logs
// |
// ------------------------------


import { verify } from 'jsonwebtoken';
import Log from '@/models/Log';
import privateMiddleware from "@/middleware/private/index"

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            // Token'ı decode et ve kullanıcı rolünü al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { role } = decoded;

            // Super admin (2) değilse işlem reddedilir
            if (role !== 2) {
                return res.status(200).json({
                    message: "You do not have permission to access the logs.",
                    code: 0,
                });
            }

            // Request body'den gelen guid al
            const { guid } = req.body;

            if (!guid) {
                return res.status(200).json({
                    code: 0,
                    message: "GUID is required.",
                });
            }

            // logs koleksiyonunda, guid ile eşleşen kayıtları sorgula
            const logs = await Log.find({ guid });

            if (logs.length === 0) {
                return res.status(200).json({
                    code: 0,
                    message: `No log found with the provided GUID: ${guid}.`,
                });
            }

            return res.status(200).json({
                code: 1,
                message: "Log successfully retrieved.",
                logs,
            });

        } catch (error) {
            console.error('Error fetching logs:', error);
            return res.status(500).json({
                message: "An error occurred while fetching the log.",
                error: error.message,
                code: 0,
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default privateMiddleware(handler);
