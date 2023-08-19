export * from "./albums";
export * from "./artists";
export * from "./songs";
export * from "./users";

import db from "@/databases";

import { UsersRepository } from "./users";
import { ArtistsRepository } from "./artists";
import { AlbumsRepository } from "./albums";
import { SongsRepository } from "./songs";

export const usersRepository = new UsersRepository(db);
export const artistsRepository = new ArtistsRepository(db);
export const albumsRepository = new AlbumsRepository(db);
export const songsRepository = new SongsRepository(db);
