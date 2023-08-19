import { Knex } from "knex";
import { StatusCodes } from "http-status-codes";

import { Album, DatabaseErrorCode } from "@/types";
import { HttpException } from "@/exceptions";
import { CreateAlbumDTO } from "@/dtos/create-album.dto";
import { DatabaseError } from "pg";

export class AlbumsRepository {
	constructor(private readonly db: Knex) {}

	public async createNewAlbum(dto: CreateAlbumDTO): Promise<Album> {
		const trx = await this.db.transaction();
		try {
			const { artistId, ...albumData } = dto;
			const insertionResults = await trx("albums").insert(albumData).returning("*");
			const album = insertionResults[0];
			await trx("artistAlbums").insert({ artistId, albumId: album.id });

			await trx.commit();

			return album;
		} catch (error) {
			await trx.rollback();
			if (error instanceof DatabaseError) {
				switch (error.code) {
					case DatabaseErrorCode.foreignKeyViolation:
						throw new HttpException(StatusCodes.BAD_REQUEST, "No artist found with the provided ID.");
				}
			}
			throw new HttpException(StatusCodes.BAD_REQUEST, "Could not create new album.");
		}
	}
}

export default AlbumsRepository;
