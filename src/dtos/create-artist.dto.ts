import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateArtistDTO {
	@IsNotEmpty()
	@IsString()
	public name!: string;

	@IsNotEmpty()
	@IsString()
	public bio!: string;
}
