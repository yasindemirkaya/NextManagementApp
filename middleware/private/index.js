import verifyToken from './verifyToken';
import privateRateLimit from './rateLimit';
import logger from './logger'

export default function applyMiddlewares(handler) {
   return async (req, res) => {
      const middlewareArray = [logger, privateRateLimit, verifyToken]

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