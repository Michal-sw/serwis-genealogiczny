import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers);
  console.log(req.url);
  return next()
}

export default logger;