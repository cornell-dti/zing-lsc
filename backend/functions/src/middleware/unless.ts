import { Request, Response, NextFunction, RequestHandler } from 'express'

/** Use middleware unless the path is: */
export const unless =
  (middleware: RequestHandler, ...paths: string[]) =>
  (req: Request, res: Response, next: NextFunction) =>
    paths.some((path) => path === req.path)
      ? next()
      : middleware(req, res, next)
