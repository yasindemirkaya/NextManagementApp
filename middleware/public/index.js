import connectToDatabase from '@/config/db';
import publicRateLimit from './rateLimit';

export default function applyMiddlewares(handler) {
    return async (req, res) => {
        const middlewareArray = [connectToDatabase, publicRateLimit];

        for (const middleware of middlewareArray) {
            await new Promise((resolve, reject) => {
                middleware(req, res, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }

        await handler(req, res);
    };
}