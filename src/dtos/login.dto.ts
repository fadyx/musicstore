import { IsString, IsNotEmpty, IsEmail, ValidateIf, IsOptional } from "class-validator";

export class LoginDTO {
	@IsOptional()
	@IsString()
	@ValidateIf((dto: LoginDTO) => Boolean(dto.email?.length))
	public username?: string;

	@IsOptional()
	@IsEmail()
	@ValidateIf((dto: LoginDTO) => Boolean(dto.username?.length))
	public email?: string;

	@IsNotEmpty()
	@IsString()
	public password!: string;
}
