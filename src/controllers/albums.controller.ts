import StatusCodes from "http-status-codes";

import { asyncRequestHandler, HttpResponse } from "@/utils";
import { CreateAlbumDTO } from "@/dtos";
import { AlbumsService } from "@/services";

export class AlbumsController {
	constructor(private readonly albumsService: AlbumsService) {}

	public createNewAlbum = asyncRequestHandler(async (req, res) => {
		const newAlbumDTO: CreateAlbumDTO = req.body;
		const album = await this.albumsService.createNewAlbum(newAlbumDTO);
		return res.status(StatusCodes.CREATED).json(HttpResponse.success("Album created successfully.", album));
	});
}

export default AlbumsController;
