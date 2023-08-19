import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateSongDTO {
	@IsNotEmpty()
	@IsString()
	public title!: string;

	@IsNotEmpty()
	@IsNumber()
	public duration!: number;

	@IsNotEmpty()
	@IsNumber()
	public artistId!: number;

	@IsOptional()
	@IsNumber()
	public albumId?: number;
}
