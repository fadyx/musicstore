import StatusCodes from "http-status-codes";

import { asyncRequestHandler, HttpResponse } from "@/utils";
import { SongsService } from "@/services";
import { CreateSongDTO, ListQuery } from "@/dtos";

export class SongsController {
	constructor(private readonly songsService: SongsService) {}

	public listSongs = asyncRequestHandler(async (req, res) => {
		const paginationParameters = req.query as unknown as ListQuery;
		const filter = { q: paginationParameters.q };
		const songs = await this.songsService.listSongs(paginationParameters, filter);
		return res.status(StatusCodes.OK).json(HttpResponse.success("Retrieved songs successfully.", songs));
	});

	public getSong = asyncRequestHandler(async (req, res) => {
		const songId = Number(req.params.id);
		const song = await this.songsService.getSong(songId);
		return res.status(StatusCodes.OK).json(HttpResponse.success("Retrieved song successfully.", song));
	});

	public createNewSong = asyncRequestHandler(async (req, res) => {
		const newSongDTO: CreateSongDTO = req.body;
		const album = await this.songsService.createNewSong(newSongDTO);
		return res.status(StatusCodes.CREATED).json(HttpResponse.success("Created song successfully.", album));
	});
}

export default SongsController;
