import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";

import config from "@/config";
import { errorMiddleware } from "@/middleware";
import { debug } from "@/utils";

const log = debug("app");

class App {
	public app: express.Application;
	public env: "prod" | "dev" | "test";

	constructor(routes: any) {
		this.app = express();
		this.env = config.nodeEnv || "dev";

		this.initializeMiddleware();
		this.initializeRoutes(routes);
		this.initializeErrorHandling();
	}

	public getServer() {
		return this.app;
	}

	private initializeMiddleware() {
		if (config.nodeEnv === "dev") this.app.use(morgan("dev"));
		this.app.use(hpp());
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private initializeRoutes(routes: any) {
		log("REGISTERED ENDPOINTS:");
		routes.forEach((route: any) => {
			this.app.use("/", route.router);
			route.router.stack.forEach((s: any) => {
				const p = s?.route?.path;
				const m = Object.keys(s?.route?.methods).find((k) => s?.route?.methods[k]);
				log(`${m?.toUpperCase()}\t\t${p}`);
			});
		});
	}

	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}
}

export default App;
