// reference:  https://www.postgresql.org/docs/current/errcodes-appendix.html
export enum DatabaseErrorCode {
	checkViolation = "23514",
	foreignKeyViolation = "23503",
	uniqueViolation = "23505",
}
