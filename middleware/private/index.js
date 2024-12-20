import verifyToken from './verifyToken';
import privateRateLimit from './rateLimit';
import logger from './logger'
import connectToDatabase from '@/config/db';


export default function applyMiddlewares(handler) {
   return async (req, res) => {
      const middlewareArray = [connectToDatabase, privateRateLimit, verifyToken, logger]

      for (const middleware of middlewareArray) {
         await new Promise((resolve, reject) => {
            middleware(req, res, (err) => {
               if (err) {
                  reject(err)
               } else {
                  resolve()
               }
            });
         });
      }
      await handler(req, res)
   }
}