import { StatusCodes } from "http-status-codes";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { RequestHandler } from "express";

import { HttpException } from "@/exceptions";

export const validationMiddleware = (
	type: ClassConstructor<object>,
	value: "body" | "query" | "params" = "body",
	skipMissingProperties = false,
	whitelist = true,
	forbidNonWhitelisted = true,
): RequestHandler => {
	return (req, _res, next) => {
		const pti = plainToInstance(type, req[value]);
		validate(pti, { skipMissingProperties, whitelist, forbidNonWhitelisted, forbidUnknownValues: true }).then((errors: ValidationError[]) => {
			if (!errors.length) {
				req[value] = pti;
				return next();
			}
			const message = errors.map((error: ValidationError) => Object.values(error.constraints || {})).join(", ") || "Validation error.";
			next(new HttpException(StatusCodes.BAD_REQUEST, message));
		});
	};
};

export default { validationMiddleware };
