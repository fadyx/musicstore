import knex from "knex";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexStringcase = require("knex-stringcase");

import config from "@/config";

const { dbHost, dbPort, dbPassword, dbDatabase, dbSsl, dbUser } = config;

export const knexConfig = {
	client: "pg",
	connection: {
		charset: "utf8",
		timezone: "UTC",
		host: dbHost,
		port: dbPort,
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
	recursiveStringcase: () => true,
};

const options = knexStringcase(knexConfig);

export default knex(options);
