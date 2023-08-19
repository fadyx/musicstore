import { Album } from "@/types";
import { AlbumsRepository } from "@/repositories";
import { CreateAlbumDTO } from "@/dtos";

export class AlbumsService {
	constructor(private readonly albumsRepository: AlbumsRepository) {}

	public async createNewAlbum(albumDTO: CreateAlbumDTO): Promise<Album> {
		const album = await this.albumsRepository.createNewAlbum(albumDTO);
		return album;
	}
}

export default AlbumsService;
