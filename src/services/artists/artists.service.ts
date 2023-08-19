import { StatusCodes } from "http-status-codes";

import { CreateArtistDTO, PaginationParameters } from "@/dtos";
import { HttpException } from "@/exceptions";
import { ArtistsRepository } from "@/repositories";

import { ArtistDiscography } from "./models";

export class ArtistsService {
	constructor(private readonly artistsRepository: ArtistsRepository) {}

	public async getArtistDiscography(id: number): Promise<ArtistDiscography> {
		const discography = await this.artistsRepository.getArtistDiscography(id);
		if (!discography) throw new HttpException(StatusCodes.NOT_FOUND, "Artist not found.");
		return discography;
	}

	public async listArtists(pagination: PaginationParameters, filter?: { q?: string }) {
		const artists = await this.artistsRepository.listArtists(pagination, filter);
		return artists;
	}

	public async createNewArtist(dto: CreateArtistDTO, byUserId: number) {
		const artist = await this.artistsRepository.createNewArtist({ ...dto, userId: byUserId });
		return artist;
	}
}

export default ArtistsService;
