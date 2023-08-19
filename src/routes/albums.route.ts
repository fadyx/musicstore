import { Router } from "express";

import { auth, validationMiddleware } from "@/middleware";
import { CreateAlbumDTO } from "@/dtos";
import { AlbumsController } from "@/controllers";

export class AlbumsRoute {
	public router = Router();

	constructor(public readonly path: string, private albumsController: AlbumsController) {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}/`, auth, validationMiddleware(CreateAlbumDTO, "body"), this.albumsController.createNewAlbum);
	}
}

export default AlbumsRoute;
