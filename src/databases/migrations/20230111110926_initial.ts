import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.raw(`
	create schema if not exists public;

	create or replace function "public".update_updated_at_timestamp_column() returns trigger as $$ declare _new record;
	begin
		_new := new;
		_new."updated_at" = now();
		return _new;
	end;
	$$ language plpgsql;
	
	comment on function "public"."update_updated_at_timestamp_column" is 'function to set value of column "updated_at" to current timestamp on row update.';
	
	create table users (
		"id" 			serial primary key,
		"username" 		text not null unique,
		"email" 		text not null unique,
		"password" 		text not null,
		
		"created_at"    timestamptz not null default now(),
		"updated_at"    timestamptz
	);
	
	create trigger "set_public_users_updated_at" before update on "public"."users" for each row execute procedure update_updated_at_timestamp_column();
	
	create table artists (
		"id" 			serial primary key,
		"name" 			text not null,
		"bio" 			text not null,
		"user_id" 		integer references "public"."users" ("id"),
	
		"created_at"    timestamptz not null default now(),
		"updated_at"    timestamptz
	);
	
	create trigger "set_public_artists_updated_at" before update on "public"."artists" for each row execute procedure update_updated_at_timestamp_column();
	
	create table albums (
		"id" 			serial primary key,
		"title" 		text not null,
		"artwork_url" 	text not null,
		
		"created_at"    timestamptz not null default now(),
		"updated_at"    timestamptz
	);
	
	create trigger "set_public_albums_updated_at" before update on "public"."albums" for each row execute procedure update_updated_at_timestamp_column();
	
	create table songs (
		"id" 			serial primary key,
		"title" 		text not null,
		"duration" 		integer not null,
		
		"created_at"    timestamptz not null default now(),
		"updated_at"    timestamptz
	);
	
	create trigger "set_public_songs_updated_at" before update on "public"."songs" for each row execute procedure update_updated_at_timestamp_column();
	
	create table artist_songs (
		"artist_id" 	integer references "public"."artists" ("id"),
		"song_id" 		integer references "public"."songs" ("id"),
		primary key 	("artist_id", "song_id")
	);
	
	create table artist_albums (
		"artist_id" 	integer references "public"."artists" ("id"),
		"album_id" 		integer references "public"."albums" ("id"),
		primary key 	("artist_id", "album_id")
	);
	
	create table album_songs (
		"album_id" 		integer references "public"."albums" ("id"),
		"song_id" 		integer references "public"."songs" ("id"),
		primary key 	("album_id", "song_id")
	);
  `);
}

export async function down(knex: Knex): Promise<void> {
	await knex.raw(`drop schema if exists "public" cascade;`);
}
