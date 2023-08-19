import { FailureResponse, SuccessfulResponse } from "@/types";

export const HttpResponse = {
	success: (message: string, data?: unknown): SuccessfulResponse<typeof data> => {
		if (data && typeof data === "object" && "pagination" in data && "data" in data) return { message, ...data };
		return { message, data };
	},
	failure: (error: string): FailureResponse => {
		return { error };
	},
};

export default HttpResponse;
