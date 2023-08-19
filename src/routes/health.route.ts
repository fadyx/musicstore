import { Router } from "express";

import { HealthController } from "@/controllers";

export class HealthRoute {
	public router = Router();

	constructor(private readonly path: string, private healthController: HealthController) {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, this.healthController.check);
	}
}

export default HealthRoute;
