import "reflect-metadata";

import http from "http";

import App from "@/app";

import config from "@/config";

import { AuthRoute, SongsRoute, AlbumsRoute, ArtistsRoute, HealthRoute } from "@/routes";
import { AuthController, AlbumsController, ArtistsController, SongsController, HealthController } from "@/controllers";
import { AuthService, AlbumsService, ArtistsService, SongsService } from "@/services";
import { usersRepository, artistsRepository, albumsRepository, songsRepository } from "@/repositories";

const authService = new AuthService(usersRepository);
const artistsService = new ArtistsService(artistsRepository);
const albumsService = new AlbumsService(albumsRepository);
const songsService = new SongsService(songsRepository);

const authController = new AuthController(authService);
const artistsController = new ArtistsController(artistsService);
const albumsController = new AlbumsController(albumsService);
const songsController = new SongsController(songsService);
const healthController = new HealthController();

const bootstrap = () => {
	const routes = [];

	routes.push(new HealthRoute("/api/healthz", healthController));
	routes.push(new AuthRoute("/api/auth", authController));
	routes.push(new ArtistsRoute("/api/artists", artistsController));
	routes.push(new AlbumsRoute("/api/albums", albumsController));
	routes.push(new SongsRoute("/api/songs", songsController));

	const app = new App(routes);
	const rest = app.getServer();
	const server = http.createServer(rest);

	server.listen(config.port);

	const port = config.port;

	console.log("========================================================");
	console.log(`REST Server is listening on http://localhost:${port}`);
	console.log("========================================================");

	return rest;
};

const server = bootstrap();

export default server;
