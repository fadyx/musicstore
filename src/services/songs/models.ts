import { Album, Artist, Song } from "@/types";

export type DetailedSong = Song & { album?: Album[]; artist: Artist[] };
