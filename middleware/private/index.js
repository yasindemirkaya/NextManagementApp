import verifyToken from './verifyToken';

export default function applyMiddlewares(handler) {
   return async (req, res) => {
      const middlewareArray = [verifyToken]

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