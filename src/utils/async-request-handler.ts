import type { Request, Response, NextFunction, RequestHandler } from "express";

export type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;

export const asyncRequestHandler: (fn: AsyncRequestHandler) => RequestHandler =
	(fn: AsyncRequestHandler): RequestHandler =>
	(req, res, next) => {
		fn(req, res, next).catch(next);
	};
