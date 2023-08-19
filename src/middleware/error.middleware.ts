import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";

import { HttpException } from "@/exceptions";
import { HttpResponse, debug } from "@/utils";

const log = debug("errors middleware");

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
	log(error);

	if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError || error instanceof NotBeforeError) {
		return res.status(StatusCodes.UNAUTHORIZED).json(HttpResponse.failure("Authentication error."));
	}

	if (error instanceof HttpException) {
		const status: number = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
		const message: string = error.message || "Something went wrong";

		return res.status(status).json(HttpResponse.failure(message));
	}

	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(HttpResponse.failure("Something went wrong"));
};

export default errorMiddleware;
