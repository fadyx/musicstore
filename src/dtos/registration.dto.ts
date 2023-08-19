import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class RegistrationDTO {
	@IsNotEmpty()
	@IsString()
	public username!: string;

	@IsNotEmpty()
	@IsEmail()
	public email!: string;

	@IsNotEmpty()
	@IsString()
	public password!: string;
}
