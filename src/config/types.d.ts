import { Token } from "@/types";

import { Album, Artist, Song, User, AlbumSongs, ArtistAlbums, ArtistSongs } from "./tables";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DB_DATABASE: string;
			DB_HOST: string;
			DB_PASSWORD: string;
			DB_PORT: string;
			DB_SSL: string;
			DB_USER: string;
			NODE_ENV: "test" | "dev" | "prod";
			PORT: string;
			SECRET_KEY: string;
			TOKEN_DURATION: string;
		}
	}

	namespace Express {
		export interface Request {
			token?: Token;
		}
	}
}

declare module "knex/types/tables" {
	interface Tables {
		albums: Album;
		artists: Artist;
		songs: Song;
		users: User;
		artistAlbums: ArtistAlbums;
		artistSongs: ArtistSongs;
		albumSongs: AlbumSongs;
	}
}
