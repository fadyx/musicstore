import StatusCodes from "http-status-codes";

import { RegistrationDTO } from "@/dtos";
import { asyncRequestHandler, HttpResponse } from "@/utils";
import { AuthService } from "@/services";
import { LoginDTO } from "@/dtos/login.dto";

export class AuthController {
	constructor(private readonly authService: AuthService) {}

	public register = asyncRequestHandler(async (req, res) => {
		const registrationDTO: RegistrationDTO = req.body;
		const { token } = await this.authService.register(registrationDTO);
		return res.status(StatusCodes.OK).json(HttpResponse.success("Successful registration.", { accessToken: token }));
	});

	public login = asyncRequestHandler(async (req, res) => {
		const loginDTO: LoginDTO = req.body;
		const { token } = await this.authService.login(loginDTO);
		return res.status(StatusCodes.OK).json(HttpResponse.success("Successful login.", { accessToken: token }));
	});
}

export default AuthController;
