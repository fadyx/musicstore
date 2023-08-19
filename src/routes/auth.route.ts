import { Router } from "express";

import { AuthController } from "@/controllers";
import { RegistrationDTO, LoginDTO } from "@/dtos";
import { validationMiddleware } from "@/middleware";

export class AuthRoute {
	public router = Router();

	constructor(public readonly path: string, private authController: AuthController) {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}/register`, validationMiddleware(RegistrationDTO, "body"), this.authController.register);
		this.router.post(`${this.path}/login`, validationMiddleware(LoginDTO, "body"), this.authController.login);
	}
}

export default AuthRoute;
