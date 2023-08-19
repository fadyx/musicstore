import { Knex } from "knex";
import { DatabaseError } from "pg";
import { StatusCodes } from "http-status-codes";

import { DatabaseErrorCode, User } from "@/types";
import { HttpException } from "@/exceptions";
import { PublicUser } from "@/repositories";

export class UsersRepository {
	constructor(private readonly db: Knex) {}

	public async findUserByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
		const results = await this.db.raw(`
			select *
			from users u
			where u.username = ${this.db.raw("?", emailOrUsername)} or u.email = ${this.db.raw("?", emailOrUsername)};
		`);

		const user: User | undefined = results.rows.pop();
		return user ?? null;
	}

	public async createUser(userDto: Partial<User>): Promise<PublicUser> {
		try {
			const results = await this.db("users").insert(userDto).returning(["id", "username", "email", "createdAt", "updatedAt"]);
			const user = results.pop();
			if (!user) throw new HttpException(StatusCodes.BAD_REQUEST, "Could not add new user.");
			return user;
		} catch (error) {
			if (error instanceof DatabaseError) {
				switch (error.code) {
					case DatabaseErrorCode.uniqueViolation:
						throw new HttpException(StatusCodes.BAD_REQUEST, "The email or username provided are unavailable for registration.");
				}
			}
			throw error;
		}
	}
}

export default UsersRepository;
