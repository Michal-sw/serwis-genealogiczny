import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log("\x1b[33m *** REQUEST *** \x1b[0m");
  console.log(req.url);
  console.log('Authorization - ', req.headers.authorization);
  console.log('cookie - ', req.headers.cookie);
  console.log('body - ', req.body);
  console.log("\x1b[33m *** END *** \x1b[0m");
  return next()
}

export default logger;