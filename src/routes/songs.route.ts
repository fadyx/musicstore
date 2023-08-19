import { Router } from "express";

import { auth, validationMiddleware } from "@/middleware";
import { SongsController } from "@/controllers";
import { CreateSongDTO, ListQuery } from "@/dtos";

export class SongsRoute {
	public router = Router();

	constructor(public readonly path: string, private songsController: SongsController) {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}/`, validationMiddleware(ListQuery, "query"), this.songsController.listSongs);
		this.router.get(`${this.path}/:id`, this.songsController.getSong);
		this.router.post(`${this.path}/`, auth, validationMiddleware(CreateSongDTO, "body"), this.songsController.createNewSong);
	}
}

export default SongsRoute;
