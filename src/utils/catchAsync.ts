import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Catch async error in controller
 */
const catchAsync =
    (fn: RequestHandler) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };

export default catchAsync;
