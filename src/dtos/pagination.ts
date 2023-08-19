import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class PaginationParameters {
	@Type(() => Number)
	@IsNumber()
	public page: number;

	@Type(() => Number)
	@IsNumber()
	public limit: number;

	constructor() {
		this.page = 1;
		this.limit = 20;
	}
}
