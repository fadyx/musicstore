import { StatusCodes } from "http-status-codes";

import { CreateSongDTO, PaginationParameters } from "@/dtos";
import { SongsRepository } from "@/repositories";
import { HttpException } from "@/exceptions";
import { Song } from "@/types";

import { DetailedSong } from "./models";

export class SongsService {
	constructor(private readonly songsRepository: SongsRepository) {}

	public async listSongs(pagination: PaginationParameters, filter?: { q?: string }) {
		const songs = await this.songsRepository.listSongs(pagination, filter);
		return songs;
	}

	public async getSong(id: number): Promise<DetailedSong> {
		const song = await this.songsRepository.getDetailedSong(id);
		if (!song) throw new HttpException(StatusCodes.NOT_FOUND, "Song not found.");
		return song;
	}

	public async createNewSong(albumDTO: CreateSongDTO): Promise<Song> {
		const song = await this.songsRepository.createNewSong(albumDTO);
		return song;
	}
}

export default SongsService;
