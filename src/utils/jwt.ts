import { verify, sign } from "jsonwebtoken";

import config from "@/config";
import { Token } from "@/types";

export const jwt = {
	verify: (token: string): Token => {
		const decodedToken = verify(token, config.secretKey) as Token;
		return decodedToken;
	},
	sign: (payload: Token, duration?: string): string => {
		const expiresIn = duration ?? config.tokenDuration;
		const token: string = sign(payload, config.secretKey, { expiresIn });
		return token;
	},
};

export default jwt;
