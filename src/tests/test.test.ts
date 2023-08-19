import { describe, expect, test, it } from "@jest/globals";
import request from "supertest";

import server from "../server";

describe("initial test", () => {
	test("adds 1 + 2 to equal 3", () => {
		expect(1 + 2).toBe(3);
	});
});

describe("Health", () => {
	it("tests health endpoint", async () => {
		const response = await request(server).get("/health");
		expect(response.body).toHaveProperty("message", "OK");
	});
});
