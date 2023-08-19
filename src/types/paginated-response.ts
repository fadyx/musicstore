type PaginationResponseMetadata = {
	totalCount: number;
	totalPages: number;
	currentPage: number;
	perPage: number;
};

export type PaginatedResponse<T> = {
	data: T[];
	pagination: PaginationResponseMetadata;
};
