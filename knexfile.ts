import { Knex } from "knex";

import config from "./src/config";

const { dbDatabase, dbHost, dbPassword, dbPort, dbSsl, dbUser } = config;

const dbConfig: Knex.Config = {
	client: "pg",
	connection: {
		charset: "utf8",
		timezone: "UTC",
		host: dbHost,
		port: Number(dbPort),
		user: dbUser,
		password: dbPassword,
		database: dbDatabase,
		ssl: dbSsl === "true" ? true : false,
	},
	migrations: {
		directory: "src/databases/migrations",
		tableName: "migrations",
	},
	seeds: {
		directory: "src/databases/seeds",
	},
};

export default dbConfig;
