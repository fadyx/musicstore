import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";

import { RegistrationDTO, LoginDTO } from "@/dtos";
import { HttpException } from "@/exceptions";
import { UsersRepository, PublicUser } from "@/repositories";
import { jwt } from "@/utils";
import { Token } from "@/types";

export class AuthService {
	constructor(private readonly usersRepository: UsersRepository) {}

	public async login(loginDTO: LoginDTO): Promise<{ token: string }> {
		try {
			const emailOrUsername = loginDTO.email || loginDTO.username;
			if (!emailOrUsername) throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid Credentials.");

			const user = await this.usersRepository.findUserByEmailOrUsername(emailOrUsername);
			if (!user) throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid credentials.");

			const isPasswordCorrect: boolean = await bcrypt.compare(loginDTO.password, user.password);
			if (!isPasswordCorrect) throw new HttpException(StatusCodes.CONFLICT, "Invalid credentials.");

			const token = jwt.sign(this.createTokenPayload(user));

			return { token };
		} catch (error) {
			throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid credentials.");
		}
	}

	public async register(registrationDTO: RegistrationDTO): Promise<{ user: PublicUser; token: string }> {
		const saltRounds = 10;

		const passwordHash = await bcrypt.hash(registrationDTO.password, saltRounds);
		registrationDTO.password = passwordHash;

		const user = await this.usersRepository.createUser(registrationDTO);

		const token = jwt.sign(this.createTokenPayload(user));

		return { user, token };
	}

	private createTokenPayload(user: PublicUser): Token {
		const { id } = user;
		const payload: Token = { userId: id };
		return payload;
	}

	public signToken(admin: PublicUser): string {
		const payload = this.createTokenPayload(admin);
		return jwt.sign(payload);
	}
}

export default AuthService;
