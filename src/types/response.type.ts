export type SuccessfulResponse<T> = {
	message: string;
	data: undefined | T | T[];
};

export type FailureResponse = {
	error: string;
};
