import { Album, Artist, Song } from "@/types";

export type ArtistDiscography = {
	artist: Artist;
	albums: Album[];
	songs: Song[];
};
