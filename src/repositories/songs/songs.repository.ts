import { StatusCodes } from "http-status-codes";
import { Knex } from "knex";
import { DatabaseError } from "pg";

import { DatabaseErrorCode, PaginatedResponse, Song } from "@/types";
import { CreateSongDTO, PaginationParameters } from "@/dtos";
import { DetailedSong } from "@/services";
import { HttpException } from "@/exceptions";
import { filterTotalCount } from "@/utils";

export class SongsRepository {
	constructor(private readonly db: Knex) {}

	public async listSongs(pagination: PaginationParameters, filter?: { q?: string }): Promise<PaginatedResponse<Song>> {
		const offset = pagination.limit * (pagination.page - 1);

		const whereClause = filter?.q?.length ? this.db.raw(`where s.title ilike '%?%'`, this.db.raw(filter.q)) : "";

		const results = await this.db.raw(`
			select *, count(*) OVER() AS total_count
			from songs s
			${whereClause}
			offset ${this.db.raw("?", offset)}
			limit ${this.db.raw("?", pagination.limit)};
		`);

		const totalCount: number = Number(results.rows[0]?.totalCount) || 0;
		const totalPages: number = totalCount === 0 ? 0 : Math.ceil(totalCount / pagination.limit);
		const currentPage: number = pagination.page;
		const perPage: number = pagination.limit;

		const paginationMetadata = { totalCount, totalPages, currentPage, perPage };

		const songs: Song[] = results.rows?.map(filterTotalCount);

		return { data: songs, pagination: paginationMetadata };
	}

	public async createNewSong(dto: CreateSongDTO): Promise<Song> {
		const trx = await this.db.transaction();
		try {
			const { artistId, albumId, ...songData } = dto;
			const insertionResults = await trx("songs").insert(songData).returning("*");
			const song = insertionResults[0];

			const promises: Promise<any>[] = [];

			promises.push(trx("artistSongs").insert({ artistId, songId: song.id }));

			if (albumId) promises.push(trx("albumSongs").insert({ albumId, songId: song.id }));

			await Promise.all(promises);

			await trx.commit();

			return song;
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

	public async getDetailedSong(id: number): Promise<DetailedSong | null> {
		const escapedId = this.db.raw("?", id);
		const results = await this.db.raw(`
			WITH albums AS (
				SELECT a.*
				FROM public.album_songs asng
				JOIN albums a ON a.id = asng.album_id 
				WHERE asng.song_id = ${escapedId}
			),
			artists AS (
				SELECT DISTINCT ar.*
				FROM public.artist_songs asng
				JOIN artists ar ON ar.id = asng.artist_id  
				WHERE asng.song_id =${escapedId}
			)
			SELECT songs.*,
				COALESCE(json_agg(DISTINCT albums.*) FILTER (WHERE albums.id IS NOT NULL),'[]'::json) AS albums,
				COALESCE(json_agg(DISTINCT artists.*) FILTER (WHERE artists.id IS NOT NULL),'[]'::json) AS artists
			FROM songs
			left JOIN albums ON songs.id = ${escapedId}
			left JOIN artists ON songs.id = ${escapedId}
			WHERE songs.id = ${escapedId}
			GROUP BY songs.id;
		`);

		const discography: DetailedSong | undefined = results.rows.pop();

		return discography ?? null;
	}
}

export default SongsRepository;
