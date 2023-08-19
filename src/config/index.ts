import { config } from "dotenv";

const configFilePath = `.env.${process.env.NODE_ENV || "dev"}`;

config({ path: configFilePath });

const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_SSL, DB_USER, NODE_ENV, PORT, SECRET_KEY, TOKEN_DURATION } = process.env;

const envs = ["DB_DATABASE", "DB_HOST", "DB_PASSWORD", "DB_PORT", "DB_SSL", "DB_USER", "NODE_ENV", "PORT", "SECRET_KEY", "TOKEN_DURATION"];

for (const v of envs) if (!process.env[v]) throw new Error(`Missing environment variable ${v}`);

export const env = {
	dbDatabase: DB_DATABASE,
	dbHost: DB_HOST,
	dbPassword: DB_PASSWORD,
	dbPort: DB_PORT,
	dbSsl: DB_SSL,
	dbUser: DB_USER,
	nodeEnv: NODE_ENV,
	port: PORT,
	secretKey: SECRET_KEY,
	tokenDuration: TOKEN_DURATION,
} as const;

export default env;
