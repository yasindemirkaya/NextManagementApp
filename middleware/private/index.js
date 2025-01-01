import verifyToken from './verifyToken';
import privateRateLimit from './rateLimit';
import logger from './logger';
import connectToDatabase from '@/config/db';
import { v4 as uuidv4 } from 'uuid';

export default function applyMiddlewares(handler) {
   return async (req, res) => {
      const middlewareArray = [connectToDatabase, privateRateLimit, verifyToken, logger];

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

      const originalJson = res.json;
      res.json = (body) => {
         const createdAt = new Date().toISOString();
         const guid = `${uuidv4()}-${createdAt}`;
         body.guid = guid;
         return originalJson.call(res, body);
      };

      await handler(req, res);
   };
}
