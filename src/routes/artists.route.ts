import { Router } from "express";

import { auth, validationMiddleware } from "@/middleware";
import { LoginDTO, ListQuery, CreateArtistDTO } from "@/dtos";
import { ArtistsController } from "@/controllers";

export class ArtistsRoute {
	public router = Router();

	constructor(public readonly path: string, private artistsController: ArtistsController) {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}/`, validationMiddleware(ListQuery, "query"), this.artistsController.listArtists);
		this.router.get(`${this.path}/:id`, this.artistsController.getArtist);
		this.router.post(`${this.path}/`, auth, validationMiddleware(CreateArtistDTO, "body"), this.artistsController.createNewArtist);
	}
}

export default ArtistsRoute;
