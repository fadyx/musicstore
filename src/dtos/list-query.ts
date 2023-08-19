import { IsOptional, IsString } from "class-validator";
import { PaginationParameters } from "./pagination";

export class ListQuery extends PaginationParameters {
	@IsOptional()
	@IsString()
	public q?: string;
	constructor() {
		super();
	}
}
