import StatusCodes from "http-status-codes";

import db from "@/databases";
import { asyncRequestHandler, HttpResponse } from "@/utils";

export class HealthController {
	public check = asyncRequestHandler(async (_req, res) => {
		try {
			const results = await db.raw("select now()");
			const { now } = results.rows.pop();
			return res.status(StatusCodes.OK).json(HttpResponse.success("OK", { now }));
		} catch (error) {
			console.log(error);
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(HttpResponse.failure("NOT OK"));
		}
	});
}

export default HealthController;
