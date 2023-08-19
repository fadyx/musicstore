import StatusCodes from "http-status-codes";

import { asyncRequestHandler, HttpResponse } from "@/utils";
import { ArtistsService } from "@/services";
import { CreateArtistDTO, ListQuery } from "@/dtos";

export class ArtistsController {
	constructor(private readonly artistsService: ArtistsService) {}

	public listArtists = asyncRequestHandler(async (req, res) => {
		const paginationParameters = req.query as unknown as ListQuery;
		const filter = { q: paginationParameters.q };
		const artists = await this.artistsService.listArtists(paginationParameters, filter);
		return res.status(StatusCodes.OK).json(HttpResponse.success("Retrieved artists successfully.", artists));
	});

	public getArtist = asyncRequestHandler(async (req, res) => {
		const artistId = Number(req.params.id);
		const artist = await this.artistsService.getArtistDiscography(artistId);
		return res.status(StatusCodes.OK).json(HttpResponse.success("Retrieved artist successfully.", artist));
	});

	public createNewArtist = asyncRequestHandler(async (req, res) => {
		const dto: CreateArtistDTO = req.body;
		const currentUserId = req.token?.userId;
		const artist = await this.artistsService.createNewArtist(dto, currentUserId!);
		return res.status(StatusCodes.CREATED).json(HttpResponse.success("Created artist successfully.", artist));
	});
}

export default ArtistsController;
