import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateAlbumDTO {
	@IsNotEmpty()
	@IsString()
	public title!: string;

	@IsNotEmpty()
	@IsString()
	public artworkUrl!: string;

	@IsNotEmpty()
	@IsNumber()
	public artistId!: number;
}
