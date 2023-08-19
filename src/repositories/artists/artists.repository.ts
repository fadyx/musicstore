import { StatusCodes } from "http-status-codes";
import { DatabaseError } from "pg";
import { Knex } from "knex";

import { Artist, DatabaseErrorCode, PaginatedResponse } from "@/types";
import { ArtistDiscography } from "@/services";
import { PaginationParameters } from "@/dtos";
import { filterTotalCount } from "@/utils";
import { HttpException } from "@/exceptions";

export class ArtistsRepository {
	constructor(private readonly db: Knex) {}

	public async getArtistDiscography(id: number): Promise<ArtistDiscography | null> {
		const escapedId = this.db.raw("?", id);
		const results = await this.db.raw(`
			with albums as (
				select a.*
				from public.artist_albums aa
				join albums a on a.id = aa.album_id 
				where aa.artist_id = ${escapedId}
			),
			songs as (
				select s.*
				from public.artist_songs asng
				join songs s on s.id = asng.song_id  
				where asng.artist_id = ${escapedId}
			)
			select artists.*,
				json_agg(DISTINCT albums.*) AS albums,
				json_agg(DISTINCT songs.*) AS songs
			from artists
			left join albums on artists.id = ${escapedId}
			left join songs on artists.id = ${escapedId}
			where artists.id = ${escapedId}
			group by artists.id;
		`);

		const discography: ArtistDiscography | undefined = results.rows.pop();

		return discography ?? null;
	}

	public async listArtists(pagination: PaginationParameters, filter?: { q?: string }): Promise<PaginatedResponse<Artist>> {
		const offset = pagination.limit * (pagination.page - 1);

		const whereClause = filter?.q?.length ? this.db.raw(`where a.name ilike '%?%'`, this.db.raw(filter.q)) : "";

		const results = await this.db.raw(`
			select *, count(*) OVER() AS total_count
			from artists a
			${whereClause}
			offset ${this.db.raw("?", offset)}
			limit ${this.db.raw("?", pagination.limit)};
		`);

		const totalCount: number = Number(results.rows[0]?.totalCount) || 0;
		const totalPages: number = totalCount === 0 ? 0 : Math.ceil(totalCount / pagination.limit);
		const currentPage: number = pagination.page;
		const perPage: number = pagination.limit;

		const paginationMetadata = { totalCount, totalPages, currentPage, perPage };

		const artists: Artist[] = results.rows?.map(filterTotalCount);

		return { data: artists, pagination: paginationMetadata };
	}

	public async createNewArtist(dto: Partial<Artist>): Promise<Artist> {
		try {
			const insertionResults = await this.db("artists").insert(dto).returning("*");
			const artist = insertionResults[0];
			return artist;
		} catch (error) {
			if (error instanceof DatabaseError) {
				switch (error.code) {
					case DatabaseErrorCode.foreignKeyViolation:
						throw new HttpException(StatusCodes.BAD_REQUEST, "No user found with the provided ID.");
				}
			}
			throw new HttpException(StatusCodes.BAD_REQUEST, "Could not create new artist.");
		}
	}
}

export default ArtistsRepository;
