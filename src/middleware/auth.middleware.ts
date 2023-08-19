import { Request } from "express";

import { HttpException } from "@/exceptions";
import { asyncRequestHandler, jwt } from "@/utils";

const extractToken = (req: Request): string | null => {
	const authorizationHeader = req.header("Authorization") || req.header("authorization");
	const token = authorizationHeader ? authorizationHeader.split(/^[B|b]earer /)[1] : null;
	return token;
};

export const auth = asyncRequestHandler(async (req, res, next) => {
	const token = extractToken(req);
	if (!token) return next(new HttpException(400, "Missing authentication token."));

	const tokenPayload = jwt.verify(token);

	req.token = tokenPayload;
	return next();
});

export default auth;
